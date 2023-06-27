import { useLargestGrandPrize } from '@pooltogether/hyperstructure-react-hooks'
import { NextDrawCountdown, TokenValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

export const LargestPrizeHeader = () => {
  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: gpData } = useLargestGrandPrize(prizePoolsArray)

  return (
    <>
      <div className='flex flex-col items-center gap-3'>
        <span className='w-2/3 text-2xl text-center font-averta font-semibold md:w-full md:text-4xl lg:text-5xl'>
          Deposit for a chance to win up to{' '}
          {!!gpData ? (
            <TokenValue token={gpData.token} hideZeroes={true} countUp={true} />
          ) : (
            <Spinner />
          )}
        </span>
        <span className='hidden text-pt-purple-100 md:block'>
          Deposit into prize pools for a daily chance to win.
        </span>
      </div>
      <NextDrawCountdown prizePool={prizePoolsArray[0]} />
    </>
  )
}
