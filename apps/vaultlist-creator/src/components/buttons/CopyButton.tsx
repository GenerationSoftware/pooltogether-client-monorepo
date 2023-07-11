import { ClipboardIcon } from '@heroicons/react/24/outline'
import { sToMs } from '@shared/utilities'
import { useEffect, useState } from 'react'
import { PurpleButton } from './PurpleButton'

interface CopyButtonProps {
  str: string
  text: string
  className?: string
}

export const CopyButton = (props: CopyButtonProps) => {
  const { str, text, className } = props

  const [buttonText, setButtonText] = useState<string>(text)

  useEffect(() => {
    if (buttonText !== text) {
      setTimeout(() => setButtonText(text), sToMs(3))
    }
  }, [buttonText])

  const handleCopy = () => {
    navigator.clipboard.writeText(str)
    setButtonText('Copied!')
  }

  return (
    <PurpleButton
      onClick={handleCopy}
      size='sm'
      className={className}
      innerClassName='flex gap-1 items-center'
    >
      <ClipboardIcon className='w-4 h-4 lg:w-6 lg:h-6' />
      <span className='text-xs lg:text-sm'>{buttonText}</span>
    </PurpleButton>
  )
}
