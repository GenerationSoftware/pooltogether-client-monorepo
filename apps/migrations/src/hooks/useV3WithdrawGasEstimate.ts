import {
  useGasAmountEstimate,
  useGasCostEstimates
} from '@generationsoftware/hyperstructure-react-hooks'
import { GasCostEstimates } from '@shared/types'
import { sToMs } from '@shared/utilities'
import { Address } from 'viem'
import { v3PodABI } from '@constants/v3PodABI'
import { v3PoolABI } from '@constants/v3PoolABI'
import { V3BalanceToMigrate } from './useUserV3Balances'

export const useV3WithdrawGasEstimate = (
  userAddress: Address,
  migration: V3BalanceToMigrate
): { data?: GasCostEstimates; isFetched: boolean } => {
  const { data: poolGasAmount, isFetched: isFetchedPoolGasAmount } = useGasAmountEstimate(
    migration?.token.chainId,
    {
      address: migration?.contractAddress,
      abi: v3PoolABI,
      functionName: 'withdrawInstantlyFrom',
      args: [userAddress, migration?.token.amount, migration?.token.address, 0n],
      account: userAddress
    },
    { enabled: !!userAddress && migration?.type === 'pool' }
  )

  const { data: podGasAmount, isFetched: isFetchedPodGasAmount } = useGasAmountEstimate(
    migration?.token.chainId,
    {
      address: migration?.contractAddress,
      abi: v3PodABI,
      functionName: 'withdraw',
      args: [migration?.token.amount, 0n],
      account: userAddress
    },
    { enabled: !!userAddress && migration?.type === 'pod' }
  )

  const gasAmount = migration?.type === 'pool' ? poolGasAmount : podGasAmount

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    migration?.token.chainId,
    gasAmount as bigint,
    {
      tx: {
        abi: migration?.type === 'pool' ? v3PoolABI : v3PodABI,
        functionName: migration.type === 'pool' ? 'withdrawInstantlyFrom' : 'withdraw',
        args:
          migration?.type === 'pool'
            ? [userAddress, migration?.token.amount, migration?.token.address, 0n]
            : [migration?.token.amount, 0n]
      },
      refetchInterval: sToMs(10)
    }
  )

  const isFetched =
    ((migration?.type === 'pool' && isFetchedPoolGasAmount) ||
      (migration?.type === 'pod' && isFetchedPodGasAmount)) &&
    isFetchedGasEstimates

  return { data: gasEstimates, isFetched }
}
