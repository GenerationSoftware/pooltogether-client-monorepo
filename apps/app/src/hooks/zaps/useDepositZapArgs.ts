import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  getSharesFromAssets,
  lower,
  NETWORK,
  vaultABI,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
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
 * @param data input token, vault, enabled
 * @returns
 */
export const useDepositZapArgs = ({
  inputToken,
  vault
}: {
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0']
  vault: Vault
}) => {
  const zapRouterAddress = ZAP_SETTINGS[vault?.chainId]?.zapRouterAddress as Address | undefined
  const wrappedNativeTokenAddress = WRAPPED_NATIVE_ASSETS[vault?.chainId as NETWORK]

  const { address: userAddress } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)

  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { data: isLpSwapTxsNecessary, isFetched: isFetchedVaultTokenVelodromeLp } =
    useIsVelodromeLp(vaultToken!)

  const { data: lpVaultToken, isFetched: isFetchedLpVaultToken } = useLpToken(vaultToken!, {
    enabled: isLpSwapTxsNecessary ?? false
  })

  const swapInputToken: Parameters<typeof useSwapTx>['0']['from'] = {
    address: isDolphinAddress(inputToken?.address)
      ? wrappedNativeTokenAddress!
      : inputToken?.address,
    decimals: inputToken?.decimals,
    amount: inputToken?.amount
  }

  const isSwapTxNecessary =
    !!inputToken?.address &&
    !!vaultToken &&
    lower(vaultToken.address) !== lower(inputToken.address) &&
    (!isDolphinAddress(inputToken.address) ||
      lower(vaultToken.address) !== wrappedNativeTokenAddress) &&
    isFetchedVaultTokenVelodromeLp &&
    !isLpSwapTxsNecessary

  const isFirstLpSwapTxNecessary =
    isFetchedVaultTokenVelodromeLp &&
    isLpSwapTxsNecessary &&
    !!swapInputToken?.address &&
    isFetchedLpVaultToken &&
    !!lpVaultToken?.token0?.address &&
    lower(swapInputToken.address) !== lower(lpVaultToken.token0.address)

  const isSecondLpSwapTxNecessary =
    isFetchedVaultTokenVelodromeLp &&
    isLpSwapTxsNecessary &&
    !!swapInputToken?.address &&
    isFetchedLpVaultToken &&
    !!lpVaultToken?.token1?.address &&
    lower(swapInputToken.address) !== lower(lpVaultToken.token1.address)

  const {
    data: swapTx,
    isFetched: isFetchedSwapTx,
    isFetching: isFetchingSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: swapInputToken,
    to: { address: vaultToken?.address!, decimals: vaultToken?.decimals! },
    userAddress: zapRouterAddress!,
    options: { enabled: isSwapTxNecessary }
  })

  const {
    data: firstLpSwapTx,
    isFetched: isFetchedFirstLpSwapTx,
    isFetching: isFetchingFirstLpSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: swapInputToken,
    to: { address: lpVaultToken?.token0?.address!, decimals: lpVaultToken?.token0?.decimals! },
    userAddress: zapRouterAddress!,
    options: { enabled: isFirstLpSwapTxNecessary }
  })

  const {
    data: secondLpSwapTx,
    isFetched: isFetchedSecondLpSwapTx,
    isFetching: isFetchingSecondLpSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: swapInputToken,
    to: { address: lpVaultToken?.token1?.address!, decimals: lpVaultToken?.token1?.decimals! },
    userAddress: zapRouterAddress!,
    options: { enabled: isSecondLpSwapTxNecessary }
  })

  const amountOut = useMemo(() => {
    if (!!inputToken?.address && !!vaultToken && !!exchangeRate) {
      if (isSwapTxNecessary) {
        if (!!swapTx) {
          return {
            expected: getSharesFromAssets(
              swapTx.amountOut.expected,
              exchangeRate,
              vaultToken.decimals
            ),
            min: getSharesFromAssets(swapTx.amountOut.min, exchangeRate, vaultToken.decimals)
          }
        }
      } else if (isLpSwapTxsNecessary) {
        if (!!lpVaultToken) {
          // TODO: get ratio from lpVaultToken
          // TODO: calculate amount out somehow (consider 1 swaptx or 2 swaptxs)
        }
      } else {
        const simpleAmountOut = getSharesFromAssets(
          inputToken.amount,
          exchangeRate,
          vaultToken.decimals
        )

        return {
          expected: simpleAmountOut,
          min: simpleAmountOut
        }
      }
    }
  }, [
    inputToken,
    vaultToken,
    exchangeRate,
    isSwapTxNecessary,
    isLpSwapTxsNecessary,
    swapTx,
    firstLpSwapTx,
    secondLpSwapTx,
    lpVaultToken
  ])

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
    !!userAddress &&
    isFetchedVaultToken &&
    !!vaultToken &&
    isFetchedExchangeRate &&
    !!exchangeRate &&
    isFetchedVaultTokenVelodromeLp &&
    (!isSwapTxNecessary || (isFetchedSwapTx && !!swapTx)) &&
    (!isLpSwapTxsNecessary || (isFetchedLpVaultToken && !!lpVaultToken)) &&
    (!isFirstLpSwapTxNecessary || (isFetchedFirstLpSwapTx && !!firstLpSwapTx)) &&
    (!isSecondLpSwapTxNecessary || (isFetchedSecondLpSwapTx && !!secondLpSwapTx)) &&
    !!amountOut &&
    !!depositTx

  const isFetching =
    !isFetched && (isFetchingSwapTx || isFetchingFirstLpSwapTx || isFetchingSecondLpSwapTx)

  // TODO: if token is a velodrome lp token, add appropriate swaps + addLiquidity call
  const zapArgs = useMemo((): [ZapConfig, ZapRoute] | undefined => {
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
    userAddress,
    vaultToken,
    lpVaultToken,
    swapTx,
    amountOut,
    depositTx,
    isFetched
  ])

  return { zapArgs, amountOut, isFetched, isFetching }
}
