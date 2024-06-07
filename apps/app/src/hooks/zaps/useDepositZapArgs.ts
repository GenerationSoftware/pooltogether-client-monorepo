import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  calculatePercentageOfBigInt,
  divideBigInts,
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

  const swapInputTokenAddress = isDolphinAddress(inputToken?.address)
    ? wrappedNativeTokenAddress!
    : inputToken?.address

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
    !!swapInputTokenAddress &&
    isFetchedLpVaultToken &&
    !!lpVaultToken?.token0?.address &&
    lower(swapInputTokenAddress) !== lower(lpVaultToken.token0.address)

  const isSecondLpSwapTxNecessary =
    isFetchedVaultTokenVelodromeLp &&
    isLpSwapTxsNecessary &&
    !!swapInputTokenAddress &&
    isFetchedLpVaultToken &&
    !!lpVaultToken?.token1?.address &&
    lower(swapInputTokenAddress) !== lower(lpVaultToken.token1.address)

  const {
    data: swapTx,
    isFetched: isFetchedSwapTx,
    isFetching: isFetchingSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: {
      address: swapInputTokenAddress,
      decimals: inputToken?.decimals,
      amount: inputToken?.amount
    },
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
    from: {
      address: swapInputTokenAddress,
      decimals: inputToken?.decimals,
      amount: (inputToken?.amount ?? 0n) / 2n
    },
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
    from: {
      address: swapInputTokenAddress,
      decimals: inputToken?.decimals,
      amount: (inputToken?.amount ?? 0n) / 2n
    },
    to: { address: lpVaultToken?.token1?.address!, decimals: lpVaultToken?.token1?.decimals! },
    userAddress: zapRouterAddress!,
    options: { enabled: isSecondLpSwapTxNecessary }
  })

  const amountOut = useMemo(() => {
    if (!!inputToken?.address && !!inputToken.amount && !!vaultToken && !!exchangeRate) {
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
        if (
          !!lpVaultToken &&
          (!isFirstLpSwapTxNecessary || !!firstLpSwapTx) &&
          (!isSecondLpSwapTxNecessary || !!secondLpSwapTx)
        ) {
          const token0AmountOut = { expected: 0n, min: 0n }
          const token1AmountOut = { expected: 0n, min: 0n }

          if (isFirstLpSwapTxNecessary) {
            token0AmountOut.expected = firstLpSwapTx!.amountOut.expected
            token0AmountOut.min = firstLpSwapTx!.amountOut.min
          } else {
            token0AmountOut.expected = inputToken.amount / 2n
            token0AmountOut.min = inputToken.amount / 2n
          }

          if (isSecondLpSwapTxNecessary) {
            token1AmountOut.expected = secondLpSwapTx!.amountOut.expected
            token1AmountOut.min = secondLpSwapTx!.amountOut.min
          } else {
            token1AmountOut.expected = inputToken.amount / 2n
            token1AmountOut.min = inputToken.amount / 2n
          }

          const token0Percentage = {
            expected: divideBigInts(
              token0AmountOut.expected,
              lpVaultToken.token0.amount,
              lpVaultToken.token0.decimals
            ),
            min: divideBigInts(
              token0AmountOut.min,
              lpVaultToken.token0.amount,
              lpVaultToken.token0.decimals
            )
          }
          const token1Percentage = {
            expected: divideBigInts(
              token1AmountOut.expected,
              lpVaultToken.token1.amount,
              lpVaultToken.token1.decimals
            ),
            min: divideBigInts(
              token1AmountOut.min,
              lpVaultToken.token1.amount,
              lpVaultToken.token1.decimals
            )
          }

          return {
            expected: calculatePercentageOfBigInt(
              lpVaultToken.totalSupply,
              Math.min(token0Percentage.expected, token1Percentage.expected)
            ),
            min: calculatePercentageOfBigInt(
              lpVaultToken.totalSupply,
              Math.min(token0Percentage.min, token1Percentage.min)
            )
          }
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
    isFirstLpSwapTxNecessary,
    isSecondLpSwapTxNecessary,
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
