import { useScreenSize } from '@shared/generic-react-hooks'
import { CSSProperties, ReactNode } from 'react'
import {
  Area,
  Legend,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { AreaDot } from 'recharts/types/cartesian/Area'
import { ContentType } from 'recharts/types/component/Tooltip'
import { CurveType } from 'recharts/types/shape/Curve'
import { AxisDomain, AxisInterval, StackOffsetType } from 'recharts/types/util/types'

const DEFAULT: {
  aspect: number
  area: {
    type: CurveType
    strokes: string[]
    strokeWidth: number
    dot: AreaDot
    animate: boolean
  }
  xAxis: { stroke: string }
  yAxis: { stroke: string }
  margin: { left: number; mobileLeft: number }
  gradients: boolean
} = {
  aspect: 2.8,
  area: {
    type: 'monotone',
    strokes: ['#1C64F2', '#1cb5f2', '#dd1cf2', '#f21c3c', '#1cf283', '#f2ee1c', '#f2951c'],
    strokeWidth: 1.8,
    dot: false,
    animate: false
  },
  xAxis: { stroke: '#9CA3AF' },
  yAxis: { stroke: '#9CA3AF' },
  margin: { left: 5, mobileLeft: -12 },
  gradients: true
}

export interface AreaChartProps {
  data: any[]
  areas: {
    id: string | number
    type?: CurveType
    stroke?: string
    strokeWidth?: number
    dot?: AreaDot
    animate?: boolean
    stackId?: string | number
    opacity?: number
  }[]
  aspect?: number
  xAxis?: {
    type?: 'number' | 'category'
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
    sort?: 'asc' | 'desc'
    labelClassName?: string
    itemStyle?: CSSProperties
  }
  margin?: { left: number; mobileLeft: number }
  legend?: { show?: boolean; formatter: (value: string | number) => ReactNode }
  stackOffset?: StackOffsetType
  gradients?: boolean
  className?: string
}

export const AreaChart = (props: AreaChartProps) => {
  const {
    data,
    areas,
    aspect,
    xAxis,
    yAxis,
    tooltip,
    margin,
    legend,
    stackOffset,
    gradients,
    className
  } = props

  const { isMobile } = useScreenSize()

  return (
    <ResponsiveContainer width='100%' aspect={aspect ?? DEFAULT.aspect} className={className}>
      <RechartsAreaChart
        data={data}
        margin={{
          left: isMobile
            ? margin?.mobileLeft ?? DEFAULT.margin.mobileLeft
            : margin?.left ?? DEFAULT.margin.left
        }}
        stackOffset={stackOffset}
      >
        {areas.map((area, i) => (
          <Area
            key={`area-${area.id}`}
            type={area.type ?? DEFAULT.area.type}
            dataKey={area.id}
            stroke={area.stroke ?? DEFAULT.area.strokes[i % DEFAULT.area.strokes.length]}
            fill={
              gradients ?? DEFAULT.gradients
                ? `url(#${getGradientFillId(area.id)})`
                : area.stroke ?? DEFAULT.area.strokes[i % DEFAULT.area.strokes.length]
            }
            strokeWidth={area.strokeWidth ?? DEFAULT.area.strokeWidth}
            dot={area.dot ?? DEFAULT.area.dot}
            isAnimationActive={area.animate ?? DEFAULT.area.animate}
            stackId={area.stackId}
            opacity={area.opacity}
          />
        ))}
        {tooltip?.show && (
          <Tooltip
            content={tooltip.content}
            formatter={tooltip.formatter}
            labelFormatter={tooltip.labelFormatter}
            itemSorter={
              !!tooltip.sort
                ? (item) => (item.value as number) * (tooltip.sort === 'desc' ? -1 : 1)
                : undefined
            }
            labelClassName={tooltip.labelClassName}
            itemStyle={tooltip.itemStyle}
          />
        )}
        <XAxis
          dataKey='name'
          type={xAxis?.type}
          domain={xAxis?.domain}
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
        {legend?.show && <Legend formatter={legend.formatter} />}
        {(gradients ?? DEFAULT.gradients) && (
          <defs>
            {areas.map((area, i) => (
              <linearGradient
                key={getGradientFillId(area.id)}
                id={getGradientFillId(area.id)}
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='5%'
                  stopColor={
                    area.stroke ??
                    area.stroke ??
                    DEFAULT.area.strokes[i % DEFAULT.area.strokes.length]
                  }
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor={
                    area.stroke ??
                    area.stroke ??
                    DEFAULT.area.strokes[i % DEFAULT.area.strokes.length]
                  }
                  stopOpacity={0.2}
                />
              </linearGradient>
            ))}
          </defs>
        )}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

const getGradientFillId = (id: string | number) => {
  return `color${String(id)}`
}
