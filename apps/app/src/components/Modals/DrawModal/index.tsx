import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { MODAL_KEYS, useIsModalOpen, useScreenSize } from '@shared/generic-react-hooks'
import { SubgraphDraw } from '@shared/types'
import { Button, Modal } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { MainView } from './Views/MainView'

export interface DrawModalProps {
  draw?: SubgraphDraw
  prizePool?: PrizePool
  onClose?: () => void
}

export const DrawModal = (props: DrawModalProps) => {
  const { draw, prizePool, onClose } = props

  const t_common = useTranslations('Common')

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.drawWinners, { onClose })

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
            {t_common('close')}
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
