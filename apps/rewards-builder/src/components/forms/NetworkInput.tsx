import { NetworkBadge } from '@shared/react-components'
import classNames from 'classnames'
import { useFormContext, useWatch } from 'react-hook-form'
import { SupportedNetwork } from 'src/types'

interface NetworkInputFormValues {
  promotionChainId: string
}

interface NetworkInputProps {
  chainId: SupportedNetwork
  className?: string
}

export const NetworkInput = (props: NetworkInputProps) => {
  const { chainId, className } = props

  const { register } = useFormContext<NetworkInputFormValues>()
  const { promotionChainId } = useWatch<NetworkInputFormValues>()

  const id = `chainId-${chainId}`
  const isSelected = !!promotionChainId && chainId === parseInt(promotionChainId)

  return (
    <div className={className}>
      <input
        id={id}
        {...register('promotionChainId', {
          validate: { isSelected: (v: string) => !!v || 'Select a network!' }
        })}
        type='radio'
        value={chainId}
        className='hidden'
      />
      <label htmlFor={id}>
        <NetworkBadge
          chainId={chainId}
          onClick={() => {}}
          className={classNames({ 'border-pt-teal-dark': isSelected })}
        />
      </label>
    </div>
  )
}
