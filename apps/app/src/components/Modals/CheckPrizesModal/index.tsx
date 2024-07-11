import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserPrizePoolWins,
  useDrawsToCheckForPrizes,
  useLastCheckedPrizesTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen, useScreenSize } from '@shared/generic-react-hooks'
import { Modal } from '@shared/ui'
import { getSecondsSinceEpoch, sToMs } from '@shared/utilities'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { CheckingView } from './Views/CheckingView'
import { NoWinView } from './Views/NoWinView'
import { WinView } from './Views/WinView'

export type CheckPrizesModalView = 'checking' | 'win' | 'noWin'

export interface CheckPrizesModalProps {
  prizePools: PrizePool[]
  onWin?: () => void
  onNoWin?: () => void
}

export const CheckPrizesModal = (props: CheckPrizesModalProps) => {
  const { prizePools, onWin, onNoWin } = props

  const router = useRouter()

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.checkPrizes)

  const [view, setView] = useState<CheckPrizesModalView>('checking')

  const { isMobile } = useScreenSize()

  const { address: userAddress } = useAccount()

  const { data: drawsToCheck } = useDrawsToCheckForPrizes(prizePools, userAddress as Address)

  const { data: wins } = useAllUserPrizePoolWins(prizePools, userAddress as Address)

  const { lastCheckedPrizesTimestamps, set } = useLastCheckedPrizesTimestamps(
    userAddress as Address
  )

  const timeoutRef = useRef<number | null>(null)

  const updateLastCheckedPrizesTimestamps = () => {
    if (!!drawsToCheck && !!userAddress) {
      for (const key in drawsToCheck.draws) {
        const chainId = parseInt(key)
        set(chainId, getSecondsSinceEpoch())
      }
    }
  }

  const handleClose = () => {
    if (isModalOpen && view !== 'checking') {
      updateLastCheckedPrizesTimestamps()
    }
    setIsModalOpen(false)
    setView('checking')
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => {
    if (!!userAddress && isModalOpen && timeoutRef.current === null) {
      timeoutRef.current = window.setTimeout(() => {
        for (const key in wins) {
          const chainId = parseInt(key)
          const drawIdsToCheck = drawsToCheck?.draws[chainId]?.map((d) => d.id) ?? []
          const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

          if (
            wins[chainId].some(
              (win) =>
                !!win.payout &&
                drawIdsToCheck.includes(win.drawId) &&
                win.timestamp > lastCheckedPrizesTimestamp
            )
          ) {
            setView('win')
            onWin?.()
            return
          }
          setView('noWin')
          onNoWin?.()
        }
      }, sToMs(3.5))
    }
  }, [userAddress, wins, isModalOpen])

  useEffect(() => {
    if (!!userAddress) {
      handleClose()
    }
  }, [userAddress])

  if (isModalOpen) {
    const modalViews: Record<CheckPrizesModalView, ReactNode> = {
      checking: <CheckingView />,
      win: !!drawsToCheck && (
        <WinView
          prizePools={prizePools}
          draws={drawsToCheck.draws}
          wins={wins}
          onGoToAccount={() => {
            router.push('/account')
            handleClose()
          }}
        />
      ),
      noWin: (
        <NoWinView
          onGoToAccount={() => {
            router.push('/account')
            handleClose()
          }}
        />
      )
    }

    return (
      <Modal
        bodyContent={modalViews[view]}
        onClose={handleClose}
        label='prize-checking'
        mobileStyle='tab'
        hideHeader={isMobile}
        className='overflow-y-hidden md:!max-w-2xl'
      />
    )
  }

  return <></>
}
