import { KV_KEYS } from './constants'
import { ProtocolStats } from './types'

export const updateHandler = async (
  event: FetchEvent | ScheduledEvent,
  v3Stats?: ProtocolStats,
  v4Stats?: ProtocolStats,
  v5Stats?: ProtocolStats
) => {
  const updateDate = new Date(Date.now()).toUTCString()

  if (!!v3Stats) {
    event.waitUntil(
      PROTOCOL_STATS.put(KV_KEYS.v3_stats, JSON.stringify(v3Stats), {
        metadata: { lastUpdated: updateDate }
      })
    )
  }

  if (!!v4Stats) {
    event.waitUntil(
      PROTOCOL_STATS.put(KV_KEYS.v4_stats, JSON.stringify(v4Stats), {
        metadata: { lastUpdated: updateDate }
      })
    )
  }

  if (!!v5Stats) {
    event.waitUntil(
      PROTOCOL_STATS.put(KV_KEYS.v5_stats, JSON.stringify(v5Stats), {
        metadata: { lastUpdated: updateDate }
      })
    )
  }

  return { v3: v3Stats, v4: v4Stats, v5: v5Stats }
}
