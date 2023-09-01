import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { MODAL_KEYS, useIsModalOpen, useScreenSize } from '@shared/generic-react-hooks'
import { Intl, SubgraphDraw } from '@shared/types'
import { Button, Modal } from '@shared/ui'
import { MainView } from './Views/MainView'

export interface DrawModalProps {
  draw?: SubgraphDraw
  prizePool?: PrizePool
  intl?: {
    base?: Intl<'close' | 'prizePool' | 'drawId'>
    prizes?: Intl<'drawTotal' | 'winner' | 'prize'>
  }
}

export const DrawModal = (props: DrawModalProps) => {
  const { draw, prizePool, intl } = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.drawWinners)

  const { isMobile } = useScreenSize()

  const handleClose = () => {
    setIsModalOpen(false)
  }

  if (isModalOpen && !!draw && !!prizePool) {
    return (
      <Modal
        bodyContent={<MainView draw={draw} prizePool={prizePool} intl={intl} />}
        footerContent={
          <Button onClick={handleClose} fullSized={true}>
            {intl?.base?.('close') ?? 'Close'}
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
