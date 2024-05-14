import { KV_KEYS } from './constants'
import { Deposit } from './types'

export const updateHandler = async (event: FetchEvent, newDeposit: Deposit) => {
  const updateDate = new Date(Date.now()).toUTCString()

  const _walletIds = await DEPOSITS.get(KV_KEYS.walletIds)
  const _deposits = await DEPOSITS.get(newDeposit.walletId)

  const walletIds = !!_walletIds ? (JSON.parse(_walletIds) as string[]) : []
  const deposits = !!_deposits ? (JSON.parse(_deposits) as Deposit[]) : []

  if (!walletIds.includes(newDeposit.walletId)) {
    event.waitUntil(
      DEPOSITS.put(KV_KEYS.walletIds, JSON.stringify([...walletIds, newDeposit.walletId]), {
        metadata: { lastUpdated: updateDate }
      })
    )
  }

  if (!!deposits) {
    event.waitUntil(
      DEPOSITS.put(newDeposit.walletId, JSON.stringify([...deposits, newDeposit]), {
        metadata: { lastUpdated: updateDate }
      })
    )
  }
}
