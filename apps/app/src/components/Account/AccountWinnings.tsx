import { SubgraphPrizePoolAccount } from '@pooltogether/hyperstructure-client-js'
import { useAllUserPrizePoolWins } from '@pooltogether/hyperstructure-react-hooks'
import { ExternalLink, LINKS } from '@shared/ui'
import classNames from 'classnames'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { AccountWinCards } from './AccountWinCards'
import { AccountWinningsHeader } from './AccountWinningsHeader'
import { AccountWinningsTable } from './AccountWinningsTable'

interface AccountWinningsProps {
  className?: string
}

export const AccountWinnings = (props: AccountWinningsProps) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: wins, isFetched: isFetchedWins } = useAllUserPrizePoolWins(
    prizePoolsArray,
    userAddress as `0x${string}`
  )

  const flattenedWins = useMemo(() => {
    const flattenedWins: (SubgraphPrizePoolAccount['prizesReceived'][0] & { chainId: number })[] =
      []
    for (const key in wins) {
      const chainId = parseInt(key)
      wins[chainId].forEach((win) => {
        flattenedWins.push({ ...win, chainId })
      })
    }
    return flattenedWins
  }, [wins])

  const isEmpty = !flattenedWins?.length

  if (typeof window !== 'undefined' && !!userAddress && isFetchedWins && !!wins) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex flex-col items-center lg:max-w-none',
          className
        )}
      >
        <AccountWinningsHeader />
        {isEmpty && <NoWinsCard className='mt-4' />}
        {!isEmpty && (
          <AccountWinningsTable
            wins={flattenedWins}
            prizePools={prizePoolsArray}
            rounded={true}
            className='hidden mt-8 lg:block'
          />
        )}
        {!isEmpty && (
          <AccountWinCards
            wins={flattenedWins}
            prizePools={prizePoolsArray}
            className='mt-2 md:mt-4 lg:hidden'
          />
        )}
      </div>
    )
  }

  return <></>
}

interface NoWinsCardProps {
  className?: string
}

const NoWinsCard = (props: NoWinsCardProps) => {
  const { className } = props

  return (
    <div className={classNames('w-full rounded-lg lg:p-4 lg:bg-pt-bg-purple', className)}>
      <div className='flex flex-col w-full gap-2 items-center justify-center p-3 bg-pt-transparent rounded-lg lg:flex-row lg:gap-3 lg:font-medium'>
        <span className='text-sm text-pt-purple-100 lg:text-lg'>
          You haven't won any prizes recently.
        </span>
        <ExternalLink
          href={LINKS.docs}
          text='Learn how PoolTogether works'
          size='sm'
          className='text-pt-teal lg:text-lg'
          iconClassName='lg:h-6 lg:w-6'
        />
      </div>
    </div>
  )
}
