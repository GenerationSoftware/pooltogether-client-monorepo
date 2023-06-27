import { KV_KEYS } from './constants'
import { PoolExplorerApiHistory, PoolExplorerApiStats, ProtocolStats } from './types'

export const updateHandler = async (
  event: FetchEvent | ScheduledEvent,
  basicStats?: PoolExplorerApiStats,
  prizeHistory?: PoolExplorerApiHistory[]
) => {
  if (!basicStats || !prizeHistory) {
    return { message: 'No stats updated.', basicStats, prizeHistory }
  }

  const protocolStats: ProtocolStats = {
    uniqueWallets: basicStats.totalPlayers,
    poolPrice: basicStats.pool,
    tvl: basicStats.tvl.total,
    uniqueWinners: basicStats.historicalWinners,
    totalPrizes: prizeHistory.reduce((a, b) => a + parseInt(b.c), 0)
  }

  const stringifiedProtocolStats = JSON.stringify(protocolStats)

  event.waitUntil(
    PROTOCOL_STATS.put(KV_KEYS.stats, stringifiedProtocolStats, {
      metadata: {
        lastUpdated: new Date(Date.now()).toUTCString()
      }
    })
  )

  return protocolStats
}
