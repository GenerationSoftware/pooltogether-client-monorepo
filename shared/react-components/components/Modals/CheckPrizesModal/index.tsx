import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import {
  useAllUserPrizePoolWins,
  useDrawsToCheckForPrizes,
  useLastCheckedDrawIds
} from '@pooltogether/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen, useScreenSize } from '@shared/generic-react-hooks'
import { Modal } from '@shared/ui'
import { sToMs } from '@shared/utilities'
import { ReactNode, useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { CheckingView } from './Views/CheckingView'
import { NoWinView } from './Views/NoWinView'
import { WinView } from './Views/WinView'

export type CheckPrizesModalView = 'checking' | 'win' | 'noWin'

export interface CheckPrizesModalProps {
  prizePools: PrizePool[]
}

// TODO: localization
export const CheckPrizesModal = (props: CheckPrizesModalProps) => {
  const { prizePools } = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.checkPrizes)

  const [view, setView] = useState<CheckPrizesModalView>('checking')

  const { isMobile } = useScreenSize()

  const { address: userAddress } = useAccount()

  const { data: drawsToCheck } = useDrawsToCheckForPrizes(prizePools, userAddress as Address)

  const { data: wins } = useAllUserPrizePoolWins(prizePools, userAddress as Address)

  const { set } = useLastCheckedDrawIds()

  const updateLastCheckedDrawIds = () => {
    if (!!drawsToCheck && !!userAddress) {
      for (const key in drawsToCheck.draws) {
        const chainId = parseInt(key)
        const draws = drawsToCheck.draws[chainId]
        if (draws.length > 0) {
          const lastDrawId = draws[draws.length - 1].id
          set(userAddress, chainId, lastDrawId)
        }
      }
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (view !== 'checking') {
      updateLastCheckedDrawIds()
      setView('checking')
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        for (const key in wins) {
          const chainId = parseInt(key)
          const winningDrawIds = wins[chainId].map((w) => parseInt(w.draw.id))
          const drawIdsToCheck = drawsToCheck?.draws[chainId]?.map((d) => d.id) ?? []
          if (winningDrawIds.some((id) => drawIdsToCheck.indexOf(id) >= 0)) {
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
      checking: <CheckingView />,
      win: !!drawsToCheck && (
        <WinView
          prizePools={prizePools}
          draws={drawsToCheck.draws}
          wins={wins}
          onClose={handleClose}
        />
      ),
      noWin: <NoWinView onClose={handleClose} />
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
