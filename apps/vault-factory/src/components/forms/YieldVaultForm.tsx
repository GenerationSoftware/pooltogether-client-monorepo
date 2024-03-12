import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultChainIdAtom, vaultYieldSourceAddressAtom, vaultYieldSourceIdAtom } from 'src/atoms'
import { Address } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { NETWORK_CONFIG } from '@constants/config'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { YieldVaultInput } from './YieldVaultInput'

export interface YieldVaultFormValues {
  vaultYieldSourceAddress: string
}

interface YieldVaultFormProps {
  className?: string
}

export const YieldVaultForm = (props: YieldVaultFormProps) => {
  const { className } = props

  const formMethods = useForm<YieldVaultFormValues>({ mode: 'onChange' })

  const chainId = useAtomValue(vaultChainIdAtom)
  const vaultYieldSourceId = useAtomValue(vaultYieldSourceIdAtom)
  const [vaultYieldSourceAddress, setVaultYieldSourceAddress] = useAtom(vaultYieldSourceAddressAtom)

  const { nextStep } = useVaultCreationSteps()

  useEffect(() => {
    !!vaultYieldSourceAddress &&
      formMethods.setValue('vaultYieldSourceAddress', vaultYieldSourceAddress, {
        shouldValidate: true
      })
  }, [])

  const onSubmit = (data: YieldVaultFormValues) => {
    setVaultYieldSourceAddress(data.vaultYieldSourceAddress.trim() as Address)
    nextStep()
  }

  const yieldSource = useMemo(() => {
    if (!!chainId) {
      return NETWORK_CONFIG[chainId].yieldSources.find(
        (yieldSource) => yieldSource.id === vaultYieldSourceId
      )
    }
  }, [chainId, vaultYieldSourceId])

  if (!chainId || !yieldSource) {
    return <Spinner />
  }

  // TODO: add option to return to audited/compatible yield sources
  // TODO: add filtering options by tag
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <div className='w-full flex flex-col gap-4 items-center'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Deposit Token</span>
          <div className='w-full max-w-screen-md max-h-[50vh] flex flex-wrap justify-center gap-6 p-6 bg-pt-transparent rounded-2xl overflow-y-auto'>
            {yieldSource.vaults.map((yieldVault) => (
              <YieldVaultInput
                key={`${yieldSource.id}-${chainId}-${yieldVault.address}`}
                yieldVault={yieldVault}
              />
            ))}
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
