import { ProtocolStats } from './types'

export const getV4Stats = async (): Promise<ProtocolStats> => {
  // TODO

  return { current: { users: 0, tvl: { eth: 0, usd: 0 } }, awarded: { eth: 0, usd: 0 } }
}
