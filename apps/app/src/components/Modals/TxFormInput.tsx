import { CurrencyValue, TokenIcon } from '@shared/react-components'
import { TokenWithAmount, TokenWithLogo, TokenWithPrice } from '@shared/types'
import { Dropdown, DropdownItem, Spinner } from '@shared/ui'
import { DOLPHIN_ADDRESS, formatNumberForDisplay, lower } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
import { getRoundedDownFormattedTokenAmount } from 'src/utils'
import { formatUnits } from 'viem'
import { NATIVE_ASSET_IGNORE_AMOUNT } from '@constants/config'

export interface TxFormValues {
  tokenAmount: string
  shareAmount: string
}

export interface TxFormInputProps {
  token?: TokenWithAmount & TokenWithPrice & Partial<TokenWithLogo>
  formKey: keyof TxFormValues
  validate?: { [rule: string]: (v: any) => true | string }
  disabled?: boolean
  isLoading?: boolean
  onChange?: (v: string) => void
  showInfoRow?: boolean
  showMaxButton?: boolean
  showTokenPicker?: boolean
  tokenPickerOptions?: DropdownItem[]
  priceImpact?: number
  fallbackLogoToken?: Partial<TokenWithLogo>
  className?: string
  inputClassName?: string
  disabledCoverClassName?: string
}

const TokenBadge = (props: {
  token: Partial<TokenWithLogo>
  fallbackLogoToken?: Partial<TokenWithLogo>
  className?: string
}) => {
  const { token, fallbackLogoToken } = props

  return (
    <div className={classNames('flex shrink-0 items-center gap-1', props.className)}>
      <TokenIcon token={token} fallbackToken={fallbackLogoToken} />
      <span className='text-lg font-semibold md:text-2xl'>
        {token.symbol && token.symbol?.length > 17
          ? `${token.symbol?.slice(0, 15)}...`
          : token.symbol}
      </span>
    </div>
  )
}

export const TxFormInput = (props: TxFormInputProps) => {
  const {
    token,
    formKey,
    validate,
    disabled,
    isLoading,
    onChange,
    showInfoRow,
    showMaxButton,
    showTokenPicker,
    tokenPickerOptions,
    priceImpact,
    fallbackLogoToken,
    className,
    inputClassName,
    disabledCoverClassName
  } = props

  const t = useTranslations('TxModals')

  const {
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<TxFormValues>()

  const formAmount = watch(formKey, '0')

  if (!token) {
    return (
      <div
        className={classNames(
          'relative bg-pt-transparent rounded-lg',
          'border border-transparent focus-within:border-pt-transparent',
          {
            'h-[4.375rem] md:h-[5.625rem]': showInfoRow,
            'h-[3.375rem] md:h-[4.125rem]': !showInfoRow
          },
          className
        )}
      >
        <div className='absolute inset-0 flex items-center pl-4 rounded-lg backdrop-brightness-75 backdrop-blur-sm'>
          <Spinner />
        </div>
      </div>
    )
  }

  const amountValue =
    isValidFormInput(formAmount, token.decimals) && !!token.price
      ? Number(formAmount) * token.price
      : 0

  const error =
    !!errors[formKey]?.message && typeof errors[formKey]?.message === 'string'
      ? errors[formKey]?.message
      : null

  const setFormAmountToMax = () => {
    const maxAmount =
      lower(token.address) === DOLPHIN_ADDRESS
        ? token.amount > NATIVE_ASSET_IGNORE_AMOUNT[token.chainId]
          ? token.amount - NATIVE_ASSET_IGNORE_AMOUNT[token.chainId]
          : 0n
        : token.amount

    const formattedAmount = formatUnits(maxAmount, token.decimals)
    const slicedAmount = formattedAmount.endsWith('.0')
      ? formattedAmount.slice(0, -2)
      : formattedAmount

    setValue(formKey, slicedAmount, { shouldValidate: true })
    onChange?.(formattedAmount)
  }

  const formattedPriceImpact =
    priceImpact !== undefined &&
    `${priceImpact > 0 ? '+' : ''}${formatNumberForDisplay(priceImpact, {
      maximumFractionDigits: 2
    })}%`

  return (
    <div
      className={classNames(
        'relative bg-pt-transparent p-3 rounded-lg md:p-4',
        'border border-transparent focus-within:border-pt-transparent',
        'isolate',
        className
      )}
    >
      <div className='flex justify-between md:gap-2'>
        <Input
          formKey={formKey}
          decimals={token.decimals}
          validate={validate}
          disabled={disabled || isLoading}
          onChange={onChange}
          className={classNames(inputClassName, { '-z-20': disabled || isLoading })}
        />
        {(disabled || isLoading) && (
          <div
            className={classNames(
              'absolute inset-0 rounded-lg backdrop-brightness-75 -z-10',
              disabled && !isLoading ? disabledCoverClassName : '',
              { 'flex items-center pl-4 backdrop-blur-sm': isLoading }
            )}
          >
            <Spinner className={classNames({ hidden: !isLoading })} />
          </div>
        )}
        {showTokenPicker && !!tokenPickerOptions?.length ? (
          <div className='relative shrink-0'>
            <Dropdown
              label={<TokenBadge token={token} fallbackLogoToken={fallbackLogoToken} />}
              items={tokenPickerOptions}
              inline={true}
              className='pl-1 pr-1 border-0 rounded-lg hover:bg-pt-transparent'
              floatingContentClassName='md:!fixed md:!inset-auto md:max-h-[50vh] md:!transform-none md:-mx-[calc(0.5rem+1px)] md:-my-[calc(2.5rem+1px)] md:overflow-auto'
            />
          </div>
        ) : (
          <TokenBadge token={token} fallbackLogoToken={fallbackLogoToken} />
        )}
      </div>
      {showInfoRow && (
        <div className='flex justify-between gap-6 text-xs text-pt-purple-100 md:text-base'>
          <div className={classNames({ '-z-20': disabled || isLoading })}>
            <CurrencyValue baseValue={amountValue} fallback={<></>} />{' '}
            {priceImpact !== undefined && (
              <span className='text-pt-purple-300'>({formattedPriceImpact})</span>
            )}
          </div>
          <div className='flex gap-1 ml-auto'>
            <span>
              {t('balance')} {getRoundedDownFormattedTokenAmount(token.amount, token.decimals)}
            </span>
            {showMaxButton && (
              <span
                onClick={setFormAmountToMax}
                className='text-pt-purple-200 cursor-pointer select-none'
              >
                {t('max')}
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
  className?: string
}

const Input = (props: InputProps) => {
  const { formKey, decimals, validate, disabled, onChange, className } = props

  const t = useTranslations('Error.formErrors')

  const { register } = useFormContext<TxFormValues>()

  const basicValidation: { [rule: string]: (v: any) => true | string } = {
    isValidNumber: (v) => !Number.isNaN(Number(v)) || t('invalidNumber'),
    isGreaterThanOrEqualToZero: (v) => parseFloat(v) >= 0 || t('negativeNumber'),
    isNotTooPrecise: (v) =>
      v.split('.').length < 2 || v.split('.')[1].length <= decimals || t('tooManyDecimals')
  }

  return (
    <input
      id={formKey}
      {...register(formKey, {
        validate: { ...basicValidation, ...validate },
        onChange: (e) => onChange?.(e.target.value as string)
      })}
      placeholder='0'
      className={classNames(
        'min-w-0 flex-grow text-lg font-semibold bg-transparent text-pt-purple-50',
        'focus:outline-none md:text-2xl',
        className
      )}
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
