import { useScreenSize } from '@shared/generic-react-hooks'
import { ReactNode } from 'react'
import {
  Line,
  LineChart as RechartsLineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { LineDot } from 'recharts/types/cartesian/Line'
import { ImplicitLabelType } from 'recharts/types/component/Label'
import { ContentType } from 'recharts/types/component/Tooltip'
import { CurveType } from 'recharts/types/shape/Curve'
import { AxisDomain, AxisInterval } from 'recharts/types/util/types'

const DEFAULT: {
  aspect: number
  line: { type: CurveType; strokes: string[]; strokeWidth: number; dot: LineDot; animate: boolean }
  refLine: { stroke: string; strokeWidth: number }
  xAxis: { stroke: string }
  yAxis: { stroke: string }
  margin: { left: number; mobileLeft: number }
} = {
  aspect: 2.8,
  line: {
    type: 'monotone',
    strokes: ['#1C64F2', '#1cb5f2', '#dd1cf2', '#f21c3c', '#1cf283', '#f2ee1c', '#f2951c'],
    strokeWidth: 1.8,
    dot: false,
    animate: false
  },
  refLine: {
    stroke: '#218C2F',
    strokeWidth: 1
  },
  xAxis: { stroke: '#8c63cf' },
  yAxis: { stroke: '#8c63cf' },
  margin: { left: 5, mobileLeft: -12 }
}

export interface LineChartProps {
  data: any[]
  lines: {
    id: string | number
    type?: CurveType
    stroke?: string
    strokeWidth?: number
    strokeDashArray?: string | number
    dot?: LineDot
    animate?: boolean
  }[]
  refLines?: {
    id: string | number
    x?: string | number
    y?: string | number
    label?: ImplicitLabelType
    stroke?: string
    strokeWidth?: number
    strokeDashArray?: string | number
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

export const LineChart = (props: LineChartProps) => {
  const { data, lines, refLines, aspect, xAxis, yAxis, tooltip, margin, className } = props

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
        {lines.map((line, i) => (
          <Line
            key={`line-${line.id}`}
            type={line.type ?? DEFAULT.line.type}
            dataKey={line.id}
            stroke={line.stroke ?? DEFAULT.line.strokes[i % DEFAULT.line.strokes.length]}
            strokeWidth={line.strokeWidth ?? DEFAULT.line.strokeWidth}
            strokeDasharray={line.strokeDashArray}
            dot={line.dot ?? DEFAULT.line.dot}
            isAnimationActive={line.animate ?? DEFAULT.line.animate}
          />
        ))}
        {refLines?.map((refLine) => (
          <ReferenceLine
            key={`refLine-${refLine.id}`}
            x={refLine.x}
            y={refLine.y}
            label={refLine.label}
            stroke={refLine.stroke ?? DEFAULT.refLine.stroke}
            strokeWidth={refLine.strokeWidth ?? DEFAULT.refLine.strokeWidth}
            strokeDasharray={refLine.strokeDashArray}
          />
        ))}
        {tooltip?.show && (
          <Tooltip
            content={tooltip.content}
            formatter={tooltip.formatter}
            labelFormatter={tooltip.labelFormatter}
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
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
