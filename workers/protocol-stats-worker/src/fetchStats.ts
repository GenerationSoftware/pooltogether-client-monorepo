import { KV_KEYS } from './constants'
import { AggregatedProtocolStats, ProtocolStats } from './types'

export const fetchStats = async () => {
  try {
    const { value: _v3 } = await PROTOCOL_STATS.getWithMetadata(KV_KEYS.v3_stats)
    const { value: _v4 } = await PROTOCOL_STATS.getWithMetadata(KV_KEYS.v4_stats)
    const { value: _v5 } = await PROTOCOL_STATS.getWithMetadata(KV_KEYS.v5_stats)

    const v3 = !!_v3 ? (JSON.parse(_v3) as ProtocolStats) : undefined
    const v4 = !!_v4 ? (JSON.parse(_v4) as ProtocolStats) : undefined
    const v5 = !!_v5 ? (JSON.parse(_v5) as ProtocolStats) : undefined

    const total = getTotalProtocolStats(v3, v4, v5)

    const aggregatedProtocolStats: AggregatedProtocolStats = { total, v3, v4, v5 }

    return JSON.stringify(aggregatedProtocolStats)
  } catch (e) {
    return null
  }
}

const getTotalProtocolStats = (...stats: (ProtocolStats | undefined)[]) => {
  let totalCurrentUsers = 0
  let totalCurrentTvl = 0
  let totalAwarded = 0

  stats.forEach((version) => {
    if (!!version) {
      totalCurrentUsers += version.current.users
      totalCurrentTvl += version.current.tvl
      totalAwarded += version.awarded
    }
  })

  const total: ProtocolStats = {
    current: { users: totalCurrentUsers, tvl: totalCurrentTvl },
    awarded: totalAwarded
  }

  return total
}
