import {
  Abi,
  Address,
  encodeFunctionData,
  FeeValuesEIP1559,
  PublicClient,
  serializeTransaction
} from 'viem'
import { opGasOracleABI } from '../abis/opGasOracle'
import { DOLPHIN_ADDRESS, OP_GAS_ORACLE_ADDRESS } from '../constants'
import { isOpStack } from './networks'

// TODO: add arbitrum logic for accurately calculating L1 + L2 fees
/**
 * Returns an estimated gas fee (in wei) for a given contract transaction
 * @dev if your transaction is expected to fail, manually pass in a `gasAmount`
 * @param publicClient a public Viem client to query through
 * @param tx the transaction to estimate gas fees for
 * @param options optional settings
 * @returns
 */
export const getGasFeeEstimate = async (
  publicClient: PublicClient,
  tx: { address: Address; abi: Abi; functionName: string; args?: any[]; account?: Address },
  options?: { gasAmount?: bigint }
) => {
  const chainId = await publicClient.getChainId()

  const gasPrices = (await publicClient.estimateFeesPerGas()) as FeeValuesEIP1559
  const gasPrice = gasPrices.maxFeePerGas + gasPrices.maxPriorityFeePerGas

  const formattedTxData = {
    to: tx.address,
    data: encodeFunctionData({ abi: tx.abi, functionName: tx.functionName, args: tx.args }),
    account: tx.account ?? DOLPHIN_ADDRESS,
    ...gasPrices
  }

  const gasAmount = options?.gasAmount ?? (await publicClient.estimateGas(formattedTxData))

  if (isOpStack(chainId)) {
    const l1GasFee = await publicClient.readContract({
      address: OP_GAS_ORACLE_ADDRESS,
      abi: opGasOracleABI,
      functionName: 'getL1Fee',
      args: [
        serializeTransaction({
          chainId,
          ...formattedTxData,
          gas: gasAmount
        })
      ]
    })

    return gasAmount * gasPrice + l1GasFee
  } else {
    return gasAmount * gasPrice
  }
}
