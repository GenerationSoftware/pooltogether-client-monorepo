import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useGasCostEstimates } from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import {
  erc20ABI,
  getSecondsSinceEpoch,
  sToMs,
  twabControllerABI,
  vaultABI
} from '@shared/utilities'
import { TX_GAS_ESTIMATES } from '../../constants'
import { CurrencyValue } from '../Currency/CurrencyValue'

export interface NetworkFeesProps {
  vault: Vault
  show?: ('approve' | 'deposit' | 'depositWithPermit' | 'withdraw' | 'delegate')[]
  intl?: Intl<'title' | 'approval' | 'deposit' | 'withdrawal' | 'delegate'>
}

export const NetworkFees = (props: NetworkFeesProps) => {
  const { vault, show, intl } = props

  return (
    <div className='flex flex-col items-center gap-2 font-semibold'>
      <span className='text-xs text-pt-purple-100 md:text-sm'>
        {intl?.('title') ?? 'Estimated Network Fees'}
      </span>
      {!!vault ? (
        <div className='flex flex-col text-xs'>
          {(!show || show.includes('approve')) && (
            <TXFeeEstimate
              name={intl?.('approval') ?? 'Approval'}
              chainId={vault.chainId}
              gasAmount={TX_GAS_ESTIMATES.approve}
              tx={{ abi: erc20ABI, functionName: 'approve', args: [vault.address, 1n] }}
            />
          )}
          {(!show || show.includes('deposit')) && (
            <TXFeeEstimate
              name={intl?.('deposit') ?? 'Deposit'}
              chainId={vault.chainId}
              gasAmount={TX_GAS_ESTIMATES.deposit}
              tx={{ abi: vaultABI, functionName: 'deposit', args: [1n, vault.address] }}
            />
          )}
          {show?.includes('depositWithPermit') && (
            <TXFeeEstimate
              name={intl?.('deposit') ?? 'Deposit'}
              chainId={vault.chainId}
              gasAmount={TX_GAS_ESTIMATES.depositWithPermit}
              tx={{
                abi: vaultABI,
                functionName: 'depositWithPermit',
                args: [
                  1n,
                  vault.address,
                  getSecondsSinceEpoch(),
                  28,
                  '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf',
                  '0x4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8'
                ]
              }}
            />
          )}
          {(!show || show.includes('withdraw')) && (
            <TXFeeEstimate
              name={intl?.('withdrawal') ?? 'Withdrawal'}
              chainId={vault.chainId}
              gasAmount={TX_GAS_ESTIMATES.withdraw}
              tx={{
                abi: vaultABI,
                functionName: 'redeem',
                args: [1n, vault.address, vault.address]
              }}
            />
          )}
          {(!show || show.includes('delegate')) && (
            <TXFeeEstimate
              name={intl?.('delegate') ?? 'Delegate'}
              chainId={vault.chainId}
              gasAmount={TX_GAS_ESTIMATES.withdraw}
              tx={{
                abi: twabControllerABI,
                functionName: 'delegate',
                args: [vault.address, vault.address]
                // args: [vault.address, to.address] // fill in input address
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
  gasAmount: bigint
  tx?: NonNullable<Parameters<typeof useGasCostEstimates>['2']>['tx']
}

const TXFeeEstimate = (props: TXFeeEstimateProps) => {
  const { name, chainId, gasAmount, tx } = props

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    chainId,
    gasAmount,
    { tx, refetchInterval: sToMs(10) }
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
