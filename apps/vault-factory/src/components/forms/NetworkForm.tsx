import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultChainIdAtom } from 'src/atoms'
import { NextButton } from '@components/buttons/NextButton'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { NetworkInput } from './NetworkInput'

interface NetworkFormValues {
  vaultChainId: string
}

interface NetworkFormProps {
  className?: string
}

export const NetworkForm = (props: NetworkFormProps) => {
  const { className } = props

  const formMethods = useForm<NetworkFormValues>({ mode: 'onChange' })

  const [vaultChainId, setVaultChainId] = useAtom(vaultChainIdAtom)

  const { nextStep } = useVaultCreationSteps()

  useEffect(() => {
    !!vaultChainId &&
      formMethods.setValue('vaultChainId', vaultChainId.toString(), { shouldValidate: true })
  }, [])

  const onSubmit = (data: NetworkFormValues) => {
    setVaultChainId(parseInt(data.vaultChainId))
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        {/* TODO: remove on full deployment */}
        <div className='flex flex-col items-center px-6 py-3 bg-pt-warning-light rounded-3xl'>
          <span className='text-center text-sm text-pt-warning-dark lg:text-base'>
            In anticipation of a new prize pool deployment, this app only supports the most recent
            testnet
          </span>
        </div>
        <div className='w-full flex flex-col gap-4 items-center'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Network</span>
          <div className='w-full flex flex-wrap justify-center gap-x-6 gap-y-4'>
            {SUPPORTED_NETWORKS.map((chainId) => (
              <NetworkInput key={`chain-${chainId}`} chainId={chainId} />
            ))}
          </div>
        </div>
        <NextButton disabled={!formMethods.formState.isValid} />
      </form>
    </FormProvider>
  )
}
