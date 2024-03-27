import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLastCheckedPrizesTimestamps,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useSelectedCurrency } from '@shared/generic-react-hooks'
import { DrawWithTimestamps, SubgraphPrize, TokenWithAmount, Win } from '@shared/types'
import { Intl } from '@shared/types'
import { Button } from '@shared/ui'
import { getSimpleDate, NETWORK, WRAPPED_NATIVE_ASSETS } from '@shared/utilities'
import classNames from 'classnames'
import Lottie from 'lottie-react'
import { useMemo, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { TokenAmount } from '../../../Currency/TokenAmount'
import { TokenValue } from '../../../Currency/TokenValue'
import { NetworkIcon } from '../../../Icons/NetworkIcon'
import { winAnimation } from '../animations'

interface WinViewProps {
  prizePools: PrizePool[]
  draws: { [chainId: number]: DrawWithTimestamps[] }
  wins: { [chainId: number]: SubgraphPrize[] }
  onGoToAccount: () => void
  intl?: Intl<'viewAccount' | 'youWonX' | 'xWon'>
}

export const WinView = (props: WinViewProps) => {
  const { prizePools, draws, wins, onGoToAccount, intl } = props

  const { address: userAddress } = useAccount()

  // TODO: this assumes all prize pools use the same prize token - not ideal
  const { data: prizeToken } = usePrizeTokenData(prizePools[0])

  const { lastCheckedPrizesTimestamps } = useLastCheckedPrizesTimestamps(userAddress as Address)

  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false)

  const prizes = useMemo(() => {
    const toDisplay: Win[] = []
    let totalAmount = 0n

    if (!!userAddress) {
      for (const key in wins) {
        const chainId = parseInt(key)
        const drawIdsToCheck = draws[chainId]?.map((d) => d.id) ?? []
        const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

        const groupedChainWins: { [txHash: `0x${string}`]: Win } = {}

        wins[chainId].forEach((win) => {
          if (groupedChainWins[win.txHash] !== undefined) {
            groupedChainWins[win.txHash].payout += win.payout
            totalAmount += win.payout
          } else if (
            drawIdsToCheck.includes(win.drawId) &&
            win.timestamp > lastCheckedPrizesTimestamp
          ) {
            groupedChainWins[win.txHash] = {
              chainId,
              drawId: win.drawId,
              payout: win.payout,
              txHash: win.txHash,
              timestamp: win.timestamp
            }
            totalAmount += win.payout
          }
        })

        toDisplay.push(...Object.values(groupedChainWins))
      }
    }

    toDisplay.sort((a, b) => b.timestamp - a.timestamp)

    return { toDisplay, totalAmount }
  }, [draws, wins, userAddress])

  const transitionIn = classNames('transition-opacity duration-700 opacity-0', {
    'opacity-100': isAnimationComplete
  })

  if (!!prizeToken) {
    return (
      <div className='flex flex-col items-center px-8'>
        <Header token={{ ...prizeToken, amount: prizes.totalAmount }} className={transitionIn} />
        <div
          className={classNames(
            'w-full max-h-[28vh] flex flex-col gap-4 my-12 overflow-auto transition-opacity',
            transitionIn
          )}
        >
          {prizes.toDisplay.map((prize, i) => (
            <PrizeRow key={`prize-${i}-${prize.timestamp}`} win={prize} prizeToken={prizeToken} />
          ))}
        </div>
        <Lottie
          animationData={winAnimation}
          loop={false}
          className='w-full h-auto -my-20 pointer-events-none md:-my-40'
          onComplete={() => setIsAnimationComplete(true)}
        />
        <Button onClick={onGoToAccount} className={classNames('mx-auto', transitionIn)}>
          {intl?.('viewAccount') ?? `View Your Account`}
        </Button>
      </div>
    )
  }

  return <></>
}

interface HeaderProps {
  token: TokenWithAmount
  className?: string
  intl?: Intl<'youWonX'>
}

const Header = (props: HeaderProps) => {
  const { token, className, intl } = props

  const { selectedCurrency } = useSelectedCurrency()

  const isTokenEquivalentHidden = useMemo(() => {
    const wethTokenAddress =
      token.chainId === NETWORK.mainnet ||
      token.chainId === NETWORK.optimism ||
      token.chainId === NETWORK.arbitrum ||
      token.chainId === NETWORK.base
        ? (WRAPPED_NATIVE_ASSETS[token.chainId]?.toLowerCase() as Lowercase<Address>)
        : undefined

    return selectedCurrency === 'eth' && token.address.toLowerCase() === wethTokenAddress
  }, [token, selectedCurrency])

  return (
    <div className={classNames('flex flex-col items-center text-center', className)}>
      <span className='text-3xl font-grotesk font-medium text-gray-100'>
        {intl?.('youWonX') ?? `You won`} <TokenValue token={token} hideZeroes={true} />!
      </span>
      {!isTokenEquivalentHidden && (
        <span className='text-pt-purple-100'>
          (<TokenAmount token={token} hideZeroes={true} />)
        </span>
      )}
    </div>
  )
}

interface PrizeRowProps {
  win: Win
  prizeToken: { chainId: number; address: Address }
  className?: string
  intl?: Intl<'xWon'>
}

const PrizeRow = (props: PrizeRowProps) => {
  const { win, prizeToken, className, intl } = props

  return (
    <div
      className={classNames(
        'w-full flex items-center justify-between px-3 py-2 bg-pt-transparent rounded-lg',
        className
      )}
    >
      <div className='flex gap-2 items-center'>
        <NetworkIcon chainId={win.chainId} className='w-4 h-4' />
        <span className='text-sm text-pt-purple-300'>{getSimpleDate(win.timestamp)}</span>
      </div>
      <span className='font-medium'>
        <TokenValue token={{ ...prizeToken, amount: win.payout }} /> {intl?.('xWon') ?? `Won!`}
      </span>
    </div>
  )
}
