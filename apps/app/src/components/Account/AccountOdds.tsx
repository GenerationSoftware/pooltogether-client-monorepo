import { formatNumberForDisplay } from '@pooltogether/hyperstructure-client-js'
import { useAllUserPrizeOdds, useSelectedVaults } from '@pooltogether/hyperstructure-react-hooks'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface AccountOddsProps {
  address?: Address
  className?: string
}

export const AccountOdds = (props: AccountOddsProps) => {
  const { address, className } = props

  const t = useTranslations('Account')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: prizeOdds, isFetched: isFetchedPrizeOdds } = useAllUserPrizeOdds(
    prizePoolsArray,
    vaults,
    userAddress as Address
  )

  if (isFetchedPrizeOdds && !!prizeOdds?.percent) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex items-center justify-between px-4 py-1 text-pt-purple-100 rounded-lg',
          'lg:max-w-none lg:py-6 lg:bg-pt-bg-purple',
          className
        )}
      >
        <span className='text-xs lg:text-base'>{t('dailyPrizeOdds')}</span>
        <span>
          {t('oneInXChance', {
            number: formatNumberForDisplay(prizeOdds.oneInX, { maximumSignificantDigits: 3 })
          })}
        </span>
      </div>
    )
  }

  return <></>
}
