import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultDelegate } from '@generationsoftware/hyperstructure-react-hooks'
import { PencilIcon } from '@heroicons/react/24/outline'
import { DelegationDescriptionTooltip } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { atom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { DelegateModalView } from '.'

export const delegateFormNewDelegateAddressAtom = atom<Address | undefined>('0x')

interface DelegateFormValues {
  newDelegateAddress: Address | undefined
}

export interface DelegateFormProps {
  vault: Vault
  modalView: DelegateModalView
}

export const DelegateForm = (props: DelegateFormProps) => {
  const { vault, modalView } = props

  const t_txModals = useTranslations('TxModals')
  const t_tooltips = useTranslations('Tooltips')
  const t_common = useTranslations('Common')
  const t_errors = useTranslations('Error.formErrors')

  const { address: userAddress } = useAccount()

  const { data: delegate, isFetched: isFetchedDelegate } = useUserVaultDelegate(
    vault,
    userAddress!,
    { refetchOnWindowFocus: true }
  )

  const formMethods = useForm<DelegateFormValues>({ mode: 'onChange' })
  const { newDelegateAddress } = formMethods.watch()
  const { setValue } = formMethods

  const setFormNewDelegateAddressAtom = useSetAtom(delegateFormNewDelegateAddressAtom)

  const [isActiveOverride, setIsActiveOverride] = useState<boolean>(false)

  useEffect(() => {
    setIsActiveOverride(false)
    setValue('newDelegateAddress', undefined)
  }, [delegate])

  useEffect(() => {
    setFormNewDelegateAddressAtom(newDelegateAddress)
  }, [newDelegateAddress])

  if (!isFetchedDelegate) {
    return <Spinner />
  }

  return (
    <div className='flex flex-col'>
      <FormProvider {...formMethods}>
        <DelegateInput
          formKey='newDelegateAddress'
          autoComplete='off'
          disabled={modalView === 'waiting' || modalView === 'confirming'}
          validate={{
            isValidAddress: (v: string) => isAddress(v?.trim()) || t_errors('invalidAddress'),
            isSameAsDelegate: (v: string) => v?.trim() !== delegate || t_errors('sameAsDelegate')
          }}
          placeholder={delegate}
          label={
            <div className='flex items-center text-xs sm:text-sm'>
              <span className='mr-1'>{t_txModals('delegatedAddress')}</span>
              <DelegationDescriptionTooltip
                intl={{ tooltip: t_tooltips, common: t_common }}
                className='whitespace-normal'
              />
            </div>
          }
          isActiveOverride={isActiveOverride}
          setIsActiveOverride={setIsActiveOverride}
          needsOverride={true}
          overrideLabel={
            <div className='flex items-center text-xs sm:text-sm'>
              <PencilIcon className='w-3 h-3 sm:w-4 sm:h-4 mr-1' />
              <span className='hidden sm:inline-block capitalize'>
                {t_txModals('changeDelegateAddress')}
              </span>
              <span className='sm:hidden'>{t_txModals('changeDelegateAddressShort')}</span>
            </div>
          }
          keepValueOnOverride={true}
          className='w-full max-w-md'
        />
      </FormProvider>
    </div>
  )
}

interface DelegateInputProps {
  formKey: string
  id?: string
  autoComplete?: string
  validate?: { [rule: string]: (v: any) => true | string }
  placeholder?: string
  defaultValue?: string
  label?: ReactNode
  hideErrorMsgs?: boolean
  autoFocus?: boolean
  disabled?: boolean
  needsOverride?: boolean
  isActiveOverride?: boolean
  setIsActiveOverride?: (val: boolean) => void
  overrideLabel?: ReactNode
  keepValueOnOverride?: boolean
  onOverride?: (val: boolean) => void
  className?: string
  labelClassName?: string
  innerClassName?: string
  errorClassName?: string
}

export const DelegateInput = (props: DelegateInputProps) => {
  const {
    formKey,
    id,
    autoComplete,
    validate,
    placeholder,
    defaultValue,
    label,
    hideErrorMsgs,
    autoFocus,
    disabled,
    needsOverride,
    setIsActiveOverride,
    isActiveOverride,
    overrideLabel,
    keepValueOnOverride,
    onOverride,
    className,
    labelClassName,
    innerClassName,
    errorClassName
  } = props

  const { register, formState, setValue } = useFormContext()

  const formValues = useWatch()

  const handleOverride = () => {
    !keepValueOnOverride && setValue(formKey, '')
    setIsActiveOverride?.(true)
    onOverride?.(true)
  }

  const handleBlur = () => {
    if ((needsOverride && !formValues[formKey]) || formValues[formKey] === defaultValue) {
      setValue(formKey, defaultValue, { shouldValidate: true })
      setIsActiveOverride?.(false)
      onOverride?.(false)
    }
  }

  const error = formState.errors[formKey]?.message as string | undefined

  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      <label
        htmlFor={id ?? formKey}
        className={classNames('flex items-center justify-between text-sm', labelClassName)}
      >
        <span className='font-medium text-pt-purple-100'>{label}</span>
        {needsOverride && !isActiveOverride && (
          <span onClick={handleOverride} className='text-pt-teal cursor-pointer underline'>
            {overrideLabel ?? 'override'}
          </span>
        )}
      </label>
      <input
        id={id ?? formKey}
        {...register(formKey, { validate })}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        onBlur={handleBlur}
        autoComplete={autoComplete}
        onClick={handleOverride}
        className={classNames(
          'px-3 py-2 text-sm leading-tight rounded-lg border outline outline-1',
          'md:px-4 md:py-3',
          {
            'bg-pt-purple-50 text-gray-700 border-gray-300':
              !needsOverride || (needsOverride && isActiveOverride),
            'bg-transparent text-pt-teal border-pt-teal cursor-pointer':
              needsOverride && !isActiveOverride,
            'brightness-75': disabled,
            [`outline-red-600 ${errorClassName}`]: !!error,
            'outline-transparent': !error
          },
          innerClassName
        )}
      />
      {!hideErrorMsgs && <span className='text-xs text-pt-warning-light'>{error}</span>}
    </div>
  )
}
