import { Tooltip as FlowbiteTooltip, TooltipProps as FlowbiteTooltipProps } from 'flowbite-react'

export interface TooltipProps extends FlowbiteTooltipProps {
  inverseOrder?: boolean
  fullSized?: boolean
}

export const Tooltip = (props: TooltipProps) => {
  const { fullSized, inverseOrder, ...rest } = props

  return (
    <FlowbiteTooltip
      theme={{
        target: `${fullSized ? 'w-full' : 'w-fit'} ${inverseOrder ? 'order-2' : 'order-1'}`,
        style: {
          dark: 'bg-black text-white text-center'
        },
        arrow: {
          style: {
            dark: 'bg-black'
          }
        }
      }}
      {...rest}
    />
  )
}
