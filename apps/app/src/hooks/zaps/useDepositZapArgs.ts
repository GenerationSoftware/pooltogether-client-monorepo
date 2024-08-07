import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVaults,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Mutable } from '@shared/types'
import {
  calculatePercentageOfBigInt,
  getAssetsFromShares,
  getSharesFromAssets,
  lower,
  NETWORK,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { useMemo } from 'react'
import {
  getCurveLpZapInRoute,
  getLpSwapAmountOut,
  getLpSwapZapInRoute,
  getSimpleAmountOut,
  getSimpleZapInRoute,
  getSwapZapInRoute,
  isDolphinAddress
} from 'src/zapUtils'
import { Address, ContractFunctionArgs, formatUnits, parseUnits, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ROCKETPOOL_ADDRESSES, ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useBeefyVault } from './useBeefyVault'
import { useCurveAddLiquidityOutput } from './useCurveAddLiquidityOutput'
import { useIsCurveLp } from './useIsCurveLp'
import { useIsVelodromeLp } from './useIsVelodromeLp'
import { useLpToken } from './useLpToken'
import { useSendDepositZapTransaction } from './useSendDepositZapTransaction'
import { useSwapTx } from './useSwapTx'
import { useWRETHExchangeRate } from './useWRETHExchangeRate'

type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[0]
type ZapRoute = ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]

/**
 * Returns deposit zap args
 * @param data input token, vault
 * @returns
 */
export const useDepositZapArgs = ({
  inputToken,
  vault
}: {
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0']
  vault: Vault
}) => {
  const zapRouterAddress = ZAP_SETTINGS[vault?.chainId]?.zapRouter as Address | undefined
  const wrappedNativeTokenAddress = WRAPPED_NATIVE_ASSETS[vault?.chainId as NETWORK]
  const rocketPoolAddresses = ROCKETPOOL_ADDRESSES[vault?.chainId]

  const { address: userAddress } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)

  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { data: isVelodromeLp, isFetched: isFetchedIsVelodromeLp } = useIsVelodromeLp(vaultToken!)
  const { data: isCurveLp, isFetched: isFetchedIsCurveLp } = useIsCurveLp(vaultToken!)

  const { data: lpVaultToken, isFetched: isFetchedLpVaultToken } = useLpToken(vaultToken!, {
    enabled: (isVelodromeLp || isCurveLp) ?? false
  })

  const { vaults: _vaults } = useSelectedVaults()
  const vaults = Object.values(_vaults.vaults).filter((v) => v.chainId === vault?.chainId)
  const inputVault =
    !!inputToken?.address && vaults.find((v) => lower(v.address) === lower(inputToken.address))

  const { data: inputVaultToken, isFetched: isFetchedInputVaultToken } = useVaultTokenData(
    inputVault as Vault
  )
  const { data: inputVaultExchangeRate, isFetched: isFetchedInputVaultExchangeRate } =
    useVaultExchangeRate(inputVault as Vault)

  const { data: beefyVault, isFetched: isFetchedBeefyVault } = useBeefyVault(vault)
  const isInputTokenBeefyVault =
    !!beefyVault && !!inputToken?.address && lower(inputToken.address) === lower(beefyVault.address)

  const { data: wrETHExchangeRate } = useWRETHExchangeRate(vault?.chainId)

  const swapInputTokenAddress = isDolphinAddress(inputToken?.address)
    ? wrappedNativeTokenAddress!
    : !!inputVault
    ? inputVaultToken?.address
    : isInputTokenBeefyVault
    ? beefyVault.want
    : inputToken?.address

  const swapInputTokenDecimals = inputVaultToken?.decimals ?? inputToken?.decimals

  const swapInputTokenAmount = !!inputVault
    ? !!inputVaultToken && !!inputVaultExchangeRate
      ? getAssetsFromShares(
          inputToken?.amount ?? 0n,
          inputVaultExchangeRate,
          inputVaultToken.decimals
        )
      : 0n
    : isInputTokenBeefyVault
    ? getAssetsFromShares(
        inputToken?.amount ?? 0n,
        beefyVault.pricePerFullShare,
        inputToken.decimals
      )
    : inputToken?.amount ?? 0n

  const isMintingWRETHNecessary =
    !!vaultToken && !!rocketPoolAddresses && lower(vaultToken.address) === rocketPoolAddresses.WRETH
  const swapOutputToken: Parameters<typeof useSwapTx>[0]['to'] = isMintingWRETHNecessary
    ? { address: rocketPoolAddresses.RETH, decimals: 18 }
    : isCurveLp && !!lpVaultToken?.token0.address
    ? lpVaultToken.bestCurveInputTokenAddress === lpVaultToken.token0.address
      ? { address: lpVaultToken.token0.address, decimals: lpVaultToken.token0.decimals }
      : { address: lpVaultToken.token1.address, decimals: lpVaultToken.token1.decimals }
    : { address: vaultToken?.address!, decimals: vaultToken?.decimals! }

  const isSwapTxNecessary =
    !!vaultToken &&
    !!swapInputTokenAddress &&
    lower(vaultToken.address) !== lower(swapInputTokenAddress) &&
    isFetchedIsVelodromeLp &&
    !isVelodromeLp &&
    isFetchedIsCurveLp &&
    (!isCurveLp ||
      (isFetchedLpVaultToken &&
        !!lpVaultToken?.token0?.address &&
        !!lpVaultToken.token1?.address &&
        lower(swapInputTokenAddress) !== lower(lpVaultToken.token0.address) &&
        lower(swapInputTokenAddress) !== lower(lpVaultToken.token1.address))) &&
    (!isMintingWRETHNecessary || lower(swapInputTokenAddress) !== rocketPoolAddresses.RETH)

  const isFirstLpSwapTxNecessary =
    !!vaultToken &&
    !!swapInputTokenAddress &&
    lower(vaultToken.address) !== lower(swapInputTokenAddress) &&
    isFetchedIsVelodromeLp &&
    !!isVelodromeLp &&
    !!swapInputTokenAddress &&
    isFetchedLpVaultToken &&
    !!lpVaultToken?.token0?.address &&
    lower(swapInputTokenAddress) !== lower(lpVaultToken.token0.address) &&
    isFetchedBeefyVault &&
    !isInputTokenBeefyVault

  const isSecondLpSwapTxNecessary =
    !!vaultToken &&
    !!swapInputTokenAddress &&
    lower(vaultToken.address) !== lower(swapInputTokenAddress) &&
    isFetchedIsVelodromeLp &&
    !!isVelodromeLp &&
    !!swapInputTokenAddress &&
    isFetchedLpVaultToken &&
    !!lpVaultToken?.token1?.address &&
    lower(swapInputTokenAddress) !== lower(lpVaultToken.token1.address) &&
    isFetchedBeefyVault &&
    !isInputTokenBeefyVault

  const {
    data: swapTx,
    isFetched: isFetchedSwapTx,
    isFetching: isFetchingSwapTx
  } = useSwapTx({
    chainId: vault?.chainId,
    from: {
      address: swapInputTokenAddress!,
      decimals: swapInputTokenDecimals,
      amount: swapInputTokenAmount
    },
    to: swapOutputToken,
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
      address: swapInputTokenAddress!,
      decimals: swapInputTokenDecimals,
      amount: swapInputTokenAmount / 2n
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
      address: swapInputTokenAddress!,
      decimals: swapInputTokenDecimals,
      amount: swapInputTokenAmount / 2n
    },
    to: { address: lpVaultToken?.token1?.address!, decimals: lpVaultToken?.token1?.decimals! },
    userAddress: zapRouterAddress!,
    options: { enabled: isSecondLpSwapTxNecessary }
  })

  const curveAddLiquidityInput =
    isCurveLp && !!inputToken?.amount && inputToken.decimals !== undefined && !!lpVaultToken
      ? swapTx?.amountOut.expected ??
        parseUnits(
          formatUnits(inputToken.amount ?? 0n, inputToken.decimals),
          lpVaultToken.token0.decimals
        )
      : 0n
  const { data: curveAddLiquidityOutput, isFetched: isFetchedCurveAddLiquidityOutput } =
    useCurveAddLiquidityOutput(
      lpVaultToken?.chainId!,
      lpVaultToken?.address!,
      (!!curveAddLiquidityInput
        ? lpVaultToken!.bestCurveInputTokenAddress === lpVaultToken!.token0.address
          ? [curveAddLiquidityInput, 0n]
          : [0n, curveAddLiquidityInput]
        : undefined)!,
      { enabled: isCurveLp && (!isSwapTxNecessary || !!swapTx) && !!curveAddLiquidityInput }
    )

  const amountOut = useMemo(() => {
    if (
      !!swapInputTokenAddress &&
      swapInputTokenDecimals !== undefined &&
      !!swapInputTokenAmount &&
      !!vaultToken &&
      !!exchangeRate
    ) {
      if (isSwapTxNecessary) {
        if (!!swapTx) {
          if (isMintingWRETHNecessary) {
            if (!!wrETHExchangeRate) {
              return {
                expected: getSharesFromAssets(
                  getAssetsFromShares(swapTx.amountOut.expected, wrETHExchangeRate, 18),
                  exchangeRate,
                  vaultToken.decimals
                ),
                min: getSharesFromAssets(
                  getAssetsFromShares(swapTx.amountOut.min, wrETHExchangeRate, 18),
                  exchangeRate,
                  vaultToken.decimals
                )
              }
            }
          } else if (isCurveLp) {
            if (!!curveAddLiquidityOutput) {
              const expected = getSharesFromAssets(
                curveAddLiquidityOutput,
                exchangeRate,
                vaultToken.decimals
              )
              return { expected, min: calculatePercentageOfBigInt(expected, 0.99) }
            }
          } else {
            return {
              expected: getSharesFromAssets(
                swapTx.amountOut.expected,
                exchangeRate,
                vaultToken.decimals
              ),
              min: getSharesFromAssets(swapTx.amountOut.min, exchangeRate, vaultToken.decimals)
            }
          }
        }
      } else if (isFirstLpSwapTxNecessary || isSecondLpSwapTxNecessary) {
        if (
          !!lpVaultToken &&
          (!isFirstLpSwapTxNecessary || !!firstLpSwapTx) &&
          (!isSecondLpSwapTxNecessary || !!secondLpSwapTx)
        ) {
          return getLpSwapAmountOut(
            {
              address: swapInputTokenAddress,
              decimals: swapInputTokenDecimals,
              amount: swapInputTokenAmount
            },
            lpVaultToken,
            { tx: firstLpSwapTx, isNecessary: isFirstLpSwapTxNecessary },
            { tx: secondLpSwapTx, isNecessary: isSecondLpSwapTxNecessary }
          )
        }
      } else if (isMintingWRETHNecessary) {
        if (!!wrETHExchangeRate) {
          return getSimpleAmountOut(
            getAssetsFromShares(swapInputTokenAmount, wrETHExchangeRate, 18),
            exchangeRate,
            vaultToken.decimals
          )
        }
      } else if (isCurveLp && !isInputTokenBeefyVault) {
        if (!!curveAddLiquidityOutput) {
          const expected = getSharesFromAssets(
            curveAddLiquidityOutput,
            exchangeRate,
            vaultToken.decimals
          )
          return { expected, min: calculatePercentageOfBigInt(expected, 0.99) }
        }
      } else {
        return getSimpleAmountOut(swapInputTokenAmount, exchangeRate, vaultToken.decimals)
      }
    }
  }, [
    swapInputTokenAddress,
    swapInputTokenDecimals,
    swapInputTokenAmount,
    vaultToken,
    exchangeRate,
    isCurveLp,
    isSwapTxNecessary,
    isFirstLpSwapTxNecessary,
    isSecondLpSwapTxNecessary,
    swapTx,
    firstLpSwapTx,
    secondLpSwapTx,
    lpVaultToken,
    isInputTokenBeefyVault,
    wrETHExchangeRate,
    curveAddLiquidityOutput
  ])

  const isFetched =
    !!inputToken &&
    !!vault &&
    !!zapRouterAddress &&
    !!userAddress &&
    isFetchedVaultToken &&
    !!vaultToken &&
    isFetchedExchangeRate &&
    !!exchangeRate &&
    !!swapInputTokenAddress &&
    swapInputTokenDecimals !== undefined &&
    !!swapInputTokenAmount &&
    isFetchedIsVelodromeLp &&
    isFetchedIsCurveLp &&
    (!isSwapTxNecessary || (isFetchedSwapTx && !!swapTx)) &&
    (!isVelodromeLp || (isFetchedLpVaultToken && !!lpVaultToken)) &&
    (!isCurveLp ||
      (isFetchedLpVaultToken &&
        !!lpVaultToken &&
        isFetchedCurveAddLiquidityOutput &&
        !!curveAddLiquidityOutput)) &&
    (!isFirstLpSwapTxNecessary || (isFetchedFirstLpSwapTx && !!firstLpSwapTx)) &&
    (!isSecondLpSwapTxNecessary || (isFetchedSecondLpSwapTx && !!secondLpSwapTx)) &&
    !!amountOut &&
    (!inputVault ||
      (isFetchedInputVaultToken &&
        !!inputVaultToken &&
        isFetchedInputVaultExchangeRate &&
        !!inputVaultExchangeRate)) &&
    isFetchedBeefyVault &&
    (!isMintingWRETHNecessary || !!wrETHExchangeRate)

  const isFetching =
    !isFetched && (isFetchingSwapTx || isFetchingFirstLpSwapTx || isFetchingSecondLpSwapTx)

  const zapArgs = useMemo((): [ZapConfig, ZapRoute] | undefined => {
    if (isFetched) {
      const zapInputs: ZapConfig['inputs'] = [
        {
          token: isDolphinAddress(inputToken.address) ? zeroAddress : inputToken.address,
          amount: inputToken.amount
        }
      ]
      const zapOutputs: Mutable<ZapConfig['outputs']> = [
        {
          token: isDolphinAddress(inputToken.address) ? zeroAddress : inputToken.address,
          minOutputAmount: 0n
        },
        { token: vaultToken.address, minOutputAmount: 0n },
        { token: vault.address, minOutputAmount: amountOut.min }
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

      if (isDolphinAddress(inputToken.address) && !!wrappedNativeTokenAddress) {
        addZapOutput({ token: wrappedNativeTokenAddress, minOutputAmount: 0n })
      }

      if (!!inputVaultToken) {
        addZapOutput({ token: inputVaultToken.address, minOutputAmount: 0n })
      }

      if (isMintingWRETHNecessary) {
        addZapOutput({ token: rocketPoolAddresses.RETH, minOutputAmount: 0n })
      }

      let zapRoute: ZapRoute = []

      if (!!swapTx) {
        addZapOutput({ token: swapOutputToken.address, minOutputAmount: 0n })

        if (isCurveLp && !!lpVaultToken) {
          zapRoute = getCurveLpZapInRoute(inputToken, vault, lpVaultToken, swapTx, {
            redeem:
              !!inputVaultToken && !!inputVaultExchangeRate
                ? { asset: inputVaultToken, exchangeRate: inputVaultExchangeRate }
                : undefined
          })
        } else {
          zapRoute = getSwapZapInRoute(inputToken, vault, swapTx, vaultToken.address, {
            redeem:
              !!inputVaultToken && !!inputVaultExchangeRate
                ? { asset: inputVaultToken, exchangeRate: inputVaultExchangeRate }
                : undefined
          })
        }
      } else if ((!!firstLpSwapTx || !!secondLpSwapTx) && !!lpVaultToken) {
        if (!!firstLpSwapTx) {
          addZapOutput({ token: lpVaultToken.token0.address, minOutputAmount: 0n })
        }

        if (!!secondLpSwapTx) {
          addZapOutput({ token: lpVaultToken.token1.address, minOutputAmount: 0n })
        }

        zapRoute = getLpSwapZapInRoute(
          inputToken,
          vault,
          lpVaultToken,
          firstLpSwapTx,
          secondLpSwapTx,
          {
            redeem:
              !!inputVaultToken && !!inputVaultExchangeRate
                ? { asset: inputVaultToken, exchangeRate: inputVaultExchangeRate }
                : undefined
          }
        )
      } else if (isCurveLp && !!lpVaultToken && !isInputTokenBeefyVault) {
        zapRoute = getCurveLpZapInRoute(inputToken, vault, lpVaultToken, undefined, {
          redeem:
            !!inputVaultToken && !!inputVaultExchangeRate
              ? { asset: inputVaultToken, exchangeRate: inputVaultExchangeRate }
              : undefined
        })
      } else {
        zapRoute = getSimpleZapInRoute(inputToken, vault, vaultToken.address, {
          redeem: !!inputVaultExchangeRate ? { exchangeRate: inputVaultExchangeRate } : undefined,
          beefyWithdraw: isInputTokenBeefyVault
            ? { pricePerFullShare: beefyVault.pricePerFullShare }
            : undefined
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
    vault,
    userAddress,
    vaultToken,
    exchangeRate,
    isCurveLp,
    lpVaultToken,
    inputVaultToken,
    inputVaultExchangeRate,
    beefyVault,
    isInputTokenBeefyVault,
    wrETHExchangeRate,
    isMintingWRETHNecessary,
    swapTx,
    firstLpSwapTx,
    secondLpSwapTx,
    amountOut,
    isFetched
  ])

  return { zapArgs, amountOut, isFetched, isFetching }
}
