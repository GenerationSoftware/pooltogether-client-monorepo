import { CurrencyValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAccount } from 'wagmi'
import { useUserTotalWinnings } from '@hooks/useUserTotalWinnings'

interface AccountWinningsHeaderProps {
  className?: string
}

export const AccountWinningsHeader = (props: AccountWinningsHeaderProps) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const { data: totalWinnings, isFetched: isFetchedTotalWinnings } = useUserTotalWinnings()

  return (
    <div className={classNames('flex flex-col items-center gap-1 md:gap-2', className)}>
      <span className='text-sm text-pt-purple-100 md:text-base'>Your Winnings</span>
      <span className='text-2xl font-averta font-semibold md:text-3xl'>
        {!isFetchedTotalWinnings && !!userAddress && <Spinner />}
        {isFetchedTotalWinnings && <CurrencyValue baseValue={totalWinnings} countUp={true} />}
      </span>
    </div>
  )
}
