import { Tooltip as FlowbiteTooltip, TooltipProps as FlowbiteTooltipProps } from 'flowbite-react'

export interface TooltipProps extends FlowbiteTooltipProps {
  fullSized?: boolean
}

export const Tooltip = (props: TooltipProps) => {
  const { fullSized, ...rest } = props

  return (
    <FlowbiteTooltip
      theme={{
        target: `${fullSized ? 'w-full' : 'w-fit'}`,
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
