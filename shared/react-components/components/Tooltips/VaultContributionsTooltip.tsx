import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Intl } from '@shared/types'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface VaultContributionsTooltipProps {
  tokenSymbol: string
  numberOfDays?: number
  iconSize?: 'sm' | 'md' | 'lg'
  intl?: Intl<'vaultContribution' | 'vaultContributionWithDays'>
  className?: string
  iconClassName?: string
}

export const VaultContributionsTooltip = (props: VaultContributionsTooltipProps) => {
  const { tokenSymbol, numberOfDays, iconSize, intl, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('max-w-[16ch] text-center', className)}>
          {!!numberOfDays
            ? intl?.('vaultContributionWithDays', { symbol: tokenSymbol, days: numberOfDays }) ??
              `The amount of ${tokenSymbol} contributed to the prize pool over the last ${numberOfDays} days, enabling wins in this vault`
            : intl?.('vaultContribution', { symbol: tokenSymbol }) ??
              `The amount of ${tokenSymbol} contributed to the prize pool, enabling wins in this vault`}
        </div>
      }
    >
      <InformationCircleIcon
        className={classNames(
          {
            'h-6 w-6': iconSize === 'lg',
            'h-5 w-5': iconSize === 'md' || !iconSize,
            'h-3 w-3': iconSize === 'sm'
          },
          iconClassName
        )}
      />
    </Tooltip>
  )
}
