import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasCostEstimates,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { CurrencyValue, TX_GAS_ESTIMATES } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import {
  erc20ABI,
  getSecondsSinceEpoch,
  PRIZE_POOLS,
  sToMs,
  twabControllerABI,
  vaultABI
} from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'

export interface NetworkFeesProps {
  vault: Vault
  show?: (
    | 'approve'
    | 'deposit'
    | 'depositWithPermit'
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
          {show?.includes('depositWithPermit') && (
            <TXFeeEstimate
              name={t('deposit')}
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
                args: [], // TODO: add tx args
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
