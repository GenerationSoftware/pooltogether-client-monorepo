import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Mutable } from '@shared/types'
import {
  getAssetsFromShares,
  getSharesFromAssets,
  lower,
  NETWORK,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { useMemo } from 'react'
import { getSimpleZapOutRoute, getSwapZapOutRoute, isDolphinAddress } from 'src/zapUtils'
import { Address, ContractFunctionArgs, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ROCKETPOOL_ADDRESSES, ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useSendWithdrawZapTransaction } from './useSendWithdrawZapTransaction'
import { useSwapTx } from './useSwapTx'
import { useWRETHExchangeRate } from './useWRETHExchangeRate'

type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[0]
type ZapRoute = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]

// TODO: enable redeeming lp tokens and swapping each output to the output token
// TODO: fully enable unwrapping weth to eth (index 4 for dynamic amount post-swap)

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
  const rocketPoolTokenAddresses = ROCKETPOOL_ADDRESSES[vault?.chainId]

  const { address: userAddress } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)

  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { data: wrETHExchangeRate } = useWRETHExchangeRate(vault?.chainId)

  const isBurningWRETHNecessary =
    !!vaultToken &&
    !!rocketPoolTokenAddresses &&
    lower(vaultToken.address) === rocketPoolTokenAddresses.WRETH

  const isSwapTxNecessary =
    !!vaultToken &&
    !!outputToken &&
    (!isDolphinAddress(outputToken.address) ||
      lower(vaultToken.address) !== wrappedNativeTokenAddress!) &&
    (!isBurningWRETHNecessary || lower(outputToken.address) !== rocketPoolTokenAddresses.RETH)

  const swapInputToken: Parameters<typeof useSwapTx>[0]['from'] = isBurningWRETHNecessary
    ? {
        address: rocketPoolTokenAddresses.RETH,
        decimals: 18,
        amount: !!wrETHExchangeRate
          ? getSharesFromAssets(
              getAssetsFromShares(amount, exchangeRate!, vaultToken?.decimals!),
              wrETHExchangeRate,
              18
            )
          : 0n
      }
    : {
        address: vaultToken?.address!,
        decimals: vaultToken?.decimals!,
        amount: getAssetsFromShares(amount, exchangeRate!, vaultToken?.decimals!)
      }

  const swapOutputToken: Parameters<typeof useSwapTx>[0]['to'] = {
    address: isDolphinAddress(outputToken?.address)
      ? wrappedNativeTokenAddress!
      : outputToken?.address,
    decimals: outputToken?.decimals
  }

  const {
    data: swapTx,
    isFetched: isFetchedSwapTx,
    isFetching: isFetchingSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: swapInputToken,
    to: swapOutputToken,
    userAddress: zapRouterAddress!,
    options: {
      enabled: isSwapTxNecessary && !!vault && !!amount && !!exchangeRate && !!swapInputToken.amount
    }
  })

  const amountOut = useMemo(() => {
    if (isSwapTxNecessary) {
      return swapTx?.amountOut
    } else if (!!swapInputToken.amount) {
      return { expected: swapInputToken.amount, min: swapInputToken.amount }
    }
  }, [isSwapTxNecessary, swapInputToken, swapTx])

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
    !!amountOut &&
    (!isBurningWRETHNecessary || !!wrETHExchangeRate)

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

      if (isBurningWRETHNecessary) {
        addZapOutput({ token: rocketPoolTokenAddresses.RETH, minOutputAmount: 0n })
      }

      let zapRoute: ZapRoute = []

      if (!!swapTx) {
        zapRoute = getSwapZapOutRoute(vault, amount, swapTx, vaultToken.address, exchangeRate)
      } else {
        zapRoute = getSimpleZapOutRoute(vault, amount, vaultToken.address, exchangeRate)
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
