import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { vaultABI } from '@shared/utilities'
import { useMemo } from 'react'
import { getArbitraryProxyTx } from 'src/utils'
import { Address, ContractFunctionArgs, encodeFunctionData, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useSendDepositZapTransaction } from './useSendDepositZapTransaction'
import { useSwapTx } from './useSwapTx'

type ZapPermit = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[0]
type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[1]
type ZapRoute = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[3]

/**
 * Returns deposit zap with permit args
 * @param data input token, vault, signature, deadline, nonce, swapTx, amountOut, enabled
 * @returns
 */
export const useDepositZapWithPermitArgs = ({
  inputToken,
  vault,
  signature,
  deadline,
  nonce,
  swapTx,
  amountOut,
  enabled
}: {
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0']
  vault: Vault
  signature: `0x${string}`
  deadline: bigint
  nonce: bigint
  swapTx: ReturnType<typeof useSwapTx>['data']
  amountOut?: { expected: bigint; min: bigint }
  enabled?: boolean
}) => {
  const zapRouterAddress = ZAP_SETTINGS[vault?.chainId]?.zapRouterAddress as Address | undefined

  const { address: userAddress } = useAccount()

  const { data: vaultToken } = useVaultTokenData(vault)

  const depositTx = useMemo(() => {
    if (!!vault && !!zapRouterAddress) {
      return {
        target: vault.address,
        value: 0n,
        data: encodeFunctionData({
          abi: vaultABI,
          functionName: 'deposit',
          args: [0n, zapRouterAddress]
        })
      }
    }
  }, [vault, zapRouterAddress])

  const isFetched =
    !!inputToken &&
    !!vault &&
    !!signature &&
    !!deadline &&
    nonce !== undefined &&
    nonce !== -1n &&
    !!amountOut &&
    enabled &&
    !!userAddress &&
    !!vaultToken &&
    !!depositTx

  const data = useMemo((): [ZapPermit, ZapConfig, `0x${string}`, ZapRoute] | undefined => {
    if (isFetched) {
      const zapPermit: ZapPermit = {
        permitted: [{ token: inputToken.address, amount: inputToken.amount }],
        nonce,
        deadline
      }

      const zapConfig: ZapConfig = {
        inputs: [{ token: inputToken.address, amount: inputToken.amount }],
        outputs: [
          { token: vault.address, minOutputAmount: amountOut.min },
          { token: inputToken.address, minOutputAmount: 0n },
          { token: vaultToken.address, minOutputAmount: 0n }
        ],
        relay: { target: zeroAddress, value: 0n, data: '0x0' },
        user: userAddress,
        recipient: userAddress
      }

      const zapRoute: ZapRoute = !!swapTx
        ? [
            {
              ...getArbitraryProxyTx(swapTx.allowanceProxy),
              tokens: [{ token: inputToken.address, index: -1 }]
            },
            { ...swapTx.tx, tokens: [{ token: inputToken.address, index: -1 }] },
            { ...depositTx, tokens: [{ token: vaultToken.address, index: 4 }] }
          ]
        : [{ ...depositTx, tokens: [{ token: vaultToken.address, index: 4 }] }]

      return [zapPermit, zapConfig, signature, zapRoute]
    }
  }, [
    inputToken,
    vault,
    signature,
    deadline,
    nonce,
    swapTx,
    amountOut,
    userAddress,
    vaultToken,
    depositTx,
    isFetched
  ])

  return { data, isFetched }
}
