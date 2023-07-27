import { Card } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { useFormContext, useWatch } from 'react-hook-form'
import { SupportedNetwork } from 'src/types'

interface NetworkInputFormValues {
  vaultChainId: string
}

interface NetworkInputProps {
  chainId: SupportedNetwork
  className?: string
}

export const NetworkInput = (props: NetworkInputProps) => {
  const { chainId, className } = props

  const { register } = useFormContext<NetworkInputFormValues>()

  const id = `chain-${chainId}`

  return (
    <div className={classNames('max-w-[25%]', className)}>
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
  chainId: SupportedNetwork
}

const NetworkCard = (props: NetworkCardProps) => {
  const { chainId } = props

  const { vaultChainId } = useWatch<NetworkInputFormValues>()

  const isSelected = !!vaultChainId && chainId === parseInt(vaultChainId)

  return (
    <Card
      wrapperClassName={classNames(
        'w-full h-full border cursor-pointer overflow-hidden hover:bg-pt-purple-50/20',
        {
          'border-pt-teal-dark': isSelected,
          'border-transparent': !isSelected
        }
      )}
      className='gap-3'
    >
      <span className='text-lg font-bold text-blue-500'>
        {getNiceNetworkNameByChainId(chainId)}
      </span>
      {/* TODO: add actual prize pool stat */}
      <span className='text-pt-purple-100'>some useful prize pool stat here</span>
      {/* TODO: add network description */}
      <span className='line-clamp-3'>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio, perspiciatis qui
        minima porro possimus ea perferendis, optio quidem praesentium voluptatum dolorem cum
        asperiores incidunt nesciunt? Ad minus numquam asperiores ratione!
      </span>
    </Card>
  )
}
