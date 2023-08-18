import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import {
  useAllUserPrizePoolWins,
  useLastCheckedDrawIds
} from '@pooltogether/hyperstructure-react-hooks'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

interface MainViewProps {
  prizePools: PrizePool[]
}

export const MainView = (props: MainViewProps) => {
  const { prizePools } = props

  const { address: userAddress } = useAccount()

  const { data: wins } = useAllUserPrizePoolWins(prizePools, userAddress as Address)

  const { lastCheckedDrawIds } = useLastCheckedDrawIds()

  return (
    <div className='flex flex-col mb-6'>
      {/* TODO: display checking animation, then win or no win screen */}
    </div>
  )
}
