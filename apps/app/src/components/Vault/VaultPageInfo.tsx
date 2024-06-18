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
import { getCleanURI } from 'src/utils'
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
  show: (
    | 'userBalance'
    | 'userDelegationBalance'
    | 'userWinChance'
    | 'prizeYield'
    | 'bonusRewards'
    | 'tvl'
    | 'vaultContributions'
    | 'depositToken'
    | 'prizeToken'
    | 'vaultOwner'
    | 'yieldSourceURI'
    | 'lpSourceURI'
    | 'vaultFee'
    | 'vaultFeeRecipient'
  )[]
  className?: string
}

export const VaultPageInfo = (props: VaultPageInfoProps) => {
  const { vault, show, className } = props

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
    <div className={classNames('flex flex-col w-full gap-2 text-base md:text-lg', className)}>
      {!!userAddress && show.includes('userBalance') && (
        <VaultInfoRow
          name={t_vault('headers.yourBalance')}
          data={
            <AccountVaultBalance
              vault={vault}
              className='!flex-row gap-1'
              valueClassName='!text-base md:!text-lg'
            />
          }
        />
      )}
      {!!userAddress &&
        !!shareBalance &&
        !!delegationBalance &&
        delegationBalance - shareBalance.amount > 0n &&
        show.includes('userDelegationBalance') && (
          <VaultInfoRow
            name={t_vault('headers.delegatedToYou')}
            data={
              <AccountVaultDelegationAmount
                vault={vault}
                className='!flex-row gap-1'
                valueClassName='!text-base md:!text-lg'
              />
            }
          />
        )}
      {!!userAddress && show.includes('userWinChance') && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              {t_vault('headers.yourWinChance')}
              <WinChanceTooltip
                intl={{ text: t_tooltips('winChance') }}
                className='text-sm md:text-base'
                iconClassName='text-pt-purple-200'
              />
            </span>
          }
          data={<AccountVaultOdds vault={vault} />}
        />
      )}
      {show.includes('prizeYield') && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              {t_vault('headers.prizeYield')}
              <PrizeYieldTooltip
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
      )}
      {!!vaultPromotionsApr && show.includes('bonusRewards') && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              {t_vault('headers.bonusRewards')}
              <BonusRewardsTooltip
                intl={t_tooltips('bonusRewards')}
                className='text-sm md:text-base'
                iconClassName='text-pt-purple-200'
              />
            </span>
          }
          data={
            // TODO: append tokens that rewards are in
            <VaultBonusRewards
              vault={vault}
              append={<span className='text-pt-purple-200'>{t_common('apr')}</span>}
            />
          }
        />
      )}
      {show.includes('tvl') && (
        <VaultInfoRow
          name={t_vault('headers.tvl')}
          data={
            <VaultTotalDeposits
              vault={vault}
              className='!flex-row gap-1'
              valueClassName='!text-base md:!text-lg'
            />
          }
        />
      )}
      {!!prizeToken && show.includes('vaultContributions') && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              {t_vault('headers.contributions', { number: 7 })}
              <VaultContributionsTooltip
                tokenSymbol={prizeToken.symbol}
                numberOfDays={7}
                intl={t_tooltips}
                className='text-sm md:text-base'
                iconClassName='text-pt-purple-200'
              />
            </span>
          }
          data={<VaultContributions vault={vault} />}
        />
      )}
      {show.includes('prizeToken') && (
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
      )}
      {show.includes('depositToken') && (
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
      )}
      {show.includes('vaultOwner') && (
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
      )}
      {!!vault.yieldSourceURI && show.includes('yieldSourceURI') && (
        <VaultInfoRow
          name={t_vault('headers.yieldSource')}
          data={<VaultInfoURI URI={vault.yieldSourceURI} />}
        />
      )}
      {!!lpInfo.appURI && show.includes('lpSourceURI') && (
        <VaultInfoRow
          name={t_vault('headers.lpSource')}
          data={<VaultInfoURI URI={lpInfo.appURI} />}
        />
      )}
      {!!vaultFee && vaultFee.percent > 0 && (
        <>
          {show.includes('vaultFee') && (
            <VaultInfoRow
              name={
                <span className='flex gap-2 items-center'>
                  {t_vault('headers.vaultFee')}
                  <VaultFeeTooltip
                    intl={{ text: t_tooltips('vaultFee') }}
                    className='text-sm md:text-base'
                    iconClassName='text-pt-purple-200'
                  />
                </span>
              }
              data={<VaultFeePercentage vault={vault} />}
            />
          )}
          {show.includes('vaultFeeRecipient') && (
            <VaultInfoRow
              name={t_vault('headers.feeRecipient')}
              data={<VaultInfoAddress chainId={vault.chainId} address={vaultFee.recipient} />}
            />
          )}
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
    <div className='inline-flex w-full items-center justify-between gap-2'>
      <span className='text-pt-purple-100'>{name}</span>
      <span className='h-3 grow border-b border-dashed border-pt-purple-50/30' />
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

  return (
    <ExternalLink href={URI} size='sm' className='text-pt-purple-200'>
      {getCleanURI(URI)}
    </ExternalLink>
  )
}
