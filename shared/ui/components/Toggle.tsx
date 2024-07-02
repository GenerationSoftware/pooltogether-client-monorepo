import classNames from 'classnames'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  size?: 'sm' | 'md'
  label?: string
  disabled?: boolean
  className?: string
  labelClassName?: string
}

export const Toggle = (props: ToggleProps) => {
  const { checked, onChange, size, label, disabled, className, labelClassName } = props

  const toggle = () => {
    !disabled && onChange(!checked)
  }

  const iconClassName = 'absolute rounded-full opacity-0 transition-all'

  return (
    <label
      className={classNames(
        'relative inline-flex items-center',
        { 'cursor-pointer': !disabled },
        className
      )}
    >
      <input
        type='checkbox'
        value=''
        className='sr-only'
        onClick={toggle}
        onKeyDown={() => {}}
        defaultChecked={checked}
        disabled={disabled}
      />
      <div
        className={classNames(
          'rounded-full border border-gray-50',
          { 'w-[46px] h-6': size === 'sm', 'w-[74px] h-10': size === 'md' || !size },
          { 'bg-gray-200': !checked, 'bg-green-300': checked },
          { 'brightness-50': disabled }
        )}
      >
        <span
          className={classNames(
            'absolute rounded-full transition-all',
            {
              'top-[2px] left-[2px] w-5 h-5': size === 'sm',
              'top-1 left-1 w-8 h-8': size === 'md' || !size
            },
            {
              'translate-x-full': checked
            }
          )}
        >
          <CheckIcon
            className={classNames(iconClassName, 'bg-green-100 text-green-500', {
              'opacity-100': checked
            })}
          />
          <XIcon
            className={classNames(iconClassName, 'bg-gray-500 text-gray-100', {
              'opacity-100': !checked
            })}
          />
        </span>
      </div>
      {!!label && (
        <span
          className={classNames(
            'text-sm font-medium',
            { 'ml-2': size === 'sm', 'ml-3': size === 'md' || !size },
            labelClassName
          )}
        >
          {label}
        </span>
      )}
    </label>
  )
}

const CheckIcon = (props: { className?: string }) => (
  <svg
    fill='none'
    stroke='currentColor'
    strokeWidth={1.5}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={props.className}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M 9 12.75 L 11.25 15 15 9.75' />
  </svg>
)

const XIcon = (props: { className?: string }) => (
  <svg
    fill='none'
    stroke='currentColor'
    strokeWidth={1.5}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={props.className}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M 9.75 9.75 l 4.5 4.5 m 0 -4.5 l -4.5 4.5'
    />
  </svg>
)
