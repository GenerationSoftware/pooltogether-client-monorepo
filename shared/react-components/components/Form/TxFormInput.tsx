import {
  formatBigIntForDisplay,
  TokenWithAmount,
  TokenWithLogo,
  TokenWithPrice
} from '@pooltogether/hyperstructure-client-js'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'
import { formatUnits } from 'viem'
import { CurrencyValue } from '../Currency/CurrencyValue'
import { TokenIcon } from '../Icons/TokenIcon'

export interface TxFormValues {
  tokenAmount: string
  shareAmount: string
}

export interface TxFormInputProps {
  token: TokenWithAmount & TokenWithPrice & Partial<TokenWithLogo>
  formKey: keyof TxFormValues
  validate?: { [rule: string]: (v: any) => true | string }
  disabled?: boolean
  onChange?: (v: string) => void
  showInfoRow?: boolean
  showMaxButton?: boolean
  className?: string
}

export const TxFormInput = (props: TxFormInputProps) => {
  const { token, formKey, validate, disabled, onChange, showInfoRow, showMaxButton, className } =
    props

  const {
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<TxFormValues>()

  const formAmount = watch(formKey, '0')
  const amountValue =
    isValidFormInput(formAmount, token.decimals) && !!token.price
      ? Number(formAmount) * token.price
      : 0

  const formattedBalance = formatBigIntForDisplay(token.amount, token.decimals)

  const error =
    !!errors[formKey]?.message && typeof errors[formKey]?.message === 'string'
      ? errors[formKey]?.message
      : null

  const setFormAmountToMax = () => {
    const formattedAmount = formatUnits(token.amount, token.decimals)
    setValue(
      formKey,
      formattedAmount.endsWith('.0') ? formattedAmount.slice(0, -2) : formattedAmount,
      {
        shouldValidate: true
      }
    )
    if (!!onChange) {
      onChange(formattedAmount)
    }
  }

  return (
    <div
      className={classNames(
        'relative bg-pt-transparent p-3 rounded-lg md:p-4',
        'border border-transparent focus-within:border-pt-transparent',
        className
      )}
    >
      <div className='flex justify-between gap-6'>
        <Input
          formKey={formKey}
          decimals={token.decimals}
          validate={validate}
          disabled={disabled}
          onChange={onChange}
        />
        <div className='flex shrink-0 items-center gap-1'>
          <TokenIcon token={token} />
          <span className='text-lg font-semibold md:text-2xl'>{token.symbol}</span>
        </div>
      </div>
      {showInfoRow && (
        <div className='flex justify-between gap-6 text-xs text-pt-purple-100 md:text-base'>
          <CurrencyValue baseValue={amountValue} />
          <div className='flex gap-1'>
            <span>Balance: {formattedBalance}</span>
            {showMaxButton && (
              <span
                onClick={setFormAmountToMax}
                className='text-pt-purple-200 cursor-pointer select-none'
              >
                Max
              </span>
            )}
          </div>
        </div>
      )}
      {!!error && <span className='text-sm text-pt-warning-light'>{error}</span>}
    </div>
  )
}

interface InputProps {
  formKey: keyof TxFormValues
  decimals: number
  validate?: { [rule: string]: (v: any) => true | string }
  disabled?: boolean
  onChange?: (v: string) => void
}

const Input = (props: InputProps) => {
  const { formKey, decimals, validate, disabled, onChange } = props

  const { register } = useFormContext<TxFormValues>()

  const basicValidation: { [rule: string]: (v: any) => true | string } = {
    isValidNumber: (v) => !Number.isNaN(Number(v)) || 'Enter a valid number',
    isGreaterThanOrEqualToZero: (v) => parseFloat(v) >= 0 || 'Enter a positive number',
    isNotTooPrecise: (v) =>
      v.split('.').length < 2 || v.split('.')[1].length <= decimals || 'Too many decimals'
  }

  return (
    <input
      id={formKey}
      {...register(formKey, {
        validate: { ...basicValidation, ...validate },
        onChange: (e) => onChange?.(e.target.value as string)
      })}
      placeholder='0'
      className='min-w-0 flex-grow text-lg font-semibold bg-transparent text-pt-purple-50 focus:outline-none md:text-2xl'
      disabled={disabled}
    />
  )
}

/**
 * Checks if a form value is valid
 * @param formValue the form value to check
 * @param decimals the decimals the input should be constrained to
 * @returns
 */
export const isValidFormInput = (formValue: string, decimals: number): boolean => {
  if (
    !!formValue &&
    !Number.isNaN(Number(formValue)) &&
    parseFloat(formValue) >= 0 &&
    (formValue.split('.').length < 2 || formValue.split('.')[1].length <= decimals)
  ) {
    return true
  } else {
    return false
  }
}
