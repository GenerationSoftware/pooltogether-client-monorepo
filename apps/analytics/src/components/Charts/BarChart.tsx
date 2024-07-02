import { useScreenSize } from '@shared/generic-react-hooks'
import { ReactNode } from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { ContentType } from 'recharts/types/component/Tooltip'
import { AxisDomain, AxisInterval } from 'recharts/types/util/types'

const DEFAULT: {
  bar: { fill: string; animate: boolean }
  aspect: number
  xAxis: { stroke: string }
  yAxis: { stroke: string }
  margin: { left: number; mobileLeft: number }
} = {
  bar: { fill: '#6538C1', animate: false },
  aspect: 2.8,
  xAxis: { stroke: '#8c63cf' },
  yAxis: { stroke: '#8c63cf' },
  margin: { left: 5, mobileLeft: -12 }
}

export interface BarChartProps {
  data: any[]
  bars: {
    id: string | number
    fill?: string
    stackId?: string | number
    animate?: boolean
  }[]
  aspect?: number
  xAxis?: {
    type?: 'number' | 'category'
    ticks?: (string | number)[]
    domain?: AxisDomain
    stroke?: string
    interval?: AxisInterval
    minTickGap?: number
    tickFormatter?: (tick: string | number) => string
  }
  yAxis?: {
    type?: 'number' | 'category'
    domain?: AxisDomain
    stroke?: string
    tickFormatter?: (tick: string | number) => string
  }
  tooltip?: {
    show?: boolean
    content?: ContentType<number, string | number>
    formatter?: (value: number, name: string | number) => ReactNode | ReactNode[]
    labelFormatter?: (label: string) => ReactNode
  }
  margin?: { left: number; mobileLeft: number }
  className?: string
}

export const BarChart = (props: BarChartProps) => {
  const { data, bars, aspect, xAxis, yAxis, tooltip, margin, className } = props

  const { isMobile } = useScreenSize()

  return (
    <ResponsiveContainer width='100%' aspect={aspect ?? DEFAULT.aspect} className={className}>
      <RechartsBarChart
        data={data}
        margin={{
          left: isMobile
            ? margin?.mobileLeft ?? DEFAULT.margin.mobileLeft
            : margin?.left ?? DEFAULT.margin.left
        }}
      >
        {bars.map((bar) => (
          <Bar
            key={`bar-${bar.id}`}
            dataKey={bar.id}
            fill={bar.fill ?? DEFAULT.bar.fill}
            isAnimationActive={bar.animate ?? DEFAULT.bar.animate}
          />
        ))}
        {tooltip?.show && (
          <Tooltip
            content={tooltip.content}
            formatter={tooltip.formatter}
            labelFormatter={tooltip.labelFormatter}
            cursor={{ fillOpacity: 0.1 }}
          />
        )}
        <XAxis
          dataKey='name'
          type={xAxis?.type}
          domain={xAxis?.domain}
          ticks={xAxis?.ticks}
          stroke={xAxis?.stroke ?? DEFAULT.xAxis.stroke}
          interval={xAxis?.interval}
          minTickGap={xAxis?.minTickGap}
          tickFormatter={xAxis?.tickFormatter}
        />
        <YAxis
          type={yAxis?.type}
          domain={yAxis?.domain}
          stroke={yAxis?.stroke ?? DEFAULT.yAxis.stroke}
          tickFormatter={yAxis?.tickFormatter}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
