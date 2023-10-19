import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserPrizePoolWins,
  useDrawsToCheckForPrizes,
  useLastCheckedPrizesTimestamps
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen, useScreenSize } from '@shared/generic-react-hooks'
import { Intl } from '@shared/types'
import { Modal } from '@shared/ui'
import { getSecondsSinceEpoch, sToMs } from '@shared/utilities'
import { ReactNode, useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { CheckingView } from './Views/CheckingView'
import { NoWinView } from './Views/NoWinView'
import { WinView } from './Views/WinView'

export type CheckPrizesModalView = 'checking' | 'win' | 'noWin'

export interface CheckPrizesModalProps {
  prizePools: PrizePool[]
  onGoToAccount: () => void
  intl?: Intl<'checking' | 'noPrizes' | 'viewAccount' | 'youWonX' | 'xWon'>
}

export const CheckPrizesModal = (props: CheckPrizesModalProps) => {
  const { prizePools, onGoToAccount, intl } = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.checkPrizes)

  const [view, setView] = useState<CheckPrizesModalView>('checking')

  const { isMobile } = useScreenSize()

  const { address: userAddress } = useAccount()

  const { data: drawsToCheck } = useDrawsToCheckForPrizes(prizePools, userAddress as Address)

  const { data: wins } = useAllUserPrizePoolWins(prizePools, userAddress as Address)

  const { lastCheckedPrizesTimestamps, set } = useLastCheckedPrizesTimestamps(
    userAddress as Address
  )

  const updateLastCheckedPrizesTimestamps = () => {
    if (!!drawsToCheck && !!userAddress) {
      for (const key in drawsToCheck.draws) {
        const chainId = parseInt(key)
        set(chainId, getSecondsSinceEpoch())
      }
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (view !== 'checking') {
      updateLastCheckedPrizesTimestamps()
      setView('checking')
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        for (const key in wins) {
          const chainId = parseInt(key)
          const drawIdsToCheck = drawsToCheck?.draws[chainId]?.map((d) => d.id) ?? []
          const lastCheckedPrizesTimestamp = lastCheckedPrizesTimestamps[chainId] ?? 0

          if (
            wins[chainId].some(
              (win) =>
                drawIdsToCheck.includes(win.drawId) && win.timestamp > lastCheckedPrizesTimestamp
            )
          ) {
            setView('win')
            return
          }
        }
        setView('noWin')
      }, sToMs(3.5))
    }
  }, [isModalOpen, wins])

  if (isModalOpen) {
    const modalViews: Record<CheckPrizesModalView, ReactNode> = {
      checking: <CheckingView intl={intl} />,
      win: !!drawsToCheck && (
        <WinView
          prizePools={prizePools}
          draws={drawsToCheck.draws}
          wins={wins}
          onGoToAccount={() => {
            onGoToAccount()
            handleClose()
          }}
          intl={intl}
        />
      ),
      noWin: (
        <NoWinView
          onGoToAccount={() => {
            onGoToAccount()
            handleClose()
          }}
          intl={intl}
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
