import { XMarkIcon } from '@heroicons/react/24/solid'
import { useScreenSize } from '@shared/generic-react-hooks'
import classNames from 'classnames'
import { AnimatePresence, AnimationProps, motion, useReducedMotion } from 'framer-motion'
import { ReactNode, useLayoutEffect, useState } from 'react'
import ReactDOM from 'react-dom'

type MobileStyle = 'tab' | 'cover'

export interface ModalProps {
  headerContent?: ReactNode
  bodyContent: ReactNode
  footerContent?: ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
  footerClassName?: string
  onClose: () => void
  label: string
  hideHeader?: boolean
  mobileStyle?: MobileStyle
}

// TODO: all mobile modals should be draggable back to the direction they came from
export const Modal = (props: ModalProps) => {
  const { className, onClose, label, mobileStyle, ...rest } = props

  const [el] = useState<HTMLDivElement>(document.createElement('div'))

  useLayoutEffect(() => {
    const modalRoot = document.getElementById('modal-root')
    if (!!modalRoot) {
      modalRoot.appendChild(el)
      return () => {
        modalRoot.removeChild(el)
      }
    }
  }, [])

  const { isDesktop, isFetched: isFetchedScreenSize } = useScreenSize()

  const shouldReduceMotion = useReducedMotion()

  const animations: Record<'desktop' | MobileStyle, AnimationProps> = {
    desktop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: shouldReduceMotion ? 0 : 0.1, ease: 'linear' }
    },
    tab: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      transition: { duration: shouldReduceMotion ? 0 : 0.1, ease: 'easeInOut' }
    },
    cover: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { duration: shouldReduceMotion ? 0 : 0.1, ease: 'easeInOut' }
    }
  }

  const [isModalShown, setIsModalShown] = useState<boolean>(true)

  if (isFetchedScreenSize) {
    const animationProps = isDesktop
      ? animations.desktop
      : mobileStyle === 'cover'
      ? animations.cover
      : animations.tab

    return ReactDOM.createPortal(
      <ModalBackdrop label={label} onClose={() => setIsModalShown(false)}>
        <AnimatePresence onExitComplete={onClose}>
          {isModalShown && (
            <motion.div
              id='modal-animation-wrapper'
              key={`modal-${label}`}
              {...animationProps}
              className={classNames(
                'flex flex-col relative items-center p-8 shadow-xl overflow-y-auto md:rounded-lg',
                'bg-pt-purple-700 text-pt-purple-50',
                'h-screen md:h-auto md:max-h-[90vh]',
                'w-screen md:w-full md:max-w-lg',
                {
                  '!h-auto max-h-[90vh] rounded-t-lg': mobileStyle === 'tab' || !mobileStyle
                },
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalContent
                onClose={() => setIsModalShown(false)}
                mobileStyle={mobileStyle}
                {...rest}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ModalBackdrop>,
      el
    )
  }

  return <></>
}

interface ModalBackdropProps {
  label: string
  onClose: () => void
  children: ReactNode
}

const ModalBackdrop = (props: ModalBackdropProps) => {
  const { label, onClose, children } = props

  return (
    <div
      className='fixed flex inset-0 items-end justify-center bg-black/70 z-[100] md:items-center'
      onClick={onClose}
      aria-label={label}
    >
      {children}
    </div>
  )
}

interface ModalContentProps {
  headerContent?: ReactNode
  bodyContent: ReactNode
  footerContent?: ReactNode
  headerClassName?: string
  bodyClassName?: string
  footerClassName?: string
  onClose: () => void
  hideHeader?: boolean
  mobileStyle?: MobileStyle
}

const ModalContent = (props: ModalContentProps) => {
  const {
    headerContent,
    bodyContent,
    footerContent,
    headerClassName,
    bodyClassName,
    footerClassName,
    onClose,
    hideHeader,
    mobileStyle
  } = props

  return (
    <>
      {mobileStyle === 'tab' && <ModalTabHandle />}
      {!hideHeader && (
        <ModalHeader className={headerClassName} onClose={onClose}>
          {headerContent}
        </ModalHeader>
      )}
      <ModalBody className={bodyClassName}>{bodyContent}</ModalBody>
      {!!footerContent && <ModalFooter className={footerClassName}>{footerContent}</ModalFooter>}
    </>
  )
}

interface ModalHeaderProps {
  children?: ReactNode
  className?: string
  onClose?: () => void
}

const ModalHeader = (props: ModalHeaderProps) => {
  const { children, className, onClose } = props

  return (
    <div className={classNames('w-full flex pb-4 text-pt-purple-50', className)}>
      {children}
      <XMarkIcon className='h-6 w-6 ml-auto cursor-pointer' onClick={onClose} />
    </div>
  )
}

interface ModalBodyProps {
  children?: ReactNode
  className?: string
}

const ModalBody = (props: ModalBodyProps) => {
  const { children, className } = props

  return <div className={classNames('w-full max-w-xl md:max-w-none', className)}>{children}</div>
}

interface ModalFooterProps {
  children?: ReactNode
  className?: string
}

const ModalFooter = (props: ModalFooterProps) => {
  const { children, className } = props

  return (
    <div className={classNames('w-full max-w-xl pt-4 md:max-w-none', className)}>{children}</div>
  )
}

const ModalTabHandle = () => {
  return (
    <hr className='absolute top-2 left-1/2 -translate-x-1/2 w-8 rounded border-1 border-pt-purple-200 md:hidden' />
  )
}
