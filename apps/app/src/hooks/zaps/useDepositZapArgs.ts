import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { NETWORK, vaultABI, WRAPPED_NATIVE_ASSETS } from '@shared/utilities'
import { useMemo } from 'react'
import { getArbitraryProxyTx, getWrapTx, isDolphinAddress } from 'src/utils'
import { Address, ContractFunctionArgs, encodeFunctionData, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useIsVelodromeLp } from './useIsVelodromeLp'
import { useLpToken } from './useLpToken'
import { useSendDepositZapTransaction } from './useSendDepositZapTransaction'
import { useSwapTx } from './useSwapTx'

type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[0]
type ZapRoute = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]

/**
 * Returns deposit zap args
 * @param data input token, vault, swapTx, amountOut, enabled
 * @returns
 */
export const useDepositZapArgs = ({
  inputToken,
  vault,
  swapTx,
  amountOut,
  enabled
}: {
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0']
  vault: Vault
  swapTx: ReturnType<typeof useSwapTx>['data']
  amountOut?: { expected: bigint; min: bigint }
  enabled?: boolean
}) => {
  const zapRouterAddress = ZAP_SETTINGS[vault?.chainId]?.zapRouterAddress as Address | undefined
  const wrappedNativeTokenAddress = WRAPPED_NATIVE_ASSETS[vault?.chainId as NETWORK]

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

  const { data: isVaultTokenVelodromeLp, isFetched: isFetchedVaultTokenVelodromeLp } =
    useIsVelodromeLp(vaultToken as Token)

  const { data: lpVaultToken } = useLpToken(vaultToken as Token, {
    enabled: isVaultTokenVelodromeLp ?? false
  })

  const isFetched =
    !!inputToken &&
    !!vault &&
    !!amountOut &&
    enabled &&
    !!userAddress &&
    !!vaultToken &&
    !!depositTx &&
    isFetchedVaultTokenVelodromeLp &&
    (!isVaultTokenVelodromeLp || !!lpVaultToken)

  // TODO: if token is a velodrome lp token, add appropriate swaps + addLiquidity call
  const data = useMemo((): [ZapConfig, ZapRoute] | undefined => {
    if (isFetched) {
      let zapInputs: ZapConfig['inputs'] = []

      let zapOutputs: ZapConfig['outputs'] = [
        { token: vault.address, minOutputAmount: amountOut.min },
        { token: vaultToken.address, minOutputAmount: 0n }
      ]

      let zapRoute: ZapRoute = [{ ...depositTx, tokens: [{ token: vaultToken.address, index: 4 }] }]

      if (isDolphinAddress(inputToken.address)) {
        zapInputs = [{ token: zeroAddress, amount: inputToken.amount }]
        zapOutputs = [...zapOutputs, { token: zeroAddress, minOutputAmount: 0n }]

        if (!!swapTx && !!wrappedNativeTokenAddress) {
          zapOutputs = [...zapOutputs, { token: wrappedNativeTokenAddress, minOutputAmount: 0n }]

          // Wrap ETH -> Swap for vault token -> Deposit
          zapRoute = [
            {
              ...getWrapTx(vault.chainId, inputToken.amount),
              tokens: [{ token: zeroAddress, index: -1 }]
            },
            {
              ...getArbitraryProxyTx(swapTx.allowanceProxy),
              tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
            },
            {
              ...swapTx.tx,
              tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
            },
            ...zapRoute
          ]
        } else {
          // Wrap ETH -> Deposit
          zapRoute = [
            {
              ...getWrapTx(vault.chainId, inputToken.amount),
              tokens: [{ token: zeroAddress, index: -1 }]
            },
            ...zapRoute
          ]
        }
      } else {
        zapInputs = [{ token: inputToken.address, amount: inputToken.amount }]
        zapOutputs = [...zapOutputs, { token: inputToken.address, minOutputAmount: 0n }]

        if (!!swapTx) {
          // Swap for vault token -> Deposit
          zapRoute = [
            {
              ...getArbitraryProxyTx(swapTx.allowanceProxy),
              tokens: [{ token: inputToken.address, index: -1 }]
            },
            {
              ...swapTx.tx,
              tokens: [{ token: inputToken.address, index: -1 }]
            },
            ...zapRoute
          ]
        }
      }

      const zapConfig: ZapConfig = {
        inputs: zapInputs,
        outputs: zapOutputs,
        relay: { target: zeroAddress, value: 0n, data: '0x0' },
        user: userAddress,
        recipient: userAddress
      }

      return [zapConfig, zapRoute]
    }
  }, [
    inputToken,
    vault,
    swapTx,
    amountOut,
    userAddress,
    vaultToken,
    depositTx,
    isVaultTokenVelodromeLp,
    lpVaultToken,
    isFetched
  ])

  return { data, isFetched }
}
