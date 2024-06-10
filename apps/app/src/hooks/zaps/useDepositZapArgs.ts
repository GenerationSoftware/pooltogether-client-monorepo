import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVaults,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Mutable } from '@shared/types'
import { getAssetsFromShares, lower, NETWORK, WRAPPED_NATIVE_ASSETS } from '@shared/utilities'
import { useMemo } from 'react'
import {
  getLpSwapAmountOut,
  getLpSwapZapRoute,
  getSimpleAmountOut,
  getSimpleZapRoute,
  getSwapAmountOut,
  getSwapZapRoute,
  isDolphinAddress
} from 'src/zapUtils'
import { Address, ContractFunctionArgs, zeroAddress } from 'viem'
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

  const { address: userAddress } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)

  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { data: isLpSwapTxsNecessary, isFetched: isFetchedVaultTokenVelodromeLp } =
    useIsVelodromeLp(vaultToken!)

  const { data: lpVaultToken, isFetched: isFetchedLpVaultToken } = useLpToken(vaultToken!, {
    enabled: isLpSwapTxsNecessary ?? false
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

  const swapInputTokenAddress = isDolphinAddress(inputToken?.address)
    ? wrappedNativeTokenAddress!
    : !!inputVault
    ? inputVaultToken?.address
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
    : inputToken?.amount ?? 0n

  const isSwapTxNecessary =
    !!vaultToken &&
    !!swapInputTokenAddress &&
    lower(vaultToken.address) !== lower(swapInputTokenAddress) &&
    isFetchedVaultTokenVelodromeLp &&
    !isLpSwapTxsNecessary

  const isFirstLpSwapTxNecessary =
    isFetchedVaultTokenVelodromeLp &&
    !!isLpSwapTxsNecessary &&
    !!swapInputTokenAddress &&
    isFetchedLpVaultToken &&
    !!lpVaultToken?.token0?.address &&
    lower(swapInputTokenAddress) !== lower(lpVaultToken.token0.address)

  const isSecondLpSwapTxNecessary =
    isFetchedVaultTokenVelodromeLp &&
    !!isLpSwapTxsNecessary &&
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
      address: swapInputTokenAddress!,
      decimals: swapInputTokenDecimals,
      amount: swapInputTokenAmount
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
          return getSwapAmountOut(swapTx, exchangeRate, vaultToken.decimals)
        }
      } else if (isLpSwapTxsNecessary) {
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
      } else {
        return getSimpleAmountOut(
          {
            address: swapInputTokenAddress,
            decimals: swapInputTokenDecimals,
            amount: swapInputTokenAmount
          },
          exchangeRate,
          vaultToken.decimals
        )
      }
    }
  }, [
    swapInputTokenAddress,
    swapInputTokenDecimals,
    swapInputTokenAmount,
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
    isFetchedVaultTokenVelodromeLp &&
    (!isSwapTxNecessary || (isFetchedSwapTx && !!swapTx)) &&
    (!isLpSwapTxsNecessary || (isFetchedLpVaultToken && !!lpVaultToken)) &&
    (!isFirstLpSwapTxNecessary || (isFetchedFirstLpSwapTx && !!firstLpSwapTx)) &&
    (!isSecondLpSwapTxNecessary || (isFetchedSecondLpSwapTx && !!secondLpSwapTx)) &&
    !!amountOut &&
    (!inputVault ||
      (isFetchedInputVaultToken &&
        !!inputVaultToken &&
        isFetchedInputVaultExchangeRate &&
        !!inputVaultExchangeRate))

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

      let zapRoute: ZapRoute = []

      if (!!swapTx) {
        zapRoute = getSwapZapRoute(inputToken, vault, swapTx, vaultToken.address, {
          redeem:
            !!inputVaultToken && !!inputVaultExchangeRate
              ? { asset: inputVaultToken, exchangeRate: inputVaultExchangeRate }
              : undefined
        })
      } else if (!!lpVaultToken) {
        if (!!firstLpSwapTx) {
          addZapOutput({ token: lpVaultToken.token0.address, minOutputAmount: 0n })
        }

        if (!!secondLpSwapTx) {
          addZapOutput({ token: lpVaultToken.token1.address, minOutputAmount: 0n })
        }

        zapRoute = getLpSwapZapRoute(
          inputToken,
          vault,
          lpVaultToken,
          firstLpSwapTx,
          secondLpSwapTx,
          vaultToken.address,
          {
            redeem:
              !!inputVaultToken && !!inputVaultExchangeRate
                ? { asset: inputVaultToken, exchangeRate: inputVaultExchangeRate }
                : undefined
          }
        )
      } else {
        zapRoute = getSimpleZapRoute(inputToken, vault, vaultToken.address, {
          redeem: !!inputVaultExchangeRate ? { exchangeRate: inputVaultExchangeRate } : undefined
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
    lpVaultToken,
    inputVaultToken,
    inputVaultExchangeRate,
    swapTx,
    firstLpSwapTx,
    secondLpSwapTx,
    amountOut,
    isFetched
  ])

  return { zapArgs, amountOut, isFetched, isFetching }
}
