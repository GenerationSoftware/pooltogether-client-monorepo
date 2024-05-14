import { KV_KEYS } from './constants'
import { Deposit } from './types'

export const getWalletData = async (walletId: string) => {
  const _deposits = await DEPOSITS.get(walletId)
  const deposits = !!_deposits ? (JSON.parse(_deposits) as Deposit[]) : []

  // TODO: convert deposits into useful stats
  // TODO: users, user count, deposit count, avg deposit amount

  return {}
}

export const getAllWalletData = async () => {
  const _walletIds = await DEPOSITS.get(KV_KEYS.walletIds)
  const walletIds = !!_walletIds ? (JSON.parse(_walletIds) as string[]) : []

  // TODO: query and aggregate all wallet data into useful stats
  // TODO: users, user count, deposit count, avg deposit amount, walletIds

  return {}
}

export const getRequestBody = async (req: Request): Promise<Partial<Deposit>> => {
  const contentType = req.headers.get('content-type')

  if (!contentType?.includes('application/json')) return {}

  return await req.json()
}

export const isValidDeposit = (deposit: Partial<Deposit>): deposit is Deposit => {
  return (
    !!deposit.user && !!deposit.vault && !!deposit.wallet && !!deposit.chainId && !!deposit.ethValue
  )
}
