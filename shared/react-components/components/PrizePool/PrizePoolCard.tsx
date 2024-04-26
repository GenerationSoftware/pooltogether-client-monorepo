import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useGrandPrize } from '@generationsoftware/hyperstructure-react-hooks'
import { useSelectedCurrency } from '@shared/generic-react-hooks'
import { Intl } from '@shared/types'
import { Card, Spinner } from '@shared/ui'
import { NETWORK, WRAPPED_NATIVE_ASSETS } from '@shared/utilities'
import { useMemo } from 'react'
import { PrizePoolBadge } from '../Badges/PrizePoolBadge'
import { TokenAmount } from '../Currency/TokenAmount'
import { TokenValue } from '../Currency/TokenValue'

export interface PrizePoolCardProps {
  prizePool: PrizePool
  intl?: Intl<'prizePool' | 'grandPrize'>
}

export const PrizePoolCard = (props: PrizePoolCardProps) => {
  const { prizePool, intl } = props

  const { data: grandPrize, isFetched: isFetchedGrandPrize } = useGrandPrize(prizePool, {
    useCurrentPrizeSizes: true
  })

  const { selectedCurrency } = useSelectedCurrency()

  const isTokenEquivalentHidden = useMemo(() => {
    const wethTokenAddress =
      prizePool.chainId === NETWORK.mainnet ||
      prizePool.chainId === NETWORK.optimism ||
      prizePool.chainId === NETWORK.arbitrum ||
      prizePool.chainId === NETWORK.base
        ? WRAPPED_NATIVE_ASSETS[prizePool.chainId]
        : undefined

    return selectedCurrency === 'eth' && grandPrize?.address.toLowerCase() === wethTokenAddress
  }, [prizePool, selectedCurrency])

  return (
    <Card
      wrapperClassName='hover:bg-pt-purple-50/20'
      className='gap-3 items-center md:gap-16 md:items-start'
    >
      <PrizePoolBadge
        chainId={prizePool.chainId}
        hideBg={true}
        intl={intl}
        className='gap-2 !p-0 md:w-full'
        iconClassName='h-8 w-8'
        textClassName='text-2xl font-grotesk font-medium whitespace-nowrap overflow-hidden overflow-ellipsis md:text-3xl'
      />
      <div className='flex flex-col gap-0.5 text-center text-pt-purple-100 md:text-start'>
        <span className='text-xs uppercase md:text-sm'>
          {intl?.('grandPrize') ?? 'Grand Prize'}
        </span>
        {isFetchedGrandPrize ? (
          !!grandPrize ? (
            <>
              <span className='text-2xl text-pt-teal md:text-4xl'>
                <TokenValue token={grandPrize} hideZeroes={true} fallback={<></>} />
              </span>
              {!isTokenEquivalentHidden && (
                <span className='hidden font-light md:block'>
                  ≈ <TokenAmount token={grandPrize} maximumFractionDigits={2} />
                </span>
              )}
            </>
          ) : (
            '?'
          )
        ) : (
          <Spinner />
        )}
      </div>
    </Card>
  )
}
