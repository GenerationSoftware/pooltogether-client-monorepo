import classNames from 'classnames'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
  labelClassName?: string
}

// TODO: add tick or X inside toggle
export const Toggle = (props: ToggleProps) => {
  const { checked, onChange, label, disabled, className, labelClassName } = props

  const toggle = () => {
    !disabled && onChange(!checked)
  }

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
          'w-[74px] h-10 rounded-full border border-gray-50',
          `after:content-[''] after:absolute after:top-1 after:left-1 after:rounded-full after:h-8 after:w-8 after:transition-all`,
          {
            'bg-gray-200 after:bg-gray-500': !checked,
            'bg-green-300 after:bg-green-100 after:translate-x-full': checked
          },
          { 'brightness-50': disabled }
        )}
      />
      {!!label && (
        <span className={classNames('ml-3 text-sm font-medium', labelClassName)}>{label}</span>
      )}
    </label>
  )
}
