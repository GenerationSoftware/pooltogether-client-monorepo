import {
  Address,
  createPublicClient,
  decodeEventLog,
  erc20Abi,
  formatUnits,
  http,
  isHash
} from 'viem'
import { KV_KEYS, NETWORKS, RPC_URLS, VAULT_ABI, VIEM_CHAINS } from './constants'
import { getTokenPrices } from './prices'
import { AddDepositData, Deposit, Network } from './types'

export const getWalletData = async (walletId: string) => {
  const _deposits = await DEPOSITS.get(walletId)
  const deposits = !!_deposits ? (JSON.parse(_deposits) as Deposit[]) : []

  const users = new Set<Lowercase<Address>>()
  const depositValues: number[] = []
  let sumDepositValues = 0

  deposits.forEach(({ user, ethValue }) => {
    users.add(user.toLowerCase() as Lowercase<Address>)

    if (!!ethValue) {
      depositValues.push(ethValue)
      sumDepositValues += ethValue
    }
  })

  const avgDepositValue = depositValues.length > 0 ? sumDepositValues / depositValues.length : 0

  const sortedDepositValues = [...depositValues].sort((a, b) => a - b)
  const middleIndex = Math.floor(sortedDepositValues.length / 2)
  const medianDepositValue =
    sortedDepositValues.length > 0
      ? sortedDepositValues.length % 2
        ? sortedDepositValues[middleIndex]
        : (sortedDepositValues[middleIndex - 1] + sortedDepositValues[middleIndex]) / 2
      : 0

  return {
    numDeposits: deposits.length,
    avgDepositValue,
    medianDepositValue,
    numUsers: users.size,
    users: [...users]
  }
}

export const getAllWalletData = async () => {
  const _walletIds = await DEPOSITS.get(KV_KEYS.walletIds)
  const walletIds = !!_walletIds ? (JSON.parse(_walletIds) as string[]) : []

  const users = new Set<Lowercase<Address>>()
  const depositValues: number[] = []
  let numDeposits = 0
  let sumDepositValues = 0

  await Promise.allSettled(
    walletIds.map((walletId) =>
      (async () => {
        const _deposits = await DEPOSITS.get(walletId)
        const deposits = !!_deposits ? (JSON.parse(_deposits) as Deposit[]) : []

        deposits.forEach(({ user, ethValue }) => {
          users.add(user.toLowerCase() as Lowercase<Address>)

          if (!!ethValue) {
            depositValues.push(ethValue)
            sumDepositValues += ethValue
          }

          numDeposits++
        })
      })()
    )
  )

  const avgDepositValue = depositValues.length > 0 ? sumDepositValues / depositValues.length : 0

  const sortedDepositValues = [...depositValues].sort((a, b) => a - b)
  const middleIndex = Math.floor(sortedDepositValues.length / 2)
  const medianDepositValue =
    sortedDepositValues.length > 0
      ? sortedDepositValues.length % 2
        ? sortedDepositValues[middleIndex]
        : (sortedDepositValues[middleIndex - 1] + sortedDepositValues[middleIndex]) / 2
      : 0

  return {
    walletIds,
    numDeposits,
    avgDepositValue,
    medianDepositValue,
    numUsers: users.size
  }
}

export const getRequestBody = async (req: Request): Promise<Partial<AddDepositData>> => {
  const contentType = req.headers.get('content-type')

  if (!contentType?.includes('application/json')) return {}

  return await req.json()
}

export const getExistingTxHashes = async () => {
  const _walletIds = await DEPOSITS.get(KV_KEYS.walletIds)
  const walletIds = !!_walletIds ? (JSON.parse(_walletIds) as string[]) : []

  const txHashes = new Set<Lowercase<`0x${string}`>>()

  await Promise.allSettled(
    walletIds.map((walletId) =>
      (async () => {
        const _deposits = await DEPOSITS.get(walletId)
        const deposits = !!_deposits ? (JSON.parse(_deposits) as Deposit[]) : []

        deposits.forEach(({ txHash }) => {
          txHashes.add(txHash.toLowerCase() as Lowercase<`0x${string}`>)
        })
      })()
    )
  )

  return txHashes
}

export const isValidDepositData = (
  depositData: Partial<AddDepositData>
): depositData is AddDepositData => {
  return (
    !!depositData.chainId &&
    NETWORKS.includes(depositData.chainId as Network) &&
    !!depositData.txHash &&
    isHash(depositData.txHash) &&
    !!depositData.walletId
  )
}

export const getDeposit = async ({ chainId, txHash, walletId }: AddDepositData) => {
  const publicClient = createPublicClient({
    chain: VIEM_CHAINS[chainId],
    transport: http(RPC_URLS[chainId])
  })

  let txReceipt = await publicClient.getTransactionReceipt({ hash: txHash })

  if (!txReceipt) {
    await new Promise(() =>
      setTimeout(async () => {
        txReceipt = await publicClient.getTransactionReceipt({ hash: txHash })
      }, 30 * 1_000)
    )
  }

  if (!!txReceipt && txReceipt.status === 'success') {
    const txLogs = txReceipt.logs.toReversed()

    for (let i = 0; i < txLogs.length; i++) {
      try {
        const { data, topics, address } = txLogs[i]

        const { args: eventArgs } = decodeEventLog({
          abi: VAULT_ABI,
          eventName: 'Deposit',
          data,
          topics
        })

        if (!!eventArgs) {
          const tokenAddress = await publicClient.readContract({
            address,
            abi: VAULT_ABI,
            functionName: 'asset'
          })

          if (!!tokenAddress) {
            const deposit: Deposit = {
              user: eventArgs.owner,
              vault: address,
              walletId: walletId,
              chainId: chainId,
              txHash: txHash
            }

            const tokenPrices = await getTokenPrices(chainId, [tokenAddress])
            const tokenPrice = tokenPrices[tokenAddress.toLowerCase() as Lowercase<Address>]

            if (!!tokenPrice) {
              const tokenDecimals = await publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'decimals'
              })

              deposit.ethValue =
                parseFloat(formatUnits(eventArgs.assets, tokenDecimals)) * tokenPrice
            }

            return deposit
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
