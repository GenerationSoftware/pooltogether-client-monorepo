import { PrizePool, SubgraphPrizePoolDraw } from '@pooltogether/hyperstructure-client-js'
import { MODAL_KEYS, useIsModalOpen, useScreenSize } from '@shared/generic-react-hooks'
import { Button, Modal } from '@shared/ui'
import { MainView } from './Views/MainView'

export interface DrawModalProps {
  draw?: SubgraphPrizePoolDraw
  prizePool?: PrizePool
}

export const DrawModal = (props: DrawModalProps) => {
  const { draw, prizePool } = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.drawWinners)

  const { isMobile } = useScreenSize()

  const handleClose = () => {
    setIsModalOpen(false)
  }

  if (isModalOpen && !!draw && !!prizePool) {
    return (
      <Modal
        bodyContent={<MainView draw={draw} prizePool={prizePool} />}
        footerContent={
          <Button onClick={handleClose} fullSized={true}>
            Close
          </Button>
        }
        onClose={handleClose}
        label='draw-info'
        mobileStyle='tab'
        hideHeader={isMobile}
        className='md:!max-w-2xl'
      />
    )
  }

  return <></>
}
