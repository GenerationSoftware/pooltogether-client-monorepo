import { formatNumberForDisplay } from '@pooltogether/hyperstructure-client-js'
import { useAllUserPrizeOdds, useSelectedVaults } from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface AccountDepositsOddsProps {
  className?: string
}

export const AccountDepositsOdds = (props: AccountDepositsOddsProps) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const { vaults } = useSelectedVaults()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: prizeOdds, isFetched: isFetchedPrizeOdds } = useAllUserPrizeOdds(
    prizePoolsArray,
    vaults,
    userAddress as `0x${string}`
  )

  return (
    <div
      className={classNames(
        'flex w-full items-center justify-between px-4 py-1 text-pt-purple-100 rounded-lg',
        'md:py-6 md:bg-pt-bg-purple',
        className
      )}
    >
      <span className='text-xs md:text-base'>Daily Prize Odds</span>
      <span>
        {isFetchedPrizeOdds && !!prizeOdds ? (
          `1 in ${formatNumberForDisplay(prizeOdds.oneInX, { maximumSignificantDigits: 3 })}`
        ) : (
          <Spinner />
        )}
      </span>
    </div>
  )
}
