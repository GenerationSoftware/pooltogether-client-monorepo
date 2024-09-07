import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultPromotionsApr } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay, TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'

interface VaultBonusRewardsProps {
  vault: Vault
  prepend?: ReactNode
  append?: ReactNode
  hideUnlessPresent?: boolean
  showTokens?: boolean
  className?: string
  valueClassName?: string
  tokensClassName?: string
}

export const VaultBonusRewards = (props: VaultBonusRewardsProps) => {
  const {
    vault,
    prepend,
    append,
    hideUnlessPresent,
    showTokens,
    className,
    valueClassName,
    tokensClassName
  } = props

  const tokenAddresses = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].tokenAddresses : []
  const fromBlock = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].fromBlock : undefined

  const { data: vaultPromotionsApr, isFetched: isFetchedVaultPromotionsApr } =
    useVaultPromotionsApr(vault, tokenAddresses, { fromBlock })

  if (
    (!!vault && TWAB_REWARDS_ADDRESSES[vault.chainId] === undefined) ||
    vaultPromotionsApr?.apr === 0
  ) {
    return hideUnlessPresent ? <></> : <>-</>
  }

  if (!isFetchedVaultPromotionsApr) {
    return hideUnlessPresent ? <></> : <Spinner />
  }

  if (!vaultPromotionsApr) {
    return hideUnlessPresent ? <></> : <>?</>
  }

  const formattedApr = `${formatNumberForDisplay(vaultPromotionsApr.apr, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })}%`

  return (
    <div className={classNames('flex items-center gap-1', className)}>
      <div className='inline-flex gap-1 items-center'>
        {prepend}
        <span className={valueClassName}>{formattedApr}</span>
        {append}
      </div>
      {showTokens && (
        <RewardTokens tokens={vaultPromotionsApr.tokens} className={tokensClassName} />
      )}
    </div>
  )
}

interface RewardTokensProps {
  tokens: Token[]
  className?: string
}

const RewardTokens = (props: RewardTokensProps) => {
  const { tokens, className } = props

  const t = useTranslations('Vault.rewardsInTokens')

  if (tokens.length === 0) return <></>

  const contentClassName = 'flex shrink-0 gap-x-1 whitespace-nowrap'
  const tokenWrapperClassName = 'flex items-center gap-x-1'
  const iconClassName = '!w-4 !h-4'

  const FirstToken = () => (
    <span className={tokenWrapperClassName}>
      <TokenIcon token={tokens[0]} className={iconClassName} />
      {tokens[0].symbol}
    </span>
  )

  if (tokens.length === 1) {
    return (
      <div className={classNames(contentClassName, className)}>
        {t.rich('oneToken', { token: FirstToken })}
      </div>
    )
  }

  const SecondToken = () => (
    <span className={tokenWrapperClassName}>
      <TokenIcon token={tokens[1]} className={iconClassName} />
      {tokens[1].symbol}
    </span>
  )

  if (tokens.length === 2) {
    return (
      <div className={classNames(contentClassName, className)}>
        {t.rich('twoTokens', { firstToken: FirstToken, secondToken: SecondToken })}
      </div>
    )
  }

  return (
    <div className={classNames(contentClassName, className)}>
      {t.rich('manyTokens', { token: FirstToken, number: tokens.length - 1 })}
    </div>
  )
}
