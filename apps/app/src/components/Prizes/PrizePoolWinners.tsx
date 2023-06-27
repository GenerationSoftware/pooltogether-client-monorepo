import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { PrizePool, SubgraphPrizePoolDraw } from '@pooltogether/hyperstructure-client-js'
import { usePrizeDrawWinners, usePrizeTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { TokenValue } from '@shared/react-components'
import { atom, useSetAtom } from 'jotai'
import { useState } from 'react'
import { useSelectedPrizePool } from '@hooks/useSelectedPrizePool'

export const drawIdAtom = atom<string>('')

export const PrizePoolWinners = () => {
  const { selectedPrizePool } = useSelectedPrizePool()

  const { data: draws } = usePrizeDrawWinners(selectedPrizePool as PrizePool)

  const baseNumDraws = 6
  const [numDraws, setNumDraws] = useState<number>(baseNumDraws)

  if (!!selectedPrizePool && !!draws && draws.length > 0) {
    return (
      <div className='flex flex-col w-full max-w-[36rem] gap-4 items-center px-6 py-8 bg-pt-transparent rounded-lg md:px-11'>
        <span className='font-semibold md:text-xl'>Recent Prize Pool Winners</span>
        <ul className='flex flex-col w-full max-w-[36rem] pl-2 md:pl-1'>
          {draws
            .slice(0, numDraws)
            .filter((draw) => draw.prizeClaims.length > 0)
            .map((draw) => {
              return <DrawRow key={`dr-${draw.id}`} draw={draw} prizePool={selectedPrizePool} />
            })}
        </ul>
        {draws.length > numDraws && (
          <span
            className='text-pt-purple-200 cursor-pointer md:font-semibold'
            onClick={() => setNumDraws(numDraws + baseNumDraws)}
          >
            Show More
          </span>
        )}
      </div>
    )
  }

  return <></>
}

interface DrawRowProps {
  draw: SubgraphPrizePoolDraw
  prizePool: PrizePool
}

const DrawRow = (props: DrawRowProps) => {
  const { draw, prizePool } = props

  const { data: tokenData } = usePrizeTokenData(prizePool)

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.drawWinners)

  const setSelectedDrawId = useSetAtom(drawIdAtom)

  const uniqueWallets = new Set<string>(draw.prizeClaims.map((claim) => claim.winner.id))
  const totalPrizeAmount = draw.prizeClaims.reduce((a, b) => a + BigInt(b.payout), 0n)

  const handleClick = () => {
    setSelectedDrawId(draw.id)
    setIsModalOpen(true)
  }

  return (
    <div
      onClick={handleClick}
      className='inline-flex gap-4 justify-between px-3 py-2 font-semibold text-pt-purple-100 rounded-lg cursor-pointer whitespace-nowrap hover:bg-pt-transparent'
    >
      <span>Draw #{draw.id}</span>
      {!!tokenData && (
        <span className='inline-flex gap-2'>
          <span className='hidden md:block'>
            {uniqueWallets.size} wallet{uniqueWallets.size === 1 ? '' : 's'} won{' '}
          </span>
          <span className='text-pt-purple-50'>
            <TokenValue token={{ ...tokenData, amount: totalPrizeAmount }} />
          </span>{' '}
          in prizes <ChevronRightIcon className='h-6 w-6' />
        </span>
      )}
      {!tokenData && <>-</>}
    </div>
  )
}
