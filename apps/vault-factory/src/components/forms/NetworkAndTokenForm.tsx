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

interface NetworkAndTokenFormValues {
  vaultChainId: string
  vaultToken: Address
}

interface NetworkAndTokenFormProps {
  className?: string
}

export const NetworkAndTokenForm = (props: NetworkAndTokenFormProps) => {
  const { className } = props

  const formMethods = useForm<NetworkAndTokenFormValues>({ mode: 'onSubmit' })

  const setVaultChainId = useSetAtom(vaultChainIdAtom)
  const setVaultTokenAddress = useSetAtom(vaultTokenAddressAtom)

  const networks = useNetworks()

  const { nextStep } = useSteps()

  const onSubmit = (data: NetworkAndTokenFormValues) => {
    setVaultChainId(parseInt(data.vaultChainId))
    setVaultTokenAddress(data.vaultToken)
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col gap-12 items-center', className)}
      >
        <div className='flex flex-col gap-4 items-center'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Network</span>
          <div className='flex flex-wrap justify-center gap-x-6 gap-y-4'>
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
          className='w-full max-w-md'
        />
        {/* TODO: add arrow right icon to button */}
        <PurpleButton type='submit'>Next</PurpleButton>
      </form>
    </FormProvider>
  )
}
