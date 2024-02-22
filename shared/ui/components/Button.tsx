import classNames from 'classnames'
import { Button as FlowbiteButton, ButtonProps as FlowbiteButtonProps } from 'flowbite-react'

export interface ButtonProps extends FlowbiteButtonProps {
  color?: 'teal' | 'purple' | 'white' | 'red' | 'transparent' | 'darkPurple'
  active?: boolean
}

export const Button = (props: ButtonProps) => {
  const { color, active, className, ...rest } = props

  return (
    <FlowbiteButton
      theme={{
        base: 'group flex h-min items-center justify-center p-0.5 text-center font-medium border focus:ring-4 focus:z-10',
        color: {
          teal: 'text-pt-purple-800 bg-pt-teal border-pt-teal hover:bg-pt-teal-dark focus:ring-pt-teal-dark',
          purple:
            'text-pt-purple-700 bg-pt-purple-100 border-pt-purple-100 hover:bg-pt-purple-200 focus:ring-pt-purple-50',
          darkPurple:
            'text-pt-purple-50 bg-pt-purple-400 border-pt-purple-400 hover:bg-pt-purple-500 focus:ring-pt-purple-50',
          white: 'text-gray-900 bg-white border-white hover:bg-gray-100 focus:ring-gray-100',
          red: 'text-red-600 bg-pt-warning-light border-red-600 hover:text-pt-warning-light hover:bg-red-600 focus:ring-pt-warning',
          transparent:
            'text-pt-purple-100 bg-pt-transparent border-pt-transparent hover:bg-pt-purple-50/20 focus:ring-pt-purple-50'
        },
        outline: {
          color: {
            teal: '!text-pt-teal border-pt-teal bg-opacity-0 hover:!text-pt-purple-800 hover:bg-opacity-100',
            purple:
              '!text-pt-purple-100 border-pt-purple-100 bg-opacity-0 hover:!bg-pt-transparent hover:bg-opacity-100',
            darkPurple:
              '!text-pt-purple-400 border-pt-purple-400 bg-opacity-0 hover:!bg-pt-transparent hover:bg-opacity-100',
            white:
              '!text-white border-white bg-opacity-0 hover:!text-gray-900 hover:bg-opacity-100',
            red: '!text-pt-warning-light border-pt-warning-light bg-opacity-0 hover:!text-red-600 hover:bg-pt-warning-light hover:bg-opacity-100',
            transparent:
              '!text-pt-purple-50 border-pt-transparent bg-opacity-0 hover:!text-pt-purple-100 hover:bg-opacity-100'
          },
          on: 'flex justify-center'
        },
        disabled: 'cursor-not-allowed opacity-50 pointer-events-none',
        size: {
          sm: 'text-xs px-2 py-1',
          md: 'text-sm px-4 py-2',
          lg: 'px-5 py-2.5'
        }
      }}
      color={color ?? 'teal'}
      className={classNames({ outline: active }, className)}
      {...rest}
    />
  )
}
