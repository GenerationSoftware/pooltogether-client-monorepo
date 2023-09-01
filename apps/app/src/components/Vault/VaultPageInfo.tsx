import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultDelegationBalances,
  useVaultFeeInfo,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePowerTooltip, VaultFeeTooltip, WinChanceTooltip } from '@shared/react-components'
import { ExternalLink, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { ReactNode, useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { AccountVaultDelegationAmount } from '@components/Account/AccountVaultDelegationAmount'
import { AccountVaultOdds } from '@components/Account/AccountVaultOdds'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
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

  // TODO: the following block can be greatly simplified with a `useUserVaultDelegationBalance` hook
  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)
  const { data: delegationBalances } = useAllUserVaultDelegationBalances(
    prizePoolsArray,
    userAddress as Address
  )
  const delegationBalance =
    delegationBalances?.[vault.chainId]?.[vault.address.toLowerCase() as Address] ?? 0n

  const { data: vaultFee } = useVaultFeeInfo(vault)

  return (
    <div
      className={classNames(
        'flex flex-col w-full max-w-screen-md gap-2 px-9 text-sm md:text-base',
        className
      )}
    >
      {!!userAddress && (
        <VaultInfoRow
          name={t_vault('headers.yourBalance')}
          data={<AccountVaultBalance vault={vault} className='!flex-row gap-1' />}
        />
      )}
      {!!userAddress && delegationBalance > 0n && (
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
      <VaultInfoRow
        name={t_vault('headers.depositAsset')}
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
        name={t_vault('headers.prizeAsset')}
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
