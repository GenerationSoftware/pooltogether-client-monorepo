import { Card, ExternalLink } from '@shared/ui'
import classNames from 'classnames'
import { useFormContext, useWatch } from 'react-hook-form'
import { SupportedNetwork } from 'src/types'
import { NETWORK_CONFIG } from '@constants/config'

interface YieldSourceInputFormValues {
  vaultYieldSourceId: string
}

interface YieldSourceInputProps {
  yieldSource: (typeof NETWORK_CONFIG)[SupportedNetwork]['yieldSources'][number]
  className?: string
}

export const YieldSourceInput = (props: YieldSourceInputProps) => {
  const { yieldSource, className } = props

  const { register } = useFormContext<YieldSourceInputFormValues>()

  const id = `yieldSource-${yieldSource.id}`

  return (
    <div className={classNames('max-w-sm lg:max-w-[25%]', className)}>
      <input
        id={id}
        {...register('vaultYieldSourceId', {
          validate: { isSelected: (v: string) => !!v || 'Select a yield source!' }
        })}
        type='radio'
        value={yieldSource.id}
        className='hidden'
      />
      <label htmlFor={id}>
        <YieldSourceCard yieldSource={yieldSource} />
      </label>
    </div>
  )
}

interface YieldSourceCardProps {
  yieldSource: (typeof NETWORK_CONFIG)[SupportedNetwork]['yieldSources'][number]
}

const YieldSourceCard = (props: YieldSourceCardProps) => {
  const { yieldSource } = props

  const { vaultYieldSourceId } = useWatch<YieldSourceInputFormValues>()

  const isSelected = !!vaultYieldSourceId && vaultYieldSourceId === yieldSource.id

  return (
    <Card
      wrapperClassName={classNames(
        'w-full h-full border cursor-pointer overflow-hidden hover:bg-pt-purple-50/20',
        { 'border-pt-teal-dark': isSelected, 'border-transparent': !isSelected }
      )}
      className='gap-3'
    >
      <span className='text-lg font-bold text-pt-purple-100'>{yieldSource.name}</span>
      <ExternalLink href={yieldSource.href} className='mr-auto text-blue-500'>
        {yieldSource.href}
      </ExternalLink>
      <span className='hidden line-clamp-3 lg:block'>{yieldSource.description}</span>
    </Card>
  )
}
