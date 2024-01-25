export type AggregatedProtocolStats = {
  total: ProtocolStats
  v3?: ProtocolStats
  v4?: ProtocolStats
  v5?: ProtocolStats
}

export interface ProtocolStats {
  current: { users: number; tvl: number }
  awarded: number
}
