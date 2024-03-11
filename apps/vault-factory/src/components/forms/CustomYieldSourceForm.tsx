import { ExternalLink } from '@shared/ui'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultYieldSourceAddressAtom, vaultYieldSourceNameAtom } from 'src/atoms'
import { isValidChars } from 'src/utils'
import { Address, isAddress } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { SimpleInput } from './SimpleInput'

export interface CustomYieldSourceFormValues {
  vaultYieldSourceName: string
  vaultYieldSourceAddress: string
}

interface CustomYieldSourceFormProps {
  className?: string
}

export const CustomYieldSourceForm = (props: CustomYieldSourceFormProps) => {
  const { className } = props

  const formMethods = useForm<CustomYieldSourceFormValues>({ mode: 'onChange' })

  const [vaultYieldSourceName, setVaultYieldSourceName] = useAtom(vaultYieldSourceNameAtom)
  const [vaultYieldSourceAddress, setVaultYieldSourceAddress] = useAtom(vaultYieldSourceAddressAtom)

  const { step, setStep } = useVaultCreationSteps()

  useEffect(() => {
    !!vaultYieldSourceName &&
      formMethods.setValue('vaultYieldSourceName', vaultYieldSourceName, { shouldValidate: true })
    !!vaultYieldSourceAddress &&
      formMethods.setValue('vaultYieldSourceAddress', vaultYieldSourceAddress, {
        shouldValidate: true
      })
  }, [])

  const onSubmit = (data: CustomYieldSourceFormValues) => {
    setVaultYieldSourceName(data.vaultYieldSourceName.trim())
    setVaultYieldSourceAddress(data.vaultYieldSourceAddress.trim() as Address)
    setStep(step + 2)
  }

  // TODO: add option to return to audited/compatible yield sources
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <ExternalLink
          href='https://ethereum.org/en/developers/docs/standards/tokens/erc-4626/'
          className='text-pt-teal-dark'
        >
          What is ERC-4626?
        </ExternalLink>
        <SimpleInput
          formKey='vaultYieldSourceName'
          validate={{
            isNotFalsyString: (v: string) => !!v || 'Enter a valid name.',
            isValidString: (v: string) =>
              isValidChars(v, { allowSpaces: true }) || 'Invalid characters in name.'
          }}
          placeholder='Aave, Yearn, etc.'
          label='Yield Source Name'
          className='w-full max-w-sm'
        />
        <SimpleInput
          formKey='vaultYieldSourceAddress'
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || 'Enter a valid contract address.'
          }}
          placeholder='0x0000...'
          label='Yield Source Address'
          className='w-full max-w-sm'
        />
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
