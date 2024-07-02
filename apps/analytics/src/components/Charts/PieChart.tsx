import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from 'recharts'

const DEFAULT: {
  slice: { fills: string[] }
  animate: boolean
  label: { hideUnderPercent: number }
} = {
  slice: { fills: ['#1C64F2', '#1cb5f2', '#dd1cf2', '#f21c3c', '#1cf283', '#f2ee1c', '#f2951c'] },
  animate: false,
  label: { hideUnderPercent: 2.5 }
}

export interface PieChartProps {
  data: any[]
  slices?: { id: string | number; fill?: string }[]
  radius?: { inner?: string | number; outer?: string | number }
  paddingAngle?: number
  animate?: boolean
  label?: {
    show?: boolean
    nameFormatter?: (name: string) => string
    center?: boolean
    hideUnderPercent?: number
  }
  className?: string
}

export const PieChart = (props: PieChartProps) => {
  const { data, slices, radius, paddingAngle, animate, label, className } = props

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
            label={
              label
                ? ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    if (percent * 100 < (label.hideUnderPercent ?? DEFAULT.label.hideUnderPercent))
                      return <></>

                    const radius = label.center
                      ? innerRadius + (outerRadius - innerRadius) * 0.5
                      : 25 + innerRadius + (outerRadius - innerRadius)
                    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
                    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

                    const rawName = data[index].name
                    const name = !!label.nameFormatter ? label.nameFormatter(rawName) : rawName
                    const percentage = `${(percent * 100).toFixed(1)}%`

                    return (
                      <text x={x} y={y} fill='white' textAnchor='middle' dominantBaseline='middle'>
                        {name} ({percentage})
                      </text>
                    )
                  }
                : undefined
            }
            labelLine={label?.center ? false : undefined}
          >
            {data.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill={slices?.[i]?.fill ?? DEFAULT.slice.fills[i % DEFAULT.slice.fills.length]}
                style={{ outline: 'none' }}
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
