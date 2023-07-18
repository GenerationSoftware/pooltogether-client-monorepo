import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useGasCostEstimates } from '@pooltogether/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import { TX_GAS_ESTIMATES } from '../../constants'
import { CurrencyValue } from '../Currency/CurrencyValue'

export interface NetworkFeesProps {
  vault: Vault
  show?: ('approve' | 'deposit' | 'withdraw')[]
  intl?: Intl<'title' | 'approval' | 'deposit' | 'withdrawal'>
}

export const NetworkFees = (props: NetworkFeesProps) => {
  const { vault, show, intl } = props

  return (
    <div className='flex flex-col items-center gap-2 font-semibold'>
      <span className='text-xs text-pt-purple-100 md:text-sm'>
        {intl?.('title') ?? 'Estimated Network Fees'}
      </span>
      <div className='flex flex-col text-xs'>
        {(!show || show.includes('approve')) && (
          <TXFeeEstimate
            name={intl?.('approval') ?? 'Approval'}
            chainId={vault?.chainId}
            gasAmount={BigInt(TX_GAS_ESTIMATES.approve)}
          />
        )}
        {(!show || show.includes('deposit')) && (
          <TXFeeEstimate
            name={intl?.('deposit') ?? 'Deposit'}
            chainId={vault?.chainId}
            gasAmount={BigInt(TX_GAS_ESTIMATES.deposit)}
          />
        )}
        {(!show || show.includes('withdraw')) && (
          <TXFeeEstimate
            name={intl?.('withdrawal') ?? 'Withdrawal'}
            chainId={vault?.chainId}
            gasAmount={BigInt(TX_GAS_ESTIMATES.withdraw)}
          />
        )}
      </div>
    </div>
  )
}

interface TXFeeEstimateProps {
  name: string
  chainId: number
  gasAmount: bigint
}

const TXFeeEstimate = (props: TXFeeEstimateProps) => {
  const { name, chainId, gasAmount } = props

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    chainId,
    gasAmount
  )

  const txCost = gasEstimates?.totalGasCurrencies?.['eth']

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
