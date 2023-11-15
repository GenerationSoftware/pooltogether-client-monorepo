import { CurrencyValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useUserTotalPromotionRewards } from '@hooks/useUserTotalPromotionRewards'

interface AccountPromotionsHeaderProps {
  address?: Address
  className?: string
}

// TODO: add "Claim All" button
export const AccountPromotionsHeader = (props: AccountPromotionsHeaderProps) => {
  const { address, className } = props

  const t = useTranslations('Common')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: totalRewards } = useUserTotalPromotionRewards(userAddress as Address, {
    includeUnclaimed: true
  })

  return (
    <div className={classNames('flex flex-col items-center gap-1 md:gap-2', className)}>
      <span className='text-sm text-pt-purple-100 md:text-base'>{t('bonusRewards')}</span>
      <span className='text-[1.75rem] font-grotesk font-medium md:text-4xl'>
        {!!userAddress && totalRewards !== undefined ? (
          <CurrencyValue baseValue={totalRewards} countUp={true} fallback={<Spinner />} />
        ) : (
          <Spinner />
        )}
      </span>
    </div>
  )
}
