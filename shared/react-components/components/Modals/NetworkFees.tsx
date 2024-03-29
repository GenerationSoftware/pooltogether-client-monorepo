import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasCostEstimates,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import {
  erc20ABI,
  getSecondsSinceEpoch,
  sToMs,
  TWAB_CONTROLLER_ADDRESSES,
  twabControllerABI,
  vaultABI
} from '@shared/utilities'
import { useAccount } from 'wagmi'
import { TX_GAS_ESTIMATES } from '../../constants'
import { CurrencyValue } from '../Currency/CurrencyValue'

export interface NetworkFeesProps {
  vault: Vault
  show?: ('approve' | 'deposit' | 'depositWithPermit' | 'withdraw' | 'delegation')[]
  intl?: Intl<'title' | 'approval' | 'deposit' | 'withdrawal' | 'delegation'>
}

export const NetworkFees = (props: NetworkFeesProps) => {
  const { vault, show, intl } = props

  const { address: userAddress } = useAccount()

  const { data: tokenAddress } = useVaultTokenAddress(vault)

  return (
    <div className='flex flex-col items-center gap-2 font-semibold'>
      <span className='text-xs text-pt-purple-100 md:text-sm'>
        {intl?.('title') ?? 'Estimated Network Fees'}
      </span>
      {!!vault && !!tokenAddress ? (
        <div className='flex flex-col text-xs'>
          {(!show || show.includes('approve')) && (
            <TXFeeEstimate
              name={intl?.('approval') ?? 'Approval'}
              chainId={vault.chainId}
              tx={{
                address: tokenAddress,
                abi: erc20ABI,
                functionName: 'approve',
                args: [vault.address, 1n],
                account: userAddress
              }}
            />
          )}
          {(!show || show.includes('deposit')) && (
            <TXFeeEstimate
              name={intl?.('deposit') ?? 'Deposit'}
              chainId={vault.chainId}
              tx={{
                address: vault.address,
                abi: vaultABI,
                functionName: 'deposit',
                args: [1n, vault.address],
                account: userAddress
              }}
              gasAmount={TX_GAS_ESTIMATES.deposit}
            />
          )}
          {show?.includes('depositWithPermit') && (
            <TXFeeEstimate
              name={intl?.('deposit') ?? 'Deposit'}
              chainId={vault.chainId}
              tx={{
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
              }}
              gasAmount={TX_GAS_ESTIMATES.depositWithPermit}
            />
          )}
          {(!show || show.includes('withdraw')) && (
            <TXFeeEstimate
              name={intl?.('withdrawal') ?? 'Withdrawal'}
              chainId={vault.chainId}
              tx={{
                address: vault.address,
                abi: vaultABI,
                functionName: 'redeem',
                args: [1n, vault.address, vault.address],
                account: userAddress
              }}
              gasAmount={TX_GAS_ESTIMATES.withdraw}
            />
          )}
          {(!show || show.includes('delegation')) && (
            <TXFeeEstimate
              name={intl?.('delegation') ?? 'Delegation'}
              chainId={vault.chainId}
              tx={{
                address: TWAB_CONTROLLER_ADDRESSES[vault.chainId],
                abi: twabControllerABI,
                functionName: 'delegate',
                args: [vault.address, userAddress ?? vault.address],
                account: userAddress
              }}
            />
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

interface TXFeeEstimateProps {
  name: string
  chainId: number
  tx: Parameters<typeof useGasCostEstimates>[1]
  gasAmount?: bigint
}

const TXFeeEstimate = (props: TXFeeEstimateProps) => {
  const { name, chainId, tx, gasAmount } = props

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    chainId,
    tx,
    { gasAmount, refetchInterval: sToMs(10) }
  )

  const txCost = gasEstimates?.totalGasEth

  return (
    <span className='flex justify-between items-center gap-6'>
      <span className='font-normal text-pt-purple-100'>{name}</span>
      <span className='text-pt-purple-50'>
        {isFetchedGasEstimates ? (
          txCost === undefined ? (
            <>-</>
          ) : (
            <CurrencyValue baseValue={txCost} fallback={<>-</>} />
          )
        ) : (
          <Spinner />
        )}
      </span>
    </span>
  )
}
