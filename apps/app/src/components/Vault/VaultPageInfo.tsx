import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeTokenData,
  useSelectedVaultLists,
  useUserVaultDelegationBalance,
  useUserVaultShareBalance,
  useVaultFeeInfo,
  useVaultOwner,
  useVaultPromotionsApr,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  BonusRewardsTooltip,
  NetworkIcon,
  PrizeYieldTooltip,
  VaultContributionsTooltip,
  VaultFeeTooltip,
  WinChanceTooltip
} from '@shared/react-components'
import { VaultInfo } from '@shared/types'
import { ExternalLink, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, getVaultId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { AccountVaultDelegationAmount } from '@components/Account/AccountVaultDelegationAmount'
import { AccountVaultOdds } from '@components/Account/AccountVaultOdds'
import { CopyButton } from '@components/CopyButton'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { VaultBonusRewards } from './VaultBonusRewards'
import { VaultContributions } from './VaultContributions'
import { VaultFeePercentage } from './VaultFeePercentage'
import { VaultPrizeYield } from './VaultPrizeYield'
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

  const { data: vaultOwner, isFetched: isFetchedVaultOwner } = useVaultOwner(vault)

  const { data: vaultFee } = useVaultFeeInfo(vault)

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const prizePools = useSupportedPrizePools()
  const prizePool =
    !!vault && Object.values(prizePools).find((prizePool) => prizePool.chainId === vault.chainId)

  const { data: prizeToken } = usePrizeTokenData(prizePool as PrizePool)

  const tokenAddresses = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].tokenAddresses : []
  const fromBlock = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].fromBlock : undefined
  const { data: vaultPromotionsApr } = useVaultPromotionsApr(
    vault,
    prizePool as PrizePool,
    tokenAddresses,
    { fromBlock }
  )

  const vaultListEntries = useMemo(() => {
    const entries: VaultInfo[] = []

    Object.values({ ...localVaultLists, ...importedVaultLists }).forEach((list) => {
      for (const entry of list.tokens) {
        if (vault.id === getVaultId(entry)) {
          entries.push(entry)
        }
      }
    })

    return entries
  }, [vault, localVaultLists, importedVaultLists])

  const lpInfo = useMemo(() => {
    let info: { appURI?: string } = {}

    vaultListEntries.forEach((entry) => {
      const appURI = entry.extensions?.lp?.appURI
      if (!!appURI) info.appURI = appURI
    })

    return info
  }, [vaultListEntries])

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
            {t_vault('headers.prizeYield')}
            <PrizeYieldTooltip
              iconSize='sm'
              intl={{ text: t_tooltips('prizeYield'), learnMore: t_common('learnMore') }}
              className='text-sm md:text-base'
              iconClassName='text-pt-purple-200'
            />
          </span>
        }
        data={
          <VaultPrizeYield
            vault={vault}
            label={t_common('apr')}
            labelClassName='text-sm text-pt-purple-200'
          />
        }
      />
      {!!vaultPromotionsApr && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              {t_vault('headers.bonusRewards')}
              <BonusRewardsTooltip
                iconSize='sm'
                intl={t_tooltips('bonusRewards')}
                className='text-sm md:text-base'
                iconClassName='text-pt-purple-200'
              />
            </span>
          }
          data={
            <VaultBonusRewards
              vault={vault}
              label={t_common('apr')}
              labelClassName='text-sm text-pt-purple-200'
            />
          }
        />
      )}
      <VaultInfoRow
        name={t_vault('headers.tvl')}
        data={<VaultTotalDeposits vault={vault} className='!flex-row gap-1' />}
      />
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
      <VaultInfoRow
        name={t_vault('headers.vaultOwner')}
        data={
          isFetchedVaultOwner ? (
            !!vaultOwner ? (
              <VaultInfoAddress chainId={vault.chainId} address={vaultOwner} />
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
      {!!lpInfo.appURI && (
        <VaultInfoRow
          name={t_vault('headers.lpSource')}
          data={<VaultInfoURI URI={lpInfo.appURI} />}
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
      {vaultListEntries.length === 0 && <NotInVaultListsWarning />}
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
    <span className='flex gap-1 items-center whitespace-nowrap'>
      <span>{token.symbol ?? '?'}</span>
      <span>|</span>
      <CopyButton
        data={token.address}
        buttonClassName='text-pt-purple-200 hover:text-pt-purple-300'
      >
        {shorten(token.address, { short: true })}
      </CopyButton>
      <span>|</span>
      <Link href={getBlockExplorerUrl(token.chainId, token.address, 'token')} target='_blank'>
        <NetworkIcon chainId={token.chainId} className='w-3 h-3 md:w-4 md:h-4' />
      </Link>
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
    <span className='flex gap-1 items-center whitespace-nowrap'>
      <CopyButton data={address} buttonClassName='text-pt-purple-200 hover:text-pt-purple-300'>
        {shorten(address)}
      </CopyButton>
      <span>|</span>
      <Link href={getBlockExplorerUrl(chainId, address)} target='_blank'>
        <NetworkIcon chainId={chainId} className='w-3 h-3 md:w-4 md:h-4' />
      </Link>
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
    } else if (URI.startsWith('ipfs://') || URI.startsWith('ipns://')) {
      return `${URI.slice(0, 15)}...`
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
