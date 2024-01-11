import { LiFiWidget, WidgetProps } from '@lifi/widget'

export interface SwapWidgetProps extends Omit<WidgetProps, 'integrator'> {
  className?: string
}

// NOTE: This component needs to be imported dynamically
export const SwapWidget = (props: SwapWidgetProps) => {
  const { className, ...rest } = props

  return (
    <div className={className}>
      <LiFiWidget integrator='Cabana' {...rest} />
    </div>
  )
}
