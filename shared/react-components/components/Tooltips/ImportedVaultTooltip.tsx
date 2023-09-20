import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { Tooltip } from '@shared/ui'
import classNames from 'classnames'

export interface ImportedVaultTooltipProps {
  vaultLists: { name: string; href: string }[]
  iconSize?: 'sm' | 'md' | 'lg'
  intl?: string
  className?: string
  iconClassName?: string
}

export const ImportedVaultTooltip = (props: ImportedVaultTooltipProps) => {
  const { vaultLists, iconSize, intl, className, iconClassName } = props

  return (
    <Tooltip
      content={
        <div className={classNames('flex flex-col max-w-[16ch] text-center', className)}>
          <span>{intl ?? 'This vault is from the following imported list(s):'}</span>
          {vaultLists.map((vaultList) => (
            <a
              key={`imported-vl-${vaultList.href}`}
              href={vaultList.href}
              target='_blank'
              className='text-pt-purple-500 underline'
            >
              {vaultList.name}
            </a>
          ))}
        </div>
      }
    >
      <ExclamationTriangleIcon
        className={classNames(
          {
            'h-6 w-6': iconSize === 'lg',
            'h-5 w-5': iconSize === 'md' || !iconSize,
            'h-3 w-3': iconSize === 'sm'
          },
          iconClassName
        )}
      />
    </Tooltip>
  )
}
