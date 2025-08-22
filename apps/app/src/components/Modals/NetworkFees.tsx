import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasCostEstimates,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { CurrencyValue, TX_GAS_ESTIMATES } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import {
  erc20ABI,
  PRIZE_POOLS,
  sToMs,
  twabControllerABI,
  vaultABI,
  ZAP_SETTINGS,
  zapRouterABI
} from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

export interface NetworkFeesProps {
  vault: Vault
  show?: (
    | 'approve'
    | 'deposit'
    | 'approve+deposit'
    | 'depositWithZap'
    | 'withdraw'
    | 'withdrawWithZap'
    | 'delegation'
  )[]
}

export const NetworkFees = (props: NetworkFeesProps) => {
  const { vault, show } = props

  const t = useTranslations('TxModals.fees')

  const { address: userAddress } = useAccount()

  const { data: tokenAddress } = useVaultTokenAddress(vault)

  const twabControllerAddress = useMemo(() => {
    return PRIZE_POOLS.find((prizePool) => prizePool.chainId === vault.chainId)?.options
      .twabControllerAddress
  }, [vault])

  return (
    <div className='flex flex-col items-center gap-2 font-semibold'>
      <span className='text-xs text-pt-purple-100 md:text-sm'>{t('title')}</span>
      {!!vault && !!tokenAddress ? (
        <div className='flex flex-col text-xs'>
          {(!show || show.includes('approve')) && (
            <TXFeeEstimate
              name={t('approval')}
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
              name={t('deposit')}
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
          {(!show || show.includes('approve+deposit')) && (
            <AggregateTXFeeEstimate
              name={t('deposit')}
              chainId={vault.chainId}
              tx1={{
                address: tokenAddress,
                abi: erc20ABI,
                functionName: 'approve',
                args: [vault.address, 1n],
                account: userAddress
              }}
              tx2={{
                address: vault.address,
                abi: vaultABI,
                functionName: 'deposit',
                args: [1n, vault.address],
                account: userAddress
              }}
              gasAmount2={TX_GAS_ESTIMATES.deposit}
            />
          )}
          {show?.includes('depositWithZap') && !!ZAP_SETTINGS[vault.chainId] && (
            <TXFeeEstimate
              name={t('deposit')}
              chainId={vault.chainId}
              tx={{
                address: ZAP_SETTINGS[vault.chainId].zapRouter,
                abi: [zapRouterABI['15']],
                functionName: 'executeOrder',
                args: [
                  {
                    inputs: [
                      { token: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', amount: '1000000' }
                    ],
                    outputs: [
                      {
                        token: '0x03d3ce84279cb6f54f5e6074ff0f8319d830dafe',
                        minOutputAmount: '999339'
                      }
                    ],
                    relay: { target: zeroAddress, value: 0n, data: '0x0' },
                    user: userAddress,
                    recipient: userAddress
                  },
                  [
                    {
                      target: '0x216b4b4ba9f3e719726886d34a177484278bfcae',
                      value: '0',
                      data: '0x8da5cb5b',
                      tokens: [{ token: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', index: -1 }]
                    },
                    {
                      target: '0xdef171fe48cf0115b1d80b88dc8eab59176fee57',
                      value: '0',
                      data: '0xa6886da9000000000000000000000000000000000000000000000000000000000000002000000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e580000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000e592427a0aece92de3edee1f18e0157c0586156400000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f18a200000000000000000000000000000000000000000000000000000000000f3fab010000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000664fb51a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000220ffc3cb6eefd749129b6c79a353e0f9c600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b94b008aa00579c1307b0ef2c499ad98a8ce58e580000640b2c639c533813f4aa9d7837caf62653d097ff850000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                      tokens: [{ token: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', index: -1 }]
                    },
                    {
                      target: '0x03d3ce84279cb6f54f5e6074ff0f8319d830dafe',
                      value: '0',
                      data: '0x6e553f650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e82343a116d2179f197111d92f9b53611b43c01c',
                      tokens: [{ token: '0x0b2c639c533813f4aa9d7837caf62653d097ff85', index: 4 }]
                    }
                  ]
                ],
                account: userAddress
              }}
              gasAmount={TX_GAS_ESTIMATES.depositWithZap}
            />
          )}
          {(!show || show.includes('withdraw')) && (
            <TXFeeEstimate
              name={t('withdrawal')}
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
          {show?.includes('withdrawWithZap') && !!ZAP_SETTINGS[vault.chainId] && (
            <TXFeeEstimate
              name={t('withdrawal')}
              chainId={vault.chainId}
              tx={{
                address: ZAP_SETTINGS[vault.chainId].zapRouter,
                abi: [zapRouterABI['15']],
                functionName: 'executeOrder',
                args: [
                  {
                    inputs: [
                      { token: '0x03d3ce84279cb6f54f5e6074ff0f8319d830dafe', amount: '1000000' }
                    ],
                    outputs: [
                      { token: '0x03d3ce84279cb6f54f5e6074ff0f8319d830dafe', minOutputAmount: '0' },
                      { token: '0x0b2c639c533813f4aa9d7837caf62653d097ff85', minOutputAmount: '0' },
                      {
                        token: '0x4200000000000000000000000000000000000006',
                        minOutputAmount: '284578438580964'
                      }
                    ],
                    relay: { target: zeroAddress, value: 0n, data: '0x0' },
                    user: userAddress,
                    recipient: userAddress
                  },
                  [
                    {
                      target: '0x216b4b4ba9f3e719726886d34a177484278bfcae',
                      value: '0',
                      data: '0x8da5cb5b',
                      tokens: [{ token: '0x03d3ce84279cb6f54f5e6074ff0f8319d830dafe', index: -1 }]
                    },
                    {
                      target: '0x03d3ce84279cb6f54f5e6074ff0f8319d830dafe',
                      value: '0',
                      data: '0x9f40a7b300000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000e82343a116d2179f197111d92f9b53611b43c01c000000000000000000000000e82343a116d2179f197111d92f9b53611b43c01c00000000000000000000000000000000000000000000000000000000000f4240',
                      tokens: [{ token: '0x03d3ce84279cb6f54f5e6074ff0f8319d830dafe', index: -1 }]
                    },
                    {
                      target: '0xdef171fe48cf0115b1d80b88dc8eab59176fee57',
                      value: '0',
                      data: '0x54e3f31b00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000420000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000102d294be0ae50000000000000000000000000000000000000000000000000001056fdc101fb100000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000220000000000000000000000000000000000000000000000000000000000000034000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000003e00000000000000000000000000000000000000000000000000000000066a02d4859e23527333a4a8dab409d8412d14a56000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000b41dd984730daf82f5c41489e21ac79d5e3b61bc00000000000000000000000000000000000000000000000000000000000000e491a32b690000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff8500000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000004de44c43646304492a925e335f2b6d840c1489f17815000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                      tokens: [{ token: '0x0b2c639c533813f4aa9d7837caf62653d097ff85', index: -1 }]
                    }
                  ]
                ],
                account: userAddress
              }}
              gasAmount={TX_GAS_ESTIMATES.withdrawWithZap}
            />
          )}
          {(!show || show.includes('delegation')) && !!twabControllerAddress && (
            <TXFeeEstimate
              name={t('delegation')}
              chainId={vault.chainId}
              tx={{
                address: twabControllerAddress,
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

  return <FeeValue name={name} fee={txCost} isFetched={isFetchedGasEstimates} />
}

interface AggregateTXFeeEstimateProps {
  name: string
  chainId: number
  tx1: Parameters<typeof useGasCostEstimates>[1]
  tx2: Parameters<typeof useGasCostEstimates>[1]
  gasAmount1?: bigint
  gasAmount2?: bigint
}

const AggregateTXFeeEstimate = (props: AggregateTXFeeEstimateProps) => {
  const { name, chainId, tx1, tx2, gasAmount1, gasAmount2 } = props

  const { data: gasEstimates1, isFetched: isFetchedGasEstimates1 } = useGasCostEstimates(
    chainId,
    tx1,
    { gasAmount: gasAmount1, refetchInterval: sToMs(10) }
  )

  const { data: gasEstimates2, isFetched: isFetchedGasEstimates2 } = useGasCostEstimates(
    chainId,
    tx2,
    { gasAmount: gasAmount2, refetchInterval: sToMs(10) }
  )

  const txCost = (gasEstimates1?.totalGasEth ?? 0) + (gasEstimates2?.totalGasEth ?? 0)
  const isFetched = isFetchedGasEstimates1 && isFetchedGasEstimates2

  return <FeeValue name={name} fee={txCost} isFetched={isFetched} />
}

interface FeeValueProps {
  name: string
  fee?: number
  isFetched: boolean
}

const FeeValue = (props: FeeValueProps) => {
  const { name, fee, isFetched } = props

  return (
    <span className='flex justify-between items-center gap-6'>
      <span className='font-normal text-pt-purple-100'>{name}</span>
      <span className='text-pt-purple-50'>
        {isFetched ? (
          fee === undefined ? (
            <>-</>
          ) : (
            <CurrencyValue baseValue={fee} fallback={<>-</>} />
          )
        ) : (
          <Spinner />
        )}
      </span>
    </span>
  )
}
