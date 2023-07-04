import { NetworkBadge } from '@shared/react-components'
import { Button } from '@shared/ui'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { HTMLInputTypeAttribute } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { vaultsAtom } from 'src/atoms'
import { isAddress } from 'viem'
import { useNetworks } from '@hooks/useNetworks'

interface AddVaultFormValues {
  vaultName: string
  vaultAddress: `0x${string}`
  vaultChainId: string
}

interface AddVaultFormProps {
  className?: string
}

// TODO: better validation
// TODO: displaying errors
export const AddVaultForm = (props: AddVaultFormProps) => {
  const { className } = props

  const formMethods = useForm<AddVaultFormValues>({ mode: 'onSubmit' })

  const [vaultInfo, setVaultInfo] = useAtom(vaultsAtom)

  const networks = useNetworks()

  const onSubmit = (data: AddVaultFormValues) => {
    setVaultInfo([
      ...vaultInfo,
      { name: data.vaultName, address: data.vaultAddress, chainId: parseInt(data.vaultChainId) }
    ])
    formMethods.reset()
  }

  // TODO: only set this to complete if all fields are filled and/or selected
  const isFormComplete = true

  return (
    <FormProvider {...formMethods}>
      <div className={classNames('', className)}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Input
            formKey='vaultName'
            validate={{ isNotFalsyString: (v) => !!v || 'Enter a valid keyword.' }}
          />
          <Input
            formKey='vaultAddress'
            validate={{ isValidAddress: (v) => isAddress(v) || 'Enter a valid address.' }}
          />
          {networks.map((chainId) => {
            const id = `chain-${chainId}`

            return (
              <div key={id}>
                <Input
                  id={id}
                  formKey='vaultChainId'
                  type='radio'
                  value={chainId}
                  className='hidden'
                />
                <label htmlFor={id}>
                  <NetworkBadge chainId={chainId} onClick={() => {}} />
                </label>
              </div>
            )
          })}
          <Button type='submit' disabled={!isFormComplete}>
            Add Vault
          </Button>
        </form>
      </div>
    </FormProvider>
  )
}

interface InputProps {
  formKey: keyof AddVaultFormValues
  id?: string
  validate?: { [rule: string]: (v: any) => true | string }
  type?: HTMLInputTypeAttribute
  value?: string | number
  placeHolder?: string
  className?: string
}

const Input = (props: InputProps) => {
  const { formKey, id, validate, className, ...rest } = props

  const { register } = useFormContext<AddVaultFormValues>()

  return (
    <input
      id={id ?? formKey}
      {...register(formKey, { validate })}
      className={classNames('text-gray-700', className)}
      {...rest}
    />
  )
}
