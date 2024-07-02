import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from 'recharts'

const DEFAULT: {
  slice: { fills: string[] }
  animate: boolean
} = {
  slice: { fills: ['#1C64F2', '#1cb5f2', '#dd1cf2', '#f21c3c', '#1cf283', '#f2ee1c', '#f2951c'] },
  animate: false
}

export interface PieChartProps {
  data: any[]
  slices?: { id: string | number; fill?: string }[]
  radius?: { inner?: string | number; outer?: string | number }
  paddingAngle?: number
  animate?: boolean
  className?: string
}

export const PieChart = (props: PieChartProps) => {
  const { data, slices, radius, paddingAngle, animate, className } = props

  const dataKey = Object.keys(data[0] ?? {})[1]

  return (
    <ResponsiveContainer width='100%' aspect={1} className={className}>
      {!!dataKey ? (
        <RechartsPieChart>
          <Pie
            data={data}
            innerRadius={radius?.inner}
            outerRadius={radius?.outer}
            paddingAngle={paddingAngle}
            dataKey={dataKey}
            isAnimationActive={animate ?? DEFAULT.animate}
          >
            {data.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill={slices?.[i]?.fill ?? DEFAULT.slice.fills[i % DEFAULT.slice.fills.length]}
              />
            ))}
          </Pie>
        </RechartsPieChart>
      ) : (
        <></>
      )}
    </ResponsiveContainer>
  )
}
