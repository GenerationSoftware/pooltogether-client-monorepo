import {
  useGasAmountEstimate,
  useGasCostEstimates
} from '@generationsoftware/hyperstructure-react-hooks'
import { GasCostEstimates } from '@shared/types'
import { sToMs, vaultABI } from '@shared/utilities'
import { Address } from 'viem'
import { V5BalanceToMigrate } from './useUserV5Balances'

export const useV5WithdrawGasEstimate = (
  userAddress: Address,
  migration: V5BalanceToMigrate
): { data?: GasCostEstimates; isFetched: boolean } => {
  const { data: gasAmount, isFetched: isFetchedGasAmount } = useGasAmountEstimate(
    migration?.token.chainId,
    {
      address: migration?.token.address,
      abi: vaultABI,
      functionName: 'redeem',
      args: [migration?.token.amount, userAddress, userAddress],
      account: userAddress
    },
    { enabled: !!userAddress && !!migration }
  )

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    migration?.token.chainId,
    gasAmount as bigint,
    {
      tx: {
        abi: vaultABI,
        functionName: 'redeem',
        args: [migration?.token.amount, userAddress, userAddress]
      },
      refetchInterval: sToMs(10)
    }
  )

  const isFetched = isFetchedGasAmount && isFetchedGasEstimates

  return { data: gasEstimates, isFetched }
}
