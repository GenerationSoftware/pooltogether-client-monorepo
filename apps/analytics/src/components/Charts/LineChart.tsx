import { useScreenSize } from '@shared/generic-react-hooks'
import { ReactNode } from 'react'
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { LineDot } from 'recharts/types/cartesian/Line'
import { CurveType } from 'recharts/types/shape/Curve'
import { AxisDomain, AxisInterval } from 'recharts/types/util/types'

const DEFAULT: {
  aspect: number
  line: { type: CurveType; stroke: string; strokeWidth: number; dot: LineDot; animate: boolean }
  xAxis: { stroke: string }
  yAxis: { stroke: string }
  margin: { left: number; mobileLeft: number }
} = {
  aspect: 2.8,
  line: { type: 'monotone', stroke: '#1C64F2', strokeWidth: 1.8, dot: false, animate: false },
  xAxis: { stroke: '#9CA3AF' },
  yAxis: { stroke: '#9CA3AF' },
  margin: { left: 5, mobileLeft: -12 }
}

interface LineChartProps {
  data: any[]
  lines: {
    id: string
    type?: CurveType
    stroke?: string
    strokeWidth?: number
    dot?: LineDot
    animate?: boolean
  }[]
  aspect?: number
  xAxis?: {
    type?: 'number' | 'category'
    domain?: AxisDomain
    stroke?: string
    interval?: AxisInterval
  }
  yAxis?: {
    type?: 'number' | 'category'
    domain?: AxisDomain
    stroke?: string
    tickFormatter?: (tick: string) => string
  }
  tooltip?: {
    show?: boolean
    formatter?: (value: number, name: string) => ReactNode | ReactNode[]
    labelFormatter?: (label: string) => ReactNode
  }
  margin?: { left: number; mobileLeft: number }
  className?: string
}

export const LineChart = (props: LineChartProps) => {
  const { data, lines, aspect, xAxis, yAxis, tooltip, margin, className } = props

  const { isMobile } = useScreenSize()

  return (
    <ResponsiveContainer width='100%' aspect={aspect ?? DEFAULT.aspect} className={className}>
      <RechartsLineChart
        data={data}
        margin={{
          left: isMobile
            ? margin?.mobileLeft ?? DEFAULT.margin.mobileLeft
            : margin?.left ?? DEFAULT.margin.left
        }}
      >
        {lines.map((line) => (
          <Line
            key={`line-${line.id}`}
            type={line.type ?? DEFAULT.line.type}
            dataKey={line.id}
            stroke={line.stroke ?? DEFAULT.line.stroke}
            strokeWidth={line.strokeWidth ?? DEFAULT.line.strokeWidth}
            dot={line.dot ?? DEFAULT.line.dot}
            isAnimationActive={line.animate ?? DEFAULT.line.animate}
          />
        ))}
        {tooltip?.show && (
          <Tooltip formatter={tooltip.formatter} labelFormatter={tooltip.labelFormatter} />
        )}
        <XAxis
          dataKey='name'
          type={xAxis?.type}
          domain={xAxis?.domain}
          stroke={xAxis?.stroke ?? DEFAULT.xAxis.stroke}
          interval={xAxis?.interval}
        />
        <YAxis
          type={yAxis?.type}
          domain={yAxis?.domain}
          stroke={yAxis?.stroke ?? DEFAULT.yAxis.stroke}
          tickFormatter={yAxis?.tickFormatter}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
