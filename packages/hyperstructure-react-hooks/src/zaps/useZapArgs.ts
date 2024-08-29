import { Mutable } from '@shared/types'
import {
  calculatePercentageOfBigInt,
  DOLPHIN_ADDRESS,
  getAssetsFromShares,
  getBeefyWithdrawTx,
  getCurveAddLiquidityTx,
  getDepositTx,
  getLpSwapAmountOut,
  getRedeemTx,
  getSharesFromAssets,
  getUnwrapTx,
  getVelodromeAddLiquidityTx,
  getWrapTx,
  lower,
  NETWORK,
  VELODROME_ADDRESSES,
  WRAPPED_NATIVE_ASSETS,
  ZAP_SETTINGS,
  zapRouterABI
} from '@shared/utilities'
import { useMemo } from 'react'
import { Address, ContractFunctionArgs, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { useCurveAddLiquidityOutput, useSwapTx, useZapTokenInfo } from '..'

type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[0]
type ZapRoute = Mutable<ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]>

// TODO: allow for withdrawing from velodrome or curve lps when appropriate
// TODO: allow for deposits into beefy vaults when appropriate
/**
 * Returns zap args
 * @param chainId the chain ID to zap within
 * @param inputToken the token being zapped from
 * @param outputToken the token being zapped to
 */
export const useZapArgs = (
  chainId: NETWORK,
  inputToken: { address: Address; decimals: number; amount: bigint },
  outputToken: { address: Address; decimals: number }
) => {
  const zapRouterAddress = ZAP_SETTINGS[chainId]?.zapRouter as Address | undefined
  const wrappedNativeTokenAddress = WRAPPED_NATIVE_ASSETS[chainId]
  const velodromeRouterAddress = VELODROME_ADDRESSES[chainId]?.router as Address | undefined

  const isValidInputToken =
    !!inputToken?.address && inputToken.decimals !== undefined && !!inputToken.amount
  const isValidOutputToken = !!outputToken?.address && outputToken.decimals !== undefined

  const { address: userAddress } = useAccount()

  const { data: inputTokenInfo, isFetched: isFetchedInputTokenInfo } = useZapTokenInfo(
    chainId,
    inputToken?.address
  )
  const { data: outputTokenInfo, isFetched: isFetchedOutputTokenInfo } = useZapTokenInfo(
    chainId,
    outputToken?.address
  )

  const swapInputToken = useMemo(() => {
    if (isValidInputToken) {
      if (lower(inputToken.address) === DOLPHIN_ADDRESS && !!wrappedNativeTokenAddress) {
        return {
          address: wrappedNativeTokenAddress,
          decimals: inputToken.decimals,
          amount: inputToken.amount
        }
      } else if (isFetchedInputTokenInfo) {
        if (!!inputTokenInfo.vaultToken && !!inputTokenInfo.exchangeRate) {
          return {
            address: inputTokenInfo.vaultToken.address,
            decimals: inputTokenInfo.vaultToken.decimals,
            amount: getAssetsFromShares(
              inputToken.amount,
              inputTokenInfo.exchangeRate,
              inputToken.decimals
            )
          }
        } else if (
          !!outputTokenInfo.beefyVault &&
          lower(outputTokenInfo.beefyVault.address) === lower(inputToken.address)
        ) {
          return {
            address: outputTokenInfo.beefyVault.want,
            decimals: outputTokenInfo.beefyVault.decimals,
            amount: getAssetsFromShares(
              inputToken.amount,
              outputTokenInfo.beefyVault.pricePerFullShare,
              inputToken.decimals
            )
          }
        } else {
          return inputToken
        }
      }
    }
  }, [inputToken, isValidInputToken, inputTokenInfo, isFetchedInputTokenInfo, outputTokenInfo])

  const swapOutputTokens = useMemo(() => {
    if (isValidOutputToken) {
      if (lower(outputToken.address) === DOLPHIN_ADDRESS && !!wrappedNativeTokenAddress) {
        return [{ address: wrappedNativeTokenAddress, decimals: outputToken.decimals }]
      } else if (isFetchedOutputTokenInfo) {
        if (!!outputTokenInfo.lpToken) {
          if (outputTokenInfo.isVelodromeLp) {
            return [
              {
                address: outputTokenInfo.lpToken.token0.address,
                decimals: outputTokenInfo.lpToken.token0.decimals
              },
              {
                address: outputTokenInfo.lpToken.token1.address,
                decimals: outputTokenInfo.lpToken.token1.decimals
              }
            ]
          } else if (
            outputTokenInfo.isCurveLp &&
            !!outputTokenInfo.lpToken.bestCurveInputTokenAddress
          ) {
            if (
              lower(outputTokenInfo.lpToken.token0.address) ===
              lower(outputTokenInfo.lpToken.bestCurveInputTokenAddress)
            ) {
              return [
                {
                  address: outputTokenInfo.lpToken.token0.address,
                  decimals: outputTokenInfo.lpToken.token0.decimals
                }
              ]
            } else if (
              lower(outputTokenInfo.lpToken.token1.address) ===
              lower(outputTokenInfo.lpToken.bestCurveInputTokenAddress)
            ) {
              return [
                {
                  address: outputTokenInfo.lpToken.token1.address,
                  decimals: outputTokenInfo.lpToken.token1.decimals
                }
              ]
            }
          }
        } else if (!!outputTokenInfo.vaultToken) {
          return [
            {
              address: outputTokenInfo.vaultToken.address,
              decimals: outputTokenInfo.vaultToken.decimals
            }
          ]
        } else {
          return [outputToken]
        }
      }
    }

    return []
  }, [outputToken, isValidOutputToken, outputTokenInfo, isFetchedOutputTokenInfo])

  const isSwapNecessary =
    isValidInputToken &&
    isValidOutputToken &&
    !!swapInputToken &&
    ((swapOutputTokens.length === 1 &&
      lower(swapInputToken.address) !== lower(swapOutputTokens[0].address)) ||
      swapOutputTokens.length === 2) &&
    (!outputTokenInfo.beefyVault ||
      lower(outputTokenInfo.beefyVault.want) !== lower(swapInputToken.address))

  const isFirstSwapNecessary =
    isSwapNecessary && lower(swapInputToken.address) !== lower(swapOutputTokens[0].address)
  const isSecondSwapNecessary =
    isSwapNecessary &&
    swapOutputTokens.length === 2 &&
    lower(swapInputToken.address) !== lower(swapOutputTokens[1].address)

  const {
    data: firstSwapTx,
    isFetched: isFetchedFirstSwapTx,
    isFetching: isFetchingFirstSwapTx
  } = useSwapTx({
    chainId,
    from: {
      address: swapInputToken?.address!,
      decimals: swapInputToken?.decimals!,
      amount: !!swapInputToken
        ? swapOutputTokens.length === 2
          ? swapInputToken.amount / 2n
          : swapInputToken.amount
        : 0n
    },
    to: swapOutputTokens[0],
    userAddress: zapRouterAddress!,
    options: { enabled: isFirstSwapNecessary }
  })

  const {
    data: secondSwapTx,
    isFetched: isFetchedSecondSwapTx,
    isFetching: isFetchingSecondSwapTx
  } = useSwapTx({
    chainId,
    from: {
      address: swapInputToken?.address!,
      decimals: swapInputToken?.decimals!,
      amount: !!swapInputToken ? swapInputToken.amount / 2n : 0n
    },
    to: swapOutputTokens[1],
    userAddress: zapRouterAddress!,
    options: { enabled: isSecondSwapNecessary }
  })

  const curveAddLiquidityInput =
    isValidInputToken &&
    isValidOutputToken &&
    !!outputTokenInfo.lpToken &&
    outputTokenInfo.isCurveLp &&
    !!swapInputToken
      ? isSwapNecessary
        ? firstSwapTx?.amountOut.expected
        : swapInputToken.amount
      : undefined
  const { data: curveAddLiquidityOutput } = useCurveAddLiquidityOutput(
    chainId,
    outputTokenInfo?.lpToken?.address!,
    !!curveAddLiquidityInput
      ? outputTokenInfo.lpToken!.bestCurveInputTokenAddress ===
        outputTokenInfo.lpToken!.token0.address
        ? [curveAddLiquidityInput, 0n]
        : [0n, curveAddLiquidityInput]
      : [0n, 0n],
    { enabled: !!curveAddLiquidityInput }
  )

  const amountOut = useMemo(() => {
    if (
      isValidInputToken &&
      isValidOutputToken &&
      !!inputTokenInfo &&
      !!outputTokenInfo &&
      !!swapInputToken?.amount &&
      !!swapOutputTokens.length
    ) {
      if (outputTokenInfo.isCurveLp) {
        if (!!outputTokenInfo.lpToken && !!curveAddLiquidityOutput) {
          if (!!outputTokenInfo.vaultToken && !!outputTokenInfo.exchangeRate) {
            const expected = getSharesFromAssets(
              curveAddLiquidityOutput,
              outputTokenInfo.exchangeRate,
              outputTokenInfo.vaultToken.decimals
            )

            return { expected, min: calculatePercentageOfBigInt(expected, 0.99) }
          } else {
            return {
              expected: curveAddLiquidityOutput,
              min: calculatePercentageOfBigInt(curveAddLiquidityOutput, 0.99)
            }
          }
        }
      } else if (isSwapNecessary) {
        if (outputTokenInfo.isVelodromeLp) {
          if (
            !!outputTokenInfo.lpToken &&
            (!isFirstSwapNecessary || !!firstSwapTx) &&
            (!isSecondSwapNecessary || !!secondSwapTx)
          ) {
            const lpSwapAmountOut = getLpSwapAmountOut(
              {
                address: swapInputToken.address,
                decimals: swapInputToken.decimals,
                amount: swapInputToken.amount
              },
              outputTokenInfo.lpToken,
              { tx: firstSwapTx, isNecessary: isFirstSwapNecessary },
              { tx: secondSwapTx, isNecessary: isSecondSwapNecessary }
            )
            if (!!outputTokenInfo.vaultToken && !!outputTokenInfo.exchangeRate) {
              return {
                expected: getSharesFromAssets(
                  lpSwapAmountOut.expected,
                  outputTokenInfo.exchangeRate,
                  outputTokenInfo.vaultToken.decimals
                ),
                min: getSharesFromAssets(
                  lpSwapAmountOut.min,
                  outputTokenInfo.exchangeRate,
                  outputTokenInfo.vaultToken.decimals
                )
              }
            } else {
              return lpSwapAmountOut
            }
          }
        } else if (!!firstSwapTx) {
          if (!!outputTokenInfo.vaultToken && !!outputTokenInfo.exchangeRate) {
            return {
              expected: getSharesFromAssets(
                firstSwapTx.amountOut.expected,
                outputTokenInfo.exchangeRate,
                outputTokenInfo.vaultToken.decimals
              ),
              min: getSharesFromAssets(
                firstSwapTx.amountOut.min,
                outputTokenInfo.exchangeRate,
                outputTokenInfo.vaultToken.decimals
              )
            }
          } else {
            return firstSwapTx.amountOut
          }
        }
      } else if (!!outputTokenInfo.vaultToken && !!outputTokenInfo.exchangeRate) {
        const expected = getSharesFromAssets(
          swapInputToken.amount,
          outputTokenInfo.exchangeRate,
          outputTokenInfo.vaultToken.decimals
        )

        return { expected, min: expected }
      } else {
        return { expected: swapInputToken.amount, min: swapInputToken.amount }
      }
    }
  }, [
    isValidInputToken,
    isValidOutputToken,
    inputTokenInfo,
    outputTokenInfo,
    swapInputToken,
    swapOutputTokens,
    isSwapNecessary,
    isFirstSwapNecessary,
    isSecondSwapNecessary,
    firstSwapTx,
    secondSwapTx,
    curveAddLiquidityOutput
  ])

  const isFetched =
    isValidInputToken &&
    isValidOutputToken &&
    !!zapRouterAddress &&
    !!userAddress &&
    isFetchedInputTokenInfo &&
    isFetchedOutputTokenInfo &&
    !!swapInputToken &&
    (!isFirstSwapNecessary || (isFetchedFirstSwapTx && !!firstSwapTx)) &&
    (!isSecondSwapNecessary || (isFetchedSecondSwapTx && !!secondSwapTx)) &&
    !!amountOut

  const isFetching = !isFetched && (isFetchingFirstSwapTx || isFetchingSecondSwapTx)

  const zapArgs = useMemo((): [ZapConfig, ZapRoute] | undefined => {
    if (isFetched) {
      const zapInputs: ZapConfig['inputs'] = [
        {
          token: lower(inputToken.address) === DOLPHIN_ADDRESS ? zeroAddress : inputToken.address,
          amount: inputToken.amount
        }
      ]

      const zapOutputs: Mutable<ZapConfig['outputs']> = [
        {
          token: lower(inputToken.address) === DOLPHIN_ADDRESS ? zeroAddress : inputToken.address,
          minOutputAmount: 0n
        },
        {
          token: lower(outputToken.address) === DOLPHIN_ADDRESS ? zeroAddress : outputToken.address,
          minOutputAmount: amountOut.min
        }
      ]

      const addZapOutput = (newOutput: (typeof zapOutputs)[number]) => {
        const existingOutputIndex = zapOutputs.findIndex(
          (output) => lower(output.token) === lower(newOutput.token)
        )
        if (existingOutputIndex === -1) {
          zapOutputs.push(newOutput)
        } else if (zapOutputs[existingOutputIndex].minOutputAmount < newOutput.minOutputAmount) {
          zapOutputs[existingOutputIndex].minOutputAmount = newOutput.minOutputAmount
        }
      }

      if (
        (lower(inputToken.address) === DOLPHIN_ADDRESS ||
          lower(outputToken.address) === DOLPHIN_ADDRESS) &&
        !!wrappedNativeTokenAddress
      ) {
        addZapOutput({ token: wrappedNativeTokenAddress, minOutputAmount: 0n })
      }

      if (!!inputTokenInfo.vaultToken) {
        addZapOutput({ token: inputTokenInfo.vaultToken.address, minOutputAmount: 0n })
      }

      if (!!outputTokenInfo.vaultToken) {
        addZapOutput({ token: outputTokenInfo.vaultToken.address, minOutputAmount: 0n })
      }

      if (!!firstSwapTx || !!secondSwapTx) {
        addZapOutput({ token: swapInputToken.address, minOutputAmount: 0n })
      }

      if (!!firstSwapTx && !!swapOutputTokens[0]) {
        addZapOutput({ token: swapOutputTokens[0].address, minOutputAmount: 0n })
      }

      if (!!secondSwapTx && !!swapOutputTokens[1]) {
        addZapOutput({ token: swapOutputTokens[1].address, minOutputAmount: 0n })
      }

      if (!!inputTokenInfo.lpToken) {
        addZapOutput({ token: inputTokenInfo.lpToken.token0.address, minOutputAmount: 0n })
        addZapOutput({ token: inputTokenInfo.lpToken.token1.address, minOutputAmount: 0n })
      }

      if (!!outputTokenInfo.lpToken) {
        addZapOutput({ token: outputTokenInfo.lpToken.token0.address, minOutputAmount: 0n })
        addZapOutput({ token: outputTokenInfo.lpToken.token1.address, minOutputAmount: 0n })
      }

      const zapRoute: ZapRoute = []

      if (lower(inputToken.address) === DOLPHIN_ADDRESS) {
        zapRoute.push({
          ...getWrapTx(chainId, inputToken.amount),
          tokens: [{ token: zeroAddress, index: -1 }]
        })
      } else if (!!inputTokenInfo.vaultToken && !!inputTokenInfo.exchangeRate) {
        zapRoute.push({
          ...getRedeemTx(
            inputToken.address,
            zapRouterAddress,
            inputToken.amount,
            getAssetsFromShares(inputToken.amount, inputTokenInfo.exchangeRate, inputToken.decimals)
          ),
          tokens: [{ token: inputToken.address, index: -1 }]
        })
      } else if (
        !!outputTokenInfo.beefyVault &&
        lower(outputTokenInfo.beefyVault.address) === lower(inputToken.address)
      ) {
        zapRoute.push({
          ...getBeefyWithdrawTx(inputToken.address, inputToken.amount),
          tokens: [{ token: inputToken.address, index: -1 }]
        })
      }

      if (!!firstSwapTx) {
        zapRoute.push({ ...firstSwapTx.tx, tokens: [{ token: swapInputToken.address, index: -1 }] })
      }

      if (!!secondSwapTx) {
        zapRoute.push({
          ...secondSwapTx.tx,
          tokens: [{ token: swapInputToken.address, index: -1 }]
        })
      }

      if (lower(outputToken.address) === DOLPHIN_ADDRESS && !!wrappedNativeTokenAddress) {
        zapRoute.push({
          ...getUnwrapTx(chainId, 0n),
          tokens: [{ token: wrappedNativeTokenAddress, index: 4 }]
        })
      } else if (
        outputTokenInfo.isCurveLp &&
        !!outputTokenInfo.lpToken?.bestCurveInputTokenAddress &&
        (!outputTokenInfo.beefyVault ||
          lower(outputTokenInfo.beefyVault.want) !== lower(swapInputToken.address))
      ) {
        zapRoute.push({
          ...getCurveAddLiquidityTx(outputTokenInfo.lpToken.address, [0n, 0n], 0n),
          tokens: [
            outputTokenInfo.lpToken.bestCurveInputTokenAddress ===
            outputTokenInfo.lpToken.token0.address
              ? { token: outputTokenInfo.lpToken.token0.address, index: 4 }
              : { token: outputTokenInfo.lpToken.token1.address, index: 36 }
          ]
        })
      } else if (
        outputTokenInfo.isVelodromeLp &&
        !!outputTokenInfo.lpToken &&
        !!velodromeRouterAddress &&
        (!outputTokenInfo.beefyVault ||
          lower(outputTokenInfo.beefyVault.want) !== lower(swapInputToken.address))
      ) {
        const halfAmount = {
          expected: swapInputToken.amount / 2n,
          min: calculatePercentageOfBigInt(swapInputToken.amount / 2n, 0.99)
        }

        zapRoute.push({
          ...getVelodromeAddLiquidityTx(
            velodromeRouterAddress,
            {
              address: outputTokenInfo.lpToken.token0.address,
              amount: firstSwapTx?.amountOut ?? halfAmount
            },
            {
              address: outputTokenInfo.lpToken.token1.address,
              amount: secondSwapTx?.amountOut ?? halfAmount
            },
            zapRouterAddress
          ),
          tokens: [
            { token: outputTokenInfo.lpToken.token0.address, index: 100 },
            { token: outputTokenInfo.lpToken.token1.address, index: 132 }
          ]
        })
      }

      if (!!outputTokenInfo.vaultToken && !!outputTokenInfo.exchangeRate) {
        zapRoute.push({
          ...getDepositTx(outputToken.address, zapRouterAddress),
          tokens: [{ token: outputTokenInfo.vaultToken.address, index: 4 }]
        })
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
    outputToken,
    userAddress,
    inputTokenInfo,
    outputTokenInfo,
    swapInputToken,
    swapOutputTokens,
    firstSwapTx,
    secondSwapTx,
    amountOut,
    isFetched
  ])

  return { zapArgs, amountOut, isFetched, isFetching }
}
