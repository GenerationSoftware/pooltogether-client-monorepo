import { ClipboardIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode, useState } from 'react'

interface CopyButtonProps {
  data: string
  children: ReactNode
  className?: string
  buttonClassName?: string
  iconClassName?: string
}

export const CopyButton = (props: CopyButtonProps) => {
  const { data, children, className, buttonClassName, iconClassName } = props

  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  const copy = () => {
    navigator.clipboard.writeText(data)
    setShowTooltip(true)
  }

  const dismissTooltip = () => {
    setShowTooltip(false)
  }

  return (
    <Tooltip content='Copied!' className={classNames({ hidden: !showTooltip }, className)}>
      <button
        onClick={copy}
        onMouseLeave={dismissTooltip}
        className={classNames(
          'flex gap-[.1rem] items-center whitespace-nowrap cursor-pointer',
          buttonClassName
        )}
      >
        {children}
        <ClipboardIcon className={classNames('w-3 h-3 md:w-4 md:h-4', iconClassName)} />
      </button>
    </Tooltip>
  )
}
