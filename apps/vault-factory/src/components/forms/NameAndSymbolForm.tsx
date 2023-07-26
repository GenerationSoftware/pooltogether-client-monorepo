import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultNameAtom, vaultSymbolAtom } from 'src/atoms'
import { isValidChars } from 'src/utils'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { useSteps } from '@hooks/useSteps'
import { useVaultNaming } from '@hooks/useVaultNaming'
import { SimpleInput } from './SimpleInput'

export interface NameAndSymbolFormValues {
  vaultName: string
  vaultSymbol: string
}

interface NameAndSymbolFormProps {
  className?: string
}

// TODO: form should auto-fill with existing data in case of returning from other step
export const NameAndSymbolForm = (props: NameAndSymbolFormProps) => {
  const { className } = props

  const formMethods = useForm<NameAndSymbolFormValues>({ mode: 'onChange' })

  const setVaultName = useSetAtom(vaultNameAtom)
  const setVaultSymbol = useSetAtom(vaultSymbolAtom)

  const { name: defaultName, symbol: defaultSymbol } = useVaultNaming()

  const { nextStep } = useSteps()

  const onSubmit = (data: NameAndSymbolFormValues) => {
    setVaultName(data.vaultName.trim())
    setVaultSymbol(data.vaultSymbol.trim())
    nextStep()
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <SimpleInput
          formKey='vaultName'
          validate={{
            isNotFalsyString: (v: string) => !!v || 'Enter a valid name.',
            isValidString: (v: string) =>
              isValidChars(v, { allowSpaces: true }) || 'Invalid characters in name.'
          }}
          defaultValue={defaultName}
          label='Vault Name'
          needsOverride={true}
          className='w-full max-w-md'
        />
        <SimpleInput
          formKey='vaultSymbol'
          validate={{
            isNotFalsyString: (v: string) => !!v || 'Enter a valid token symbol.',
            isValidString: (v: string) => isValidChars(v) || 'Invalid characters in token symbol.'
          }}
          defaultValue={defaultSymbol}
          label='Vault Symbol'
          needsOverride={true}
          className='w-full max-w-md'
        />
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}
