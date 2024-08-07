import { usePrizeDrawWinners } from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen, useScreenSize } from '@shared/generic-react-hooks'
import { Button, Modal } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { drawIdAtom } from '@components/Prizes/PrizePoolWinners'
import { useSelectedPrizePool } from '@hooks/useSelectedPrizePool'
import { MainView } from './Views/MainView'

export interface DrawModalProps {
  onClose?: () => void
}

export const DrawModal = (props: DrawModalProps) => {
  const { onClose } = props

  const t_common = useTranslations('Common')

  const { selectedPrizePool } = useSelectedPrizePool()
  const { data: draws } = usePrizeDrawWinners(selectedPrizePool!)

  const selectedDrawId = useAtomValue(drawIdAtom)
  const selectedDraw = draws?.find((draw) => draw.id === selectedDrawId)

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.drawWinners, { onClose })

  const { isMobile } = useScreenSize()

  const handleClose = () => {
    setIsModalOpen(false)
  }

  if (isModalOpen && !!selectedDraw && !!selectedPrizePool) {
    return (
      <Modal
        bodyContent={<MainView draw={selectedDraw} prizePool={selectedPrizePool} />}
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
