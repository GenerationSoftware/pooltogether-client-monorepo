import HCaptcha from '@hcaptcha/react-hcaptcha'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { ExternalLink, Modal } from '@shared/ui'
import { ReactNode, useRef } from 'react'

export interface CaptchaModalProps {
  hCaptchaSiteKey: string
  header: ReactNode
  onVerify: (token: string) => void | Promise<void>
}

export const CaptchaModal = (props: CaptchaModalProps) => {
  const { hCaptchaSiteKey, header, onVerify } = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.captcha)

  const handleClose = () => {
    setIsModalOpen(false)
  }

  if (isModalOpen && !!hCaptchaSiteKey) {
    return (
      <Modal
        headerContent={<HeaderContent header={header} />}
        bodyContent={
          <BodyContent
            hCaptchaSiteKey={hCaptchaSiteKey}
            handleClose={handleClose}
            onVerify={onVerify}
          />
        }
        footerContent={<FooterContent />}
        onClose={handleClose}
        label='discord-captcha'
        mobileStyle='tab'
        className='md:!max-w-2xl'
        footerClassName='flex justify-center'
      />
    )
  }

  return <></>
}

interface HeaderContentProps {
  header: ReactNode
}

const HeaderContent = (props: HeaderContentProps) => {
  const { header } = props

  return <>{header}</>
}

interface BodyContentProps {
  hCaptchaSiteKey: string
  handleClose: () => void
  onVerify: (token: string) => void | Promise<void>
}

const BodyContent = (props: BodyContentProps) => {
  const { hCaptchaSiteKey, handleClose, onVerify } = props

  const captchaRef = useRef(null)

  const onExpire = () => {
    console.warn('hCaptcha Token Expired')
    handleClose()
  }

  return (
    <div className='flex flex-col items-center'>
      <HCaptcha
        sitekey={hCaptchaSiteKey}
        onVerify={onVerify}
        onExpire={onExpire}
        ref={captchaRef}
        theme='dark'
      />
    </div>
  )
}

const FooterContent = () => {
  return (
    <span className='text-center text-xs opacity-70'>
      This site is protected by hCaptcha and its{' '}
      <ExternalLink
        href='https://hcaptcha.com/privacy'
        text='Privacy Policy'
        className='text-xs text-pt-teal'
      />{' '}
      and{' '}
      <ExternalLink
        href='https://hcaptcha.com/terms'
        text='Terms of Service'
        className='text-xs text-pt-teal'
      />{' '}
      apply.
    </span>
  )
}
