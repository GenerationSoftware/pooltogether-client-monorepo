import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultChainIdAtom, vaultTokenAddressAtom } from 'src/atoms'
import { Address, isAddress } from 'viem'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { useNetworks } from '@hooks/useNetworks'
import { useSteps } from '@hooks/useSteps'
import { NetworkInput } from './NetworkInput'
import { SimpleInput } from './SimpleInput'

interface ChainAndTokenFormValues {
  vaultChainId: string
  vaultToken: Address
}

interface ChainAndTokenFormProps {
  className?: string
}

export const ChainAndTokenForm = (props: ChainAndTokenFormProps) => {
  const { className } = props

  const formMethods = useForm<ChainAndTokenFormValues>({ mode: 'onSubmit' })

  const setVaultChainId = useSetAtom(vaultChainIdAtom)
  const setVaultTokenAddress = useSetAtom(vaultTokenAddressAtom)

  const networks = useNetworks()

  const { nextStep } = useSteps()

  const onSubmit = (data: ChainAndTokenFormValues) => {
    setVaultChainId(parseInt(data.vaultChainId))
    setVaultTokenAddress(data.vaultToken)
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className={classNames('', className)}>
        <div>
          <span>Select Network</span>
          <div>
            {networks.map((chainId) => (
              <NetworkInput key={`chain-${chainId}`} chainId={chainId} />
            ))}
          </div>
        </div>
        <SimpleInput
          formKey='vaultToken'
          validate={{
            isValidAddress: (v: string) => isAddress(v.trim()) || 'Enter a valid token address.'
          }}
          placeholder='0x0000...'
          label='Enter Deposit Token Address'
          className='max-w-md'
        />
        <PurpleButton type='submit'>Next</PurpleButton>
      </form>
    </FormProvider>
  )
}
