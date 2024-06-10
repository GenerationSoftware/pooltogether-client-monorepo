import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Mutable } from '@shared/types'
import {
  calculatePercentageOfBigInt,
  divideBigInts,
  getSecondsSinceEpoch,
  getSharesFromAssets,
  lower,
  NETWORK,
  vaultABI,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { useMemo } from 'react'
import { isDolphinAddress } from 'src/utils'
import { Address, ContractFunctionArgs, encodeFunctionData, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { VELODROME_ADDRESSES, ZAP_SETTINGS } from '@constants/config'
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
            token0AmountOut.min = calculatePercentageOfBigInt(inputToken.amount / 2n, 0.99)
          }

          if (isSecondLpSwapTxNecessary) {
            token1AmountOut.expected = secondLpSwapTx!.amountOut.expected
            token1AmountOut.min = secondLpSwapTx!.amountOut.min
          } else {
            token1AmountOut.expected = inputToken.amount / 2n
            token1AmountOut.min = calculatePercentageOfBigInt(inputToken.amount / 2n, 0.99)
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

  const zapArgs = useMemo((): [ZapConfig, ZapRoute] | undefined => {
    if (isFetched) {
      const zapInputs: Mutable<ZapConfig['inputs']> = []
      const zapOutputs: Mutable<ZapConfig['outputs']> = [
        { token: vault.address, minOutputAmount: amountOut.min },
        { token: vaultToken.address, minOutputAmount: 0n }
      ]

      const addZapInput = (newInput: (typeof zapInputs)[number]) => {
        const existingInputIndex = zapInputs.findIndex(
          (input) => lower(input.token) === lower(newInput.token)
        )
        if (existingInputIndex === -1) {
          zapInputs.push(newInput)
        } else if (zapInputs[existingInputIndex].amount !== newInput.amount) {
          zapInputs[existingInputIndex].amount = newInput.amount
        }
      }
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

      let zapRoute: ZapRoute = [{ ...depositTx, tokens: [{ token: vaultToken.address, index: 4 }] }]

      if (isDolphinAddress(inputToken.address)) {
        addZapInput({ token: zeroAddress, amount: inputToken.amount })
        addZapOutput({ token: zeroAddress, minOutputAmount: 0n })

        if (!!swapTx && !!wrappedNativeTokenAddress) {
          addZapOutput({ token: wrappedNativeTokenAddress, minOutputAmount: 0n })

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
        } else if (!!lpVaultToken && !!wrappedNativeTokenAddress) {
          addZapOutput({ token: wrappedNativeTokenAddress, minOutputAmount: 0n })

          if (!!firstLpSwapTx && !!secondLpSwapTx) {
            addZapOutput({ token: lpVaultToken.token0.address, minOutputAmount: 0n })
            addZapOutput({ token: lpVaultToken.token1.address, minOutputAmount: 0n })

            // Wrap ETH -> Swap half for token0 -> Swap half for token1 -> Add liquidity -> Deposit
            zapRoute = [
              {
                ...getWrapTx(vault.chainId, inputToken.amount),
                tokens: [{ token: zeroAddress, index: -1 }]
              },
              {
                ...getArbitraryProxyTx(firstLpSwapTx.allowanceProxy),
                tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
              },
              {
                ...firstLpSwapTx.tx,
                tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
              },
              {
                ...getArbitraryProxyTx(secondLpSwapTx.allowanceProxy), // TODO: if this is the same address could save some gas here
                tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
              },
              {
                ...secondLpSwapTx.tx,
                tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
              },
              {
                ...getVelodromeAddLiquidityTx(
                  VELODROME_ADDRESSES[vault.chainId]?.router,
                  { address: lpVaultToken.token0.address, amount: firstLpSwapTx.amountOut },
                  { address: lpVaultToken.token1.address, amount: secondLpSwapTx.amountOut },
                  zapRouterAddress!
                ),
                tokens: [
                  { token: lpVaultToken.token0.address, index: 100 },
                  { token: lpVaultToken.token1.address, index: 132 }
                ]
              },
              ...zapRoute
            ]
          } else if (!!firstLpSwapTx) {
            addZapOutput({ token: lpVaultToken.token0.address, minOutputAmount: 0n })

            // Wrap ETH -> Swap half for token0 -> Add liquidity -> Deposit
            zapRoute = [
              {
                ...getWrapTx(vault.chainId, inputToken.amount),
                tokens: [{ token: zeroAddress, index: -1 }]
              },
              {
                ...getArbitraryProxyTx(firstLpSwapTx.allowanceProxy),
                tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
              },
              {
                ...firstLpSwapTx.tx,
                tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
              },
              {
                ...getVelodromeAddLiquidityTx(
                  VELODROME_ADDRESSES[vault.chainId]?.router,
                  { address: lpVaultToken.token0.address, amount: firstLpSwapTx.amountOut },
                  {
                    address: lpVaultToken.token1.address,
                    amount: {
                      expected: inputToken.amount / 2n,
                      min: calculatePercentageOfBigInt(inputToken.amount / 2n, 0.99)
                    }
                  },
                  zapRouterAddress!
                ),
                tokens: [
                  { token: lpVaultToken.token0.address, index: 100 },
                  { token: lpVaultToken.token1.address, index: 132 }
                ]
              },
              ...zapRoute
            ]
          } else if (!!secondLpSwapTx) {
            addZapOutput({ token: lpVaultToken.token1.address, minOutputAmount: 0n })

            // Wrap ETH -> Swap half for token1 -> Add liquidity -> Deposit
            zapRoute = [
              {
                ...getWrapTx(vault.chainId, inputToken.amount),
                tokens: [{ token: zeroAddress, index: -1 }]
              },
              {
                ...getArbitraryProxyTx(secondLpSwapTx.allowanceProxy),
                tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
              },
              {
                ...secondLpSwapTx.tx,
                tokens: [{ token: wrappedNativeTokenAddress, index: -1 }]
              },
              {
                ...getVelodromeAddLiquidityTx(
                  VELODROME_ADDRESSES[vault.chainId]?.router,
                  {
                    address: lpVaultToken.token0.address,
                    amount: {
                      expected: inputToken.amount / 2n,
                      min: calculatePercentageOfBigInt(inputToken.amount / 2n, 0.99)
                    }
                  },
                  { address: lpVaultToken.token1.address, amount: secondLpSwapTx.amountOut },
                  zapRouterAddress!
                ),
                tokens: [
                  { token: lpVaultToken.token0.address, index: 100 },
                  { token: lpVaultToken.token1.address, index: 132 }
                ]
              },
              ...zapRoute
            ]
          }
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
        addZapInput({ token: inputToken.address, amount: inputToken.amount })
        addZapOutput({ token: inputToken.address, minOutputAmount: 0n })

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
        } else if (!!lpVaultToken) {
          if (!!firstLpSwapTx && !!secondLpSwapTx) {
            addZapOutput({ token: lpVaultToken.token0.address, minOutputAmount: 0n })
            addZapOutput({ token: lpVaultToken.token1.address, minOutputAmount: 0n })

            // Swap half for token0 -> Swap half for token1 -> Add liquidity -> Deposit
            zapRoute = [
              {
                ...getArbitraryProxyTx(firstLpSwapTx.allowanceProxy),
                tokens: [{ token: inputToken.address, index: -1 }]
              },
              {
                ...firstLpSwapTx.tx,
                tokens: [{ token: inputToken.address, index: -1 }]
              },
              {
                ...getArbitraryProxyTx(secondLpSwapTx.allowanceProxy), // TODO: if this is the same address could save some gas here
                tokens: [{ token: inputToken.address, index: -1 }]
              },
              {
                ...secondLpSwapTx.tx,
                tokens: [{ token: inputToken.address, index: -1 }]
              },
              {
                ...getVelodromeAddLiquidityTx(
                  VELODROME_ADDRESSES[vault.chainId]?.router,
                  { address: lpVaultToken.token0.address, amount: firstLpSwapTx.amountOut },
                  { address: lpVaultToken.token1.address, amount: secondLpSwapTx.amountOut },
                  zapRouterAddress!
                ),
                tokens: [
                  { token: lpVaultToken.token0.address, index: 100 },
                  { token: lpVaultToken.token1.address, index: 132 }
                ]
              },
              ...zapRoute
            ]
          } else if (!!firstLpSwapTx) {
            addZapOutput({ token: lpVaultToken.token0.address, minOutputAmount: 0n })

            // Swap half for token0 -> Add liquidity -> Deposit
            zapRoute = [
              {
                ...getArbitraryProxyTx(firstLpSwapTx.allowanceProxy),
                tokens: [{ token: inputToken.address, index: -1 }]
              },
              {
                ...firstLpSwapTx.tx,
                tokens: [{ token: inputToken.address, index: -1 }]
              },
              {
                ...getVelodromeAddLiquidityTx(
                  VELODROME_ADDRESSES[vault.chainId]?.router,
                  { address: lpVaultToken.token0.address, amount: firstLpSwapTx.amountOut },
                  {
                    address: lpVaultToken.token1.address,
                    amount: {
                      expected: inputToken.amount / 2n,
                      min: calculatePercentageOfBigInt(inputToken.amount / 2n, 0.99)
                    }
                  },
                  zapRouterAddress!
                ),
                tokens: [
                  { token: lpVaultToken.token0.address, index: 100 },
                  { token: lpVaultToken.token1.address, index: 132 }
                ]
              },
              ...zapRoute
            ]
          } else if (!!secondLpSwapTx) {
            addZapOutput({ token: lpVaultToken.token1.address, minOutputAmount: 0n })

            // Swap half for token1 -> Add liquidity -> Deposit
            zapRoute = [
              {
                ...getArbitraryProxyTx(secondLpSwapTx.allowanceProxy),
                tokens: [{ token: inputToken.address, index: -1 }]
              },
              {
                ...secondLpSwapTx.tx,
                tokens: [{ token: inputToken.address, index: -1 }]
              },
              {
                ...getVelodromeAddLiquidityTx(
                  VELODROME_ADDRESSES[vault.chainId]?.router,
                  {
                    address: lpVaultToken.token0.address,
                    amount: {
                      expected: inputToken.amount / 2n,
                      min: calculatePercentageOfBigInt(inputToken.amount / 2n, 0.99)
                    }
                  },
                  { address: lpVaultToken.token1.address, amount: secondLpSwapTx.amountOut },
                  zapRouterAddress!
                ),
                tokens: [
                  { token: lpVaultToken.token0.address, index: 100 },
                  { token: lpVaultToken.token1.address, index: 132 }
                ]
              },
              ...zapRoute
            ]
          }
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
    firstLpSwapTx,
    secondLpSwapTx,
    amountOut,
    depositTx,
    isFetched
  ])

  return { zapArgs, amountOut, isFetched, isFetching }
}

/**
 * Returns a `deposit` call to the network's wrapped native token contract
 * @param chainId the chain ID of the network to make the transaction in
 * @param amount the amount of native tokens to wrap
 * @returns
 */
const getWrapTx = (chainId: number, amount: bigint) => {
  return {
    target: WRAPPED_NATIVE_ASSETS[chainId as NETWORK]!,
    value: amount,
    data: encodeFunctionData({
      abi: [
        {
          constant: false,
          inputs: [],
          name: 'deposit',
          outputs: [],
          payable: true,
          stateMutability: 'payable',
          type: 'function'
        }
      ],
      functionName: 'deposit'
    })
  }
}

/**
 * Returns an arbitrary call to the swap router's token proxy, in order for the zap contract to make an allowance to it
 * @param proxyAddress the address of the swap router's token proxy
 * @returns
 */
const getArbitraryProxyTx = (proxyAddress: Address) => {
  return {
    target: proxyAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: [
        {
          inputs: [],
          name: 'owner',
          outputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function'
        }
      ],
      functionName: 'owner'
    })
  }
}

/**
 * Returns an `addLiquidity` call to a velodrome-like router contract
 * @param routerAddress the address of the router contract
 * @returns
 */
const getVelodromeAddLiquidityTx = (
  routerAddress: Address,
  tokenA: { address: Address; amount: { expected: bigint; min: bigint } },
  tokenB: { address: Address; amount: { expected: bigint; min: bigint } },
  to: Address,
  options?: { stable?: boolean; deadline?: bigint }
) => {
  return {
    target: routerAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: [
        {
          inputs: [
            { internalType: 'address', name: 'tokenA', type: 'address' },
            { internalType: 'address', name: 'tokenB', type: 'address' },
            { internalType: 'bool', name: 'stable', type: 'bool' },
            { internalType: 'uint256', name: 'amountADesired', type: 'uint256' },
            { internalType: 'uint256', name: 'amountBDesired', type: 'uint256' },
            { internalType: 'uint256', name: 'amountAMin', type: 'uint256' },
            { internalType: 'uint256', name: 'amountBMin', type: 'uint256' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' }
          ],
          name: 'addLiquidity',
          outputs: [
            { internalType: 'uint256', name: 'amountA', type: 'uint256' },
            { internalType: 'uint256', name: 'amountB', type: 'uint256' },
            { internalType: 'uint256', name: 'liquidity', type: 'uint256' }
          ],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'addLiquidity',
      args: [
        tokenA.address,
        tokenB.address,
        options?.stable ?? false,
        tokenA.amount.expected,
        tokenB.amount.expected,
        tokenA.amount.min,
        tokenB.amount.min,
        to,
        options?.deadline ?? BigInt(getSecondsSinceEpoch() + 300)
      ]
    })
  }
}
