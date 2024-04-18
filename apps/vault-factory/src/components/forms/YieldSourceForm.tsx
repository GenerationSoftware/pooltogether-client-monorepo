import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  isUsingCustomYieldSourceAtom,
  vaultChainIdAtom,
  vaultYieldSourceIdAtom,
  vaultYieldSourceNameAtom
} from 'src/atoms'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { NETWORK_CONFIG } from '@constants/config'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { YieldSourceInput } from './YieldSourceInput'

export interface YieldSourceFormValues {
  vaultYieldSourceId: string
}

interface YieldSourceFormProps {
  className?: string
}

export const YieldSourceForm = (props: YieldSourceFormProps) => {
  const { className } = props

  const formMethods = useForm<YieldSourceFormValues>({ mode: 'onChange' })

  const chainId = useAtomValue(vaultChainIdAtom)
  const [vaultYieldSourceId, setVaultYieldSourceId] = useAtom(vaultYieldSourceIdAtom)
  const setVaultYieldSourceName = useSetAtom(vaultYieldSourceNameAtom)
  const setIsUsingCustomYieldSource = useSetAtom(isUsingCustomYieldSourceAtom)

  const { nextStep } = useVaultCreationSteps()

  useEffect(() => {
    !!vaultYieldSourceId &&
      formMethods.setValue('vaultYieldSourceId', vaultYieldSourceId, { shouldValidate: true })
  }, [])

  const onSubmit = (data: YieldSourceFormValues) => {
    setVaultYieldSourceId(data.vaultYieldSourceId)

    if (!!chainId) {
      setVaultYieldSourceName(
        NETWORK_CONFIG[chainId].yieldSources.find(
          (yieldSource) => yieldSource.id === data.vaultYieldSourceId
        )?.name ?? ''
      )
    }

    nextStep()
  }

  if (!chainId) {
    return <Spinner />
  }

  const isNoYieldSources = !NETWORK_CONFIG[chainId].yieldSources.length

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <div className='w-full flex flex-col gap-4 items-center'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Yield Source</span>
          <div className='w-full flex flex-wrap justify-center gap-x-6 gap-y-4'>
            {NETWORK_CONFIG[chainId].yieldSources.map((yieldSource) => (
              <YieldSourceInput key={yieldSource.id} yieldSource={yieldSource} />
            ))}
            {isNoYieldSources && (
              <span className='text-pt-warning-light text-sm'>
                No default yield sources currently available for this network.
              </span>
            )}
          </div>
          <div className='flex flex-col gap-2 items-center'>
            <span>Or...</span>
            <button
              onClick={() => setIsUsingCustomYieldSource(true)}
              className='text-pt-teal-dark underline'
            >
              Use a custom ERC-4626 yield source
            </button>
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid || isNoYieldSources} />
        </div>
      </form>
    </FormProvider>
  )
}
