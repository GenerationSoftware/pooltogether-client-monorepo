import { KV_KEYS } from './constants'

export const fetchStats = async () => {
  try {
    const { value: cachedProtocolStats } = await PROTOCOL_STATS.getWithMetadata(KV_KEYS.stats)
    return cachedProtocolStats
  } catch (e) {
    return null
  }
}
