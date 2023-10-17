import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeTokenData,
  useSelectedVaultLists,
  useUserVaultDelegationBalance,
  useUserVaultShareBalance,
  useVaultFeeInfo,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  PrizePowerTooltip,
  VaultContributionsTooltip,
  VaultFeeTooltip,
  WinChanceTooltip
} from '@shared/react-components'
import { ExternalLink, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, getVaultId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { ReactNode, useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { AccountVaultDelegationAmount } from '@components/Account/AccountVaultDelegationAmount'
import { AccountVaultOdds } from '@components/Account/AccountVaultOdds'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { VaultContributions } from './VaultContributions'
import { VaultFeePercentage } from './VaultFeePercentage'
import { VaultPrizePower } from './VaultPrizePower'
import { VaultTotalDeposits } from './VaultTotalDeposits'

interface VaultPageInfoProps {
  vault: Vault
  className?: string
}

export const VaultPageInfo = (props: VaultPageInfoProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  const { address: userAddress } = useAccount()

  const { data: shareData, isFetched: isFetchedShareData } = useVaultShareData(vault)
  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  const { data: shareBalance } = useUserVaultShareBalance(vault, userAddress as Address)
  const { data: delegationBalance } = useUserVaultDelegationBalance(vault, userAddress as Address)

  const { data: vaultFee } = useVaultFeeInfo(vault)

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const prizePools = useSupportedPrizePools()
  const prizePool =
    !!vault && Object.values(prizePools).find((prizePool) => prizePool.chainId === vault.chainId)
  const { data: prizeToken } = usePrizeTokenData(prizePool as PrizePool)

  const foundInVaultLists = useMemo(() => {
    return Object.values({ ...localVaultLists, ...importedVaultLists }).some((list) => {
      for (const listVault of list.tokens) {
        if (vault.id === getVaultId(listVault)) {
          return true
        }
      }
    })
  }, [vault, localVaultLists, importedVaultLists])

  return (
    <div className={classNames('flex flex-col w-full gap-2 text-sm md:text-base', className)}>
      {!!userAddress && (
        <VaultInfoRow
          name={t_vault('headers.yourBalance')}
          data={<AccountVaultBalance vault={vault} className='!flex-row gap-1' />}
        />
      )}
      {!!userAddress &&
        !!shareBalance &&
        !!delegationBalance &&
        delegationBalance - shareBalance.amount > 0n && (
          <VaultInfoRow
            name={t_vault('headers.delegatedToYou')}
            data={<AccountVaultDelegationAmount vault={vault} className='!flex-row gap-1' />}
          />
        )}
      {!!userAddress && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              {t_vault('headers.yourWinChance')}
              <WinChanceTooltip
                iconSize='sm'
                intl={{ text: t_tooltips('winChance') }}
                className='text-sm md:text-base'
                iconClassName='text-pt-purple-200'
              />
            </span>
          }
          data={<AccountVaultOdds vault={vault} />}
        />
      )}
      <VaultInfoRow
        name={
          <span className='flex gap-2 items-center'>
            {t_vault('headers.prizePower')}
            <PrizePowerTooltip
              iconSize='sm'
              intl={{ text: t_tooltips('prizePower'), learnMore: t_common('learnMore') }}
              className='text-sm md:text-base'
              iconClassName='text-pt-purple-200'
            />
          </span>
        }
        data={<VaultPrizePower vault={vault} />}
      />
      <VaultInfoRow name={t_vault('headers.tvl')} data={<VaultTotalDeposits vault={vault} />} />
      {!!prizeToken && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              {t_vault('headers.contributions', { number: 7 })}
              <VaultContributionsTooltip
                tokenSymbol={prizeToken.symbol}
                numberOfDays={7}
                iconSize='sm'
                intl={t_tooltips}
                className='text-sm md:text-base'
                iconClassName='text-pt-purple-200'
              />
            </span>
          }
          data={<VaultContributions vault={vault} />}
        />
      )}
      <VaultInfoRow
        name={t_vault('headers.depositToken')}
        data={
          isFetchedTokenData ? (
            !!tokenData ? (
              <VaultInfoToken token={tokenData} />
            ) : (
              '?'
            )
          ) : (
            <Spinner />
          )
        }
      />
      <VaultInfoRow
        name={t_vault('headers.prizeToken')}
        data={
          isFetchedShareData ? (
            !!shareData ? (
              <VaultInfoToken token={shareData} />
            ) : (
              '?'
            )
          ) : (
            <Spinner />
          )
        }
      />
      {!!vault.yieldSourceURI && (
        <VaultInfoRow
          name={t_vault('headers.yieldSource')}
          data={<VaultInfoURI URI={vault.yieldSourceURI} />}
        />
      )}
      {!!vaultFee && vaultFee.percent > 0 && (
        <>
          <VaultInfoRow
            name={
              <span className='flex gap-2 items-center'>
                {t_vault('headers.vaultFee')}
                <VaultFeeTooltip
                  iconSize='sm'
                  intl={{ text: t_tooltips('vaultFee') }}
                  className='text-sm md:text-base'
                  iconClassName='text-pt-purple-200'
                />
              </span>
            }
            data={<VaultFeePercentage vault={vault} />}
          />
          <VaultInfoRow
            name={t_vault('headers.feeRecipient')}
            data={<VaultInfoAddress chainId={vault.chainId} address={vaultFee.recipient} />}
          />
        </>
      )}
      {!foundInVaultLists && <NotInVaultListsWarning />}
    </div>
  )
}

interface VaultInfoRowProps {
  name: ReactNode
  data: ReactNode
}

const VaultInfoRow = (props: VaultInfoRowProps) => {
  const { name, data } = props

  return (
    <div className='inline-flex w-full items-center justify-between'>
      <span className='text-pt-purple-100'>{name}</span>
      <span>{data}</span>
    </div>
  )
}

interface VaultInfoTokenProps {
  token: { chainId: number; address: string; symbol: string }
}

const VaultInfoToken = (props: VaultInfoTokenProps) => {
  const { token } = props

  return (
    <span>
      {token.symbol ?? '?'} |{' '}
      <ExternalLink
        href={getBlockExplorerUrl(token.chainId, token.address, 'token')}
        size='sm'
        className='text-pt-purple-200'
      >
        {shorten(token.address, { short: true }) ?? ''}
      </ExternalLink>
    </span>
  )
}

interface VaultInfoAddressProps {
  chainId: number
  address: Address
}

const VaultInfoAddress = (props: VaultInfoAddressProps) => {
  const { chainId, address } = props

  return (
    <span>
      <ExternalLink
        href={getBlockExplorerUrl(chainId, address)}
        size='sm'
        className='text-pt-purple-200'
      >
        {shorten(address) ?? ''}
      </ExternalLink>
    </span>
  )
}

interface VaultInfoURIProps {
  URI: string
}

const VaultInfoURI = (props: VaultInfoURIProps) => {
  const { URI } = props

  const cleanURI = useMemo(() => {
    if (URI.startsWith('http')) {
      return /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i.exec(URI)?.[1] ?? ''
    } else if (URI.startsWith('ipfs')) {
      return URI // TODO: prettify this output
    } else if (URI.endsWith('.eth')) {
      return URI // TODO: prettify this output
    } else {
      return URI
    }
  }, [URI])

  return (
    <ExternalLink href={URI} size='sm' className='text-pt-purple-200'>
      {cleanURI}
    </ExternalLink>
  )
}

interface NotInVaultListsWarningProps {
  className?: string
}

const NotInVaultListsWarning = (props: NotInVaultListsWarningProps) => {
  const { className } = props

  const t = useTranslations('Vault')

  return (
    <span
      className={classNames(
        'w-full px-6 py-1 text-center text-sm font-medium bg-pt-warning-light text-pt-warning-dark rounded',
        className
      )}
    >
      {t('shortWarningNotInVaultLists')}
    </span>
  )
}
