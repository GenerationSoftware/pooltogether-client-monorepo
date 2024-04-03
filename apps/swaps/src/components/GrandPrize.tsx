import {
  useGrandPrize,
  usePrizePool,
  usePrizeTokenPrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { CurrencyValue } from '@shared/react-components'
import { ExternalLink, Spinner } from '@shared/ui'
import { LINKS, PRIZE_POOLS } from '@shared/utilities'
import classNames from 'classnames'
import { formatUnits } from 'viem'

interface GrandPrizeProps {
  chainId: number
  className?: string
}

export const GrandPrize = (props: GrandPrizeProps) => {
  const { chainId, className } = props

  const prizePoolInfo = PRIZE_POOLS.find(
    (pool) => pool.chainId === chainId
  ) as (typeof PRIZE_POOLS)[number]
  const prizePool = usePrizePool(chainId, prizePoolInfo.address, prizePoolInfo.options)
  const { data: grandPrize } = useGrandPrize(prizePool, { useCurrentPrizeSizes: true })
  const { data: prizeToken } = usePrizeTokenPrice(prizePool)

  const gpValue =
    !!grandPrize && !!prizeToken?.price
      ? parseFloat(formatUnits(grandPrize.amount, grandPrize.decimals)) * prizeToken.price
      : undefined

  return (
    <div
      className={classNames(
        'w-full flex flex-col items-center text-center text-pt-pink',
        className
      )}
    >
      <span className='text-2xl'>Grand Prize</span>
      <span className='font-grotesk font-medium text-5xl'>
        {!!gpValue ? <CurrencyValue baseValue={gpValue} hideZeroes={true} /> : <Spinner />}
      </span>
      <ExternalLink
        href={`${LINKS.app}/prizes?network=${chainId}`}
        className='mt-2 text-pt-purple-100'
      >
        See All Prizes
      </ExternalLink>
    </div>
  )
}
