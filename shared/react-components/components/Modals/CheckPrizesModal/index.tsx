import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { MODAL_KEYS, useIsModalOpen, useScreenSize } from '@shared/generic-react-hooks'
import { Button, Modal } from '@shared/ui'
import { MainView } from './Views/MainView'

export interface CheckPrizesModalProps {
  prizePools: PrizePool[]
}

// TODO: localization
export const CheckPrizesModal = (props: CheckPrizesModalProps) => {
  const { prizePools } = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.checkPrizes)

  const { isMobile } = useScreenSize()

  const handleClose = () => {
    setIsModalOpen(false)
  }

  if (isModalOpen) {
    return (
      <Modal
        bodyContent={<MainView prizePools={prizePools} />}
        footerContent={
          <Button onClick={handleClose} className='mx-auto'>
            View Your Account
          </Button>
        }
        onClose={handleClose}
        label='prize-checking'
        mobileStyle='tab'
        hideHeader={isMobile}
        className='md:!max-w-2xl'
      />
    )
  }

  return <></>
}
