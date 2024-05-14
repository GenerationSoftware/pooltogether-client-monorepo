import { createPublicClient, http, isHash } from 'viem'
import { KV_KEYS, NETWORKS, RPC_URLS, VIEM_CHAINS } from './constants'
import { AddDepositData, Deposit, Network } from './types'

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

export const getRequestBody = async (req: Request): Promise<Partial<AddDepositData>> => {
  const contentType = req.headers.get('content-type')

  if (!contentType?.includes('application/json')) return {}

  return await req.json()
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

export const getDeposit = async (depositData: AddDepositData) => {
  const publicClient = createPublicClient({
    chain: VIEM_CHAINS[depositData.chainId],
    transport: http(RPC_URLS[depositData.chainId])
  })

  let txReceipt = await publicClient.getTransactionReceipt({ hash: depositData.txHash })

  if (!txReceipt) {
    await new Promise(() =>
      setTimeout(async () => {
        txReceipt = await publicClient.getTransactionReceipt({ hash: depositData.txHash })
      }, 30 * 1_000)
    )
  }

  if (!!txReceipt && txReceipt.status === 'success') {
    // TODO: check that events includes deposit
    // TODO: get user address from recipient there
  }
}

// {
//   anonymous: false,
//   inputs: [
//     { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
//     { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
//     { indexed: false, internalType: 'uint256', name: 'assets', type: 'uint256' },
//     { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' }
//   ],
//   name: 'Deposit',
//   type: 'event'
// }
