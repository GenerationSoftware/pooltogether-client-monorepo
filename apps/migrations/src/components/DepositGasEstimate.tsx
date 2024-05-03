import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasCostEstimates,
  useTokenAllowance,
  useTokenPermitSupport
} from '@generationsoftware/hyperstructure-react-hooks'
import { CurrencyValue, TX_GAS_ESTIMATES } from '@shared/react-components'
import { TokenWithAmount } from '@shared/types'
import { Spinner } from '@shared/ui'
import { erc20ABI, getSecondsSinceEpoch, sToMs, vaultABI } from '@shared/utilities'
import { Address } from 'viem'

interface DepositGasEstimateProps {
  userAddress: Address
  vault: Vault
  token: TokenWithAmount
}

export const DepositGasEstimate = (props: DepositGasEstimateProps) => {
  const { userAddress, vault, token } = props

  const { data: tokenPermitSupport } = useTokenPermitSupport(token.chainId, token.address)

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault.chainId,
    userAddress,
    vault.address,
    token.address
  )

  const { data: approvalGasEstimates, isFetched: isFetchedApprovalGasEstimates } =
    useGasCostEstimates(
      vault.chainId,
      {
        address: token.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [vault.address, token.amount],
        account: userAddress
      },
      { gasAmount: TX_GAS_ESTIMATES.approve, refetchInterval: sToMs(10) }
    )

  const { data: depositGasEstimates, isFetched: isFetchedDepositGasEstimates } =
    useGasCostEstimates(
      vault.chainId,
      {
        address: vault.address,
        abi: vaultABI,
        functionName: 'deposit',
        args: [token.amount, userAddress],
        account: userAddress
      },
      { gasAmount: TX_GAS_ESTIMATES.deposit, refetchInterval: sToMs(10) }
    )

  const { data: depositWithPermitGasEstimates, isFetched: isFetchedDepositWithPermitGasEstimates } =
    useGasCostEstimates(
      vault.chainId,
      {
        address: vault.address,
        abi: vaultABI,
        functionName: 'depositWithPermit',
        args: [
          1n,
          vault.address,
          getSecondsSinceEpoch(),
          28,
          '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf',
          '0x4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8'
        ],
        account: userAddress
      },
      { gasAmount: TX_GAS_ESTIMATES.depositWithPermit, refetchInterval: sToMs(10) }
    )

  const needsApproval = isFetchedAllowance && allowance !== undefined && allowance < token.amount

  const isFetched = needsApproval
    ? tokenPermitSupport === 'eip2612'
      ? isFetchedDepositWithPermitGasEstimates
      : isFetchedApprovalGasEstimates && isFetchedDepositGasEstimates
    : isFetchedDepositGasEstimates

  const gasEstimate = needsApproval
    ? tokenPermitSupport === 'eip2612'
      ? depositWithPermitGasEstimates?.totalGasEth ?? 0
      : (approvalGasEstimates?.totalGasEth ?? 0) + (depositGasEstimates?.totalGasEth ?? 0)
    : depositGasEstimates?.totalGasEth ?? 0

  return (
    <span className='flex gap-1 items-center text-sm font-semibold text-pt-purple-100'>
      Estimated Network Fee:{' '}
      {isFetched && !!gasEstimate ? <CurrencyValue baseValue={gasEstimate} /> : <Spinner />}
    </span>
  )
}
