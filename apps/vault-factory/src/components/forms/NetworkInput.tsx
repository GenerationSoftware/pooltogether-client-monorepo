import { getNiceNetworkNameByChainId, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useFormContext, useWatch } from 'react-hook-form'

interface NetworkInputFormValues {
  vaultChainId: string
}

interface NetworkInputProps {
  chainId: NETWORK
  className?: string
}

export const NetworkInput = (props: NetworkInputProps) => {
  const { chainId, className } = props

  const { register } = useFormContext<NetworkInputFormValues>()

  const id = `chain-${chainId}`

  return (
    <div className={className}>
      <input
        id={id}
        {...register('vaultChainId', {
          validate: { isSelected: (v: string) => !!v || 'Select a network!' }
        })}
        type='radio'
        value={chainId}
        className='hidden'
      />
      <label htmlFor={id}>
        <NetworkCard chainId={chainId} />
      </label>
    </div>
  )
}

interface NetworkCardProps {
  chainId: NETWORK
}

const NetworkCard = (props: NetworkCardProps) => {
  const { chainId } = props

  const { vaultChainId } = useWatch<NetworkInputFormValues>()

  const isSelected = !!vaultChainId && chainId === parseInt(vaultChainId)

  return (
    <div className={classNames('', { '': isSelected })}>{getNiceNetworkNameByChainId(chainId)}</div>
  )
}
