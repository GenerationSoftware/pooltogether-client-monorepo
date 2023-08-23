import { useGrandPrize, usePrizePool } from '@pooltogether/hyperstructure-react-hooks'
import { TokenAmount, TokenValue } from '@shared/react-components'
import { Card, Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { SupportedNetwork } from 'src/types'
import { CONTRACTS } from '@constants/config'

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

const networkDescriptions: Record<SupportedNetwork, ReactNode> = {
  [NETWORK['optimism-goerli']]:
    'This is the main testnet used to try out the PoolTogether Hyperstructure.'
}

const NetworkCard = (props: NetworkCardProps) => {
  const { chainId } = props

  const prizePoolAddress = CONTRACTS[chainId].prizePool
  const prizePool = usePrizePool(chainId, prizePoolAddress)
  const { data: grandPrize } = useGrandPrize(prizePool, { useCurrentPrizeSizes: true })

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
      <span className='text-pt-purple-100'>
        Grand Prize:{' '}
        {!!grandPrize ? (
          <TokenValue
            token={grandPrize}
            fallback={<TokenAmount token={grandPrize} hideZeroes={true} />}
            hideZeroes={true}
          />
        ) : (
          <Spinner />
        )}
      </span>
      <span className='line-clamp-3'>{networkDescriptions[chainId]}</span>
    </Card>
  )
}
