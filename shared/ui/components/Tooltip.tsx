import { Tooltip as FlowbiteTooltip, TooltipProps as FlowbiteTooltipProps } from 'flowbite-react'

export interface TooltipProps extends FlowbiteTooltipProps {}

export const Tooltip = (props: TooltipProps) => {
  const { ...rest } = props

  return (
    <FlowbiteTooltip
      theme={{
        style: {
          dark: 'bg-pt-purple-100 text-gray-600 text-center'
        },
        arrow: {
          style: {
            dark: 'bg-pt-purple-100'
          }
        }
      }}
      {...rest}
    />
  )
}
