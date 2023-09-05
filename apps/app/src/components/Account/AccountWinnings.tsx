import {
  useAllUserPrizePoolWins,
  useLastCheckedPrizesTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { SubgraphPrize } from '@shared/types'
import { ExternalLink, LINKS } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { AccountWinCards } from './AccountWinCards'
import { AccountWinningsHeader } from './AccountWinningsHeader'
import { AccountWinningsTable } from './AccountWinningsTable'

interface AccountWinningsProps {
  address?: Address
  className?: string
}

export const AccountWinnings = (props: AccountWinningsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: wins, isFetched: isFetchedWins } = useAllUserPrizePoolWins(
    prizePoolsArray,
    userAddress as Address
  )

  const { lastCheckedPrizesTimestamps } = useLastCheckedPrizesTimestamps()

  const isExternalUser = !!address && address.toLowerCase() !== _userAddress?.toLowerCase()

  const flattenedWins = useMemo(() => {
    const flattenedWins: (SubgraphPrize & { chainId: number })[] = []

    for (const key in wins) {
      const chainId = parseInt(key)
      const lastCheckedPrizesTimestamp = !!userAddress
        ? lastCheckedPrizesTimestamps[userAddress.toLowerCase()]?.[chainId] ?? 0
        : 0

      wins[chainId].forEach((win) => {
        if (win.timestamp <= lastCheckedPrizesTimestamp || isExternalUser) {
          flattenedWins.push({ ...win, chainId })
        }
      })
    }

    return flattenedWins.sort((a, b) => b.timestamp - a.timestamp)
  }, [wins, lastCheckedPrizesTimestamps, userAddress, isExternalUser])

  const isEmpty = isFetchedWins && !flattenedWins?.length

  if (typeof window !== 'undefined' && !!userAddress && isFetchedWins && !!wins) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex flex-col items-center lg:max-w-none',
          className
        )}
      >
        {(!isEmpty || !isExternalUser) && <AccountWinningsHeader address={userAddress} />}
        {isEmpty && !isExternalUser && <NoWinsCard className='mt-4' />}
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

  const t = useTranslations('Account')

  return (
    <div className={classNames('w-full rounded-lg lg:p-4 lg:bg-pt-bg-purple', className)}>
      <div className='flex flex-col w-full gap-2 items-center justify-center p-3 bg-pt-transparent rounded-lg lg:flex-row lg:gap-3 lg:font-medium'>
        <span className='text-sm text-pt-purple-100 lg:text-lg'>{t('noPrizesRecently')}</span>
        <ExternalLink
          href={LINKS.docs}
          size='sm'
          className='text-pt-teal lg:text-lg'
          iconClassName='lg:h-6 lg:w-6'
        >
          {t('learnHowItWorks')}
        </ExternalLink>
      </div>
    </div>
  )
}
