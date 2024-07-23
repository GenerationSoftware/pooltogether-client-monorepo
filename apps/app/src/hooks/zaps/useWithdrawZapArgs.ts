import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Mutable } from '@shared/types'
import { getAssetsFromShares, lower, NETWORK, WRAPPED_NATIVE_ASSETS } from '@shared/utilities'
import { useMemo } from 'react'
import { getSimpleZapOutRoute, getSwapZapOutRoute, isDolphinAddress } from 'src/zapUtils'
import { Address, ContractFunctionArgs, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useSendWithdrawZapTransaction } from './useSendWithdrawZapTransaction'
import { useSwapTx } from './useSwapTx'

type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[0]
type ZapRoute = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]

// TODO: enable redeeming lp tokens and swapping each output to the output token
// TODO: fully enable unwrapping weth to eth (need index for dynamic amount post-swap)

/**
 * Returns withdraw zap args
 * @param data output token, vault, amount
 * @returns
 */
export const useWithdrawZapArgs = ({
  outputToken,
  vault,
  amount
}: {
  outputToken: Parameters<typeof useSendWithdrawZapTransaction>['0']
  vault: Vault
  amount: bigint
}) => {
  const zapRouterAddress = ZAP_SETTINGS[vault?.chainId]?.zapRouter as Address | undefined
  const wrappedNativeTokenAddress = WRAPPED_NATIVE_ASSETS[vault?.chainId as NETWORK]

  const { address: userAddress } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)

  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const isSwapTxNecessary =
    !!vaultToken &&
    !!outputToken &&
    (!isDolphinAddress(outputToken.address) ||
      lower(vaultToken.address) !== wrappedNativeTokenAddress!)

  const {
    data: swapTx,
    isFetched: isFetchedSwapTx,
    isFetching: isFetchingSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: {
      address: vaultToken?.address!,
      decimals: vaultToken?.decimals!,
      amount: getAssetsFromShares(amount, exchangeRate!, vaultToken?.decimals!)
    },
    to: {
      address: isDolphinAddress(outputToken?.address)
        ? wrappedNativeTokenAddress!
        : outputToken?.address,
      decimals: outputToken?.decimals
    },
    userAddress: zapRouterAddress!,
    options: { enabled: isSwapTxNecessary && !!vault && !!amount && !!exchangeRate }
  })

  const amountOut = useMemo(() => {
    if (isSwapTxNecessary) {
      return swapTx?.amountOut
    } else if (!!exchangeRate && !!vaultToken) {
      return {
        expected: getAssetsFromShares(amount, exchangeRate, vaultToken.decimals),
        min: getAssetsFromShares(amount, exchangeRate, vaultToken.decimals)
      }
    }
  }, [amount, isSwapTxNecessary, swapTx, exchangeRate, vaultToken])

  const isFetched =
    !!outputToken &&
    vault?.decimals !== undefined &&
    !!amount &&
    !!zapRouterAddress &&
    !!userAddress &&
    isFetchedVaultToken &&
    !!vaultToken &&
    isFetchedExchangeRate &&
    !!exchangeRate &&
    (!isSwapTxNecessary || (isFetchedSwapTx && !!swapTx)) &&
    !!amountOut

  const isFetching = !isFetched && isFetchingSwapTx

  const zapArgs = useMemo((): [ZapConfig, ZapRoute] | undefined => {
    if (isFetched) {
      const zapInputs: ZapConfig['inputs'] = [{ token: vault.address, amount }]

      const zapOutputs: Mutable<ZapConfig['outputs']> = [
        { token: vault.address, minOutputAmount: 0n },
        { token: vaultToken.address, minOutputAmount: 0n },
        { token: outputToken.address, minOutputAmount: amountOut.min }
      ]

      const addZapOutput = (newOutput: (typeof zapOutputs)[number]) => {
        const existingOutputIndex = zapOutputs.findIndex(
          (output) => lower(output.token) === lower(newOutput.token)
        )
        if (existingOutputIndex === -1) {
          zapOutputs.push(newOutput)
        } else if (zapOutputs[existingOutputIndex].minOutputAmount !== newOutput.minOutputAmount) {
          zapOutputs[existingOutputIndex].minOutputAmount = newOutput.minOutputAmount
        }
      }

      if (isDolphinAddress(outputToken.address) && !!wrappedNativeTokenAddress) {
        addZapOutput({ token: wrappedNativeTokenAddress, minOutputAmount: 0n })
      }

      let zapRoute: ZapRoute = []

      if (!!swapTx) {
        zapRoute = getSwapZapOutRoute(vault, amount, swapTx, vaultToken.address, exchangeRate)
      } else {
        zapRoute = getSimpleZapOutRoute(vault, amount, exchangeRate)
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
    outputToken,
    vault,
    amount,
    userAddress,
    vaultToken,
    exchangeRate,
    swapTx,
    amountOut,
    isFetched
  ])

  return { zapArgs, amountOut, isFetched, isFetching }
}
