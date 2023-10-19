import { calculatePercentageOfBigInt } from '@shared/utilities'
import { FallbackTransport, hexToBigInt, PublicClient, TransactionReceipt } from 'viem'
import { Chain, Config, configureChains, createConfig, WebSocketPublicClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { RPC_URLS, SUPPORTED_NETWORKS, WAGMI_CHAINS } from '@constants/config'

/**
 * Returns a Wagmi config with the given networks and RPCs
 * @returns
 */
export const createCustomWagmiConfig = (): Config<
  PublicClient<FallbackTransport, Chain>,
  WebSocketPublicClient
> => {
  const networks = [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]

  const supportedNetworks = Object.values(WAGMI_CHAINS).filter(
    (chain) => networks.includes(chain.id) && !!RPC_URLS[chain.id]
  )

  const { publicClient } = configureChains(supportedNetworks, [
    jsonRpcProvider({
      rpc: (chain) => ({ http: RPC_URLS[chain.id as keyof typeof WAGMI_CHAINS] as string })
    }),
    publicProvider()
  ])

  return createConfig({ publicClient })
}

/**
 * Returns the amount spent on gas for a given transaction
 * @param txReceipt the transaction's receipt
 * @returns
 */
export const getTxGasSpent = (txReceipt: TransactionReceipt) => {
  if (isL2TransactionReceipt(txReceipt)) {
    const l1Gas = calculatePercentageOfBigInt(
      hexToBigInt(txReceipt.l1GasUsed) * hexToBigInt(txReceipt.l1GasPrice),
      parseFloat(txReceipt.l1FeeScalar)
    )
    const l2Gas = txReceipt.gasUsed * txReceipt.effectiveGasPrice
    return l1Gas + l2Gas
  } else {
    return txReceipt.gasUsed * txReceipt.effectiveGasPrice
  }
}

interface L2TransactionReceipt extends TransactionReceipt {
  l1GasUsed: `0x${string}`
  l1GasPrice: `0x${string}`
  l1FeeScalar: string
}

const isL2TransactionReceipt = (
  txReceipt: TransactionReceipt
): txReceipt is L2TransactionReceipt => {
  let receipt = txReceipt as L2TransactionReceipt
  return !!receipt.l1GasUsed && !!receipt.l1GasPrice && !!receipt.l1FeeScalar
}
