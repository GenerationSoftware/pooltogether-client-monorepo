import { ExternalLink } from '@shared/ui'
import classNames from 'classnames'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  isUsingCustomYieldSourceAtom,
  vaultNameAtom,
  vaultSymbolAtom,
  vaultYieldSourceAddressAtom,
  vaultYieldSourceNameAtom
} from 'src/atoms'
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
  const setIsUsingCustomYieldSource = useSetAtom(isUsingCustomYieldSourceAtom)

  const setVaultName = useSetAtom(vaultNameAtom)
  const setVaultSymbol = useSetAtom(vaultSymbolAtom)

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
    const selectedYieldSourceName = data.vaultYieldSourceName.trim()
    const selectedYieldSourceAddress = data.vaultYieldSourceAddress.trim() as Address

    if (selectedYieldSourceAddress !== vaultYieldSourceAddress) {
      setVaultName(undefined)
      setVaultSymbol(undefined)
    }

    setVaultYieldSourceName(selectedYieldSourceName)
    setVaultYieldSourceAddress(selectedYieldSourceAddress)
    setStep(step + 2)
  }

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
        <button
          onClick={() => setIsUsingCustomYieldSource(false)}
          className='text-pt-teal-dark underline'
        >
          Return to list of suggested yield sources
        </button>
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
