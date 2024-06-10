import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { Mutable, Token } from '@shared/types'
import {
  calculatePercentageOfBigInt,
  divideBigInts,
  DOLPHIN_ADDRESS,
  getAssetsFromShares,
  getSecondsSinceEpoch,
  getSharesFromAssets,
  lower,
  NETWORK,
  vaultABI,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { Address, ContractFunctionArgs, encodeFunctionData, zeroAddress } from 'viem'
import { VELODROME_ADDRESSES, ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useLpToken } from '@hooks/zaps/useLpToken'
import { useSendDepositZapTransaction } from '@hooks/zaps/useSendDepositZapTransaction'
import { useSwapTx } from '@hooks/zaps/useSwapTx'

export const isDolphinAddress = (address?: Address) =>
  !!address && lower(address) === DOLPHIN_ADDRESS

export const getSwapAmountOut = (
  swapTx: NonNullable<ReturnType<typeof useSwapTx>['data']>,
  exchangeRate: bigint,
  decimals: number
) => {
  return {
    expected: getSharesFromAssets(swapTx.amountOut.expected, exchangeRate, decimals),
    min: getSharesFromAssets(swapTx.amountOut.min, exchangeRate, decimals)
  }
}

export const getLpSwapAmountOut = (
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0'],
  lpVaultToken: NonNullable<ReturnType<typeof useLpToken>['data']>,
  firstLpSwap: { tx: ReturnType<typeof useSwapTx>['data']; isNecessary: boolean },
  secondLpSwap: { tx: ReturnType<typeof useSwapTx>['data']; isNecessary: boolean }
) => {
  const expectedHalfOutput = inputToken.amount / 2n
  const minHalfOutput = calculatePercentageOfBigInt(inputToken.amount / 2n, 0.99)

  const token0AmountOut = firstLpSwap.isNecessary
    ? { expected: firstLpSwap.tx!.amountOut.expected, min: firstLpSwap.tx!.amountOut.min }
    : {
        expected: expectedHalfOutput,
        min: minHalfOutput
      }
  const token1AmountOut = secondLpSwap.isNecessary
    ? { expected: secondLpSwap.tx!.amountOut.expected, min: secondLpSwap.tx!.amountOut.min }
    : {
        expected: expectedHalfOutput,
        min: minHalfOutput
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

export const getSimpleAmountOut = (
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0'],
  exchangeRate: bigint,
  decimals: number
) => {
  const simpleAmountOut = getSharesFromAssets(inputToken.amount, exchangeRate, decimals)

  return {
    expected: simpleAmountOut,
    min: simpleAmountOut
  }
}

export const getWrapTx = (chainId: number, amount: bigint) => {
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

export const getArbitraryProxyTx = (proxyAddress: Address) => {
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

export const getVelodromeAddLiquidityTx = (
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

export const getDepositTx = (vaultAddress: Address, zapRouterAddress: Address) => {
  return {
    target: vaultAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: vaultABI,
      functionName: 'deposit',
      args: [0n, zapRouterAddress]
    })
  }
}

export const getRedeemTx = (
  vaultAddress: Address,
  zapRouterAddress: Address,
  amount: bigint,
  exchangeRate: bigint,
  decimals: number
) => {
  const minAssets = getAssetsFromShares(amount, exchangeRate, decimals)

  return {
    target: vaultAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: vaultABI,
      functionName: 'redeem',
      args: [amount, zapRouterAddress, zapRouterAddress, minAssets]
    })
  }
}

export const getSwapZapRoute = (
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0'],
  vault: Vault,
  swapTx: NonNullable<ReturnType<typeof useSwapTx>['data']>,
  vaultTokenAddress: Address,
  options?: { redeem?: { asset: Token; exchangeRate: bigint } }
) => {
  const route: Mutable<ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]> = []

  const swapInputTokenAddress = isDolphinAddress(inputToken.address)
    ? WRAPPED_NATIVE_ASSETS[vault.chainId as NETWORK]
    : !!options?.redeem
    ? options.redeem.asset.address
    : inputToken.address

  const zapRouterAddress = ZAP_SETTINGS[vault.chainId]?.zapRouter as Address | undefined

  if (!!swapInputTokenAddress && !!zapRouterAddress) {
    if (isDolphinAddress(inputToken.address)) {
      route.push({
        ...getWrapTx(vault.chainId, inputToken.amount),
        tokens: [{ token: zeroAddress, index: -1 }]
      })
    } else if (!!options?.redeem) {
      route.push({
        ...getRedeemTx(
          inputToken.address,
          zapRouterAddress,
          inputToken.amount,
          options.redeem.exchangeRate,
          inputToken.decimals
        ),
        tokens: [{ token: inputToken.address, index: -1 }]
      })
    }

    route.push(
      {
        ...getArbitraryProxyTx(swapTx.allowanceProxy),
        tokens: [{ token: swapInputTokenAddress, index: -1 }]
      },
      {
        ...swapTx.tx,
        tokens: [{ token: swapInputTokenAddress, index: -1 }]
      },
      {
        ...getDepositTx(vault.address, zapRouterAddress),
        tokens: [{ token: vaultTokenAddress, index: 4 }]
      }
    )
  }

  return route
}

export const getLpSwapZapRoute = (
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0'],
  vault: Vault,
  lpVaultToken: NonNullable<ReturnType<typeof useLpToken>['data']>,
  firstLpSwapTx: ReturnType<typeof useSwapTx>['data'],
  secondLpSwapTx: ReturnType<typeof useSwapTx>['data'],
  vaultTokenAddress: Address,
  options?: { redeem?: { asset: Token; exchangeRate: bigint } }
) => {
  const route: Mutable<ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]> = []

  const swapInputTokenAddress = isDolphinAddress(inputToken.address)
    ? WRAPPED_NATIVE_ASSETS[vault.chainId as NETWORK]
    : !!options?.redeem
    ? options.redeem.asset.address
    : inputToken.address

  const zapRouterAddress = ZAP_SETTINGS[vault.chainId]?.zapRouter as Address | undefined

  const velodromeRouterAddress = VELODROME_ADDRESSES[vault.chainId]?.router as Address | undefined

  if (!!swapInputTokenAddress && !!zapRouterAddress && !!velodromeRouterAddress) {
    if (isDolphinAddress(inputToken.address)) {
      route.push({
        ...getWrapTx(vault.chainId, inputToken.amount),
        tokens: [{ token: zeroAddress, index: -1 }]
      })
    } else if (options?.redeem) {
      route.push({
        ...getRedeemTx(
          inputToken.address,
          zapRouterAddress,
          inputToken.amount,
          options.redeem.exchangeRate,
          inputToken.decimals
        ),
        tokens: [{ token: inputToken.address, index: -1 }]
      })
    }

    if (!!firstLpSwapTx) {
      route.push(
        {
          ...getArbitraryProxyTx(firstLpSwapTx.allowanceProxy),
          tokens: [{ token: swapInputTokenAddress, index: -1 }]
        },
        {
          ...firstLpSwapTx.tx,
          tokens: [{ token: swapInputTokenAddress, index: -1 }]
        }
      )
    }

    if (!!secondLpSwapTx) {
      route.push(
        {
          ...getArbitraryProxyTx(secondLpSwapTx.allowanceProxy),
          tokens: [{ token: swapInputTokenAddress, index: -1 }]
        },
        {
          ...secondLpSwapTx.tx,
          tokens: [{ token: swapInputTokenAddress, index: -1 }]
        }
      )
    }

    const halfAmount = {
      expected: inputToken.amount / 2n,
      min: calculatePercentageOfBigInt(inputToken.amount / 2n, 0.99)
    }

    route.push(
      {
        ...getVelodromeAddLiquidityTx(
          velodromeRouterAddress,
          { address: lpVaultToken.token0.address, amount: firstLpSwapTx?.amountOut ?? halfAmount },
          { address: lpVaultToken.token1.address, amount: secondLpSwapTx?.amountOut ?? halfAmount },
          zapRouterAddress
        ),
        tokens: [
          { token: lpVaultToken.token0.address, index: 100 },
          { token: lpVaultToken.token1.address, index: 132 }
        ]
      },
      {
        ...getDepositTx(vault.address, zapRouterAddress),
        tokens: [{ token: vaultTokenAddress, index: 4 }]
      }
    )
  }

  return route
}

export const getSimpleZapRoute = (
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0'],
  vault: Vault,
  vaultTokenAddress: Address,
  options?: { redeem?: { exchangeRate: bigint } }
) => {
  const route: Mutable<ContractFunctionArgs<typeof zapRouterABI, 'payable', 'executeOrder'>[1]> = []

  const zapRouterAddress = ZAP_SETTINGS[vault.chainId]?.zapRouter as Address | undefined

  if (!!zapRouterAddress) {
    if (isDolphinAddress(inputToken.address)) {
      route.push({
        ...getWrapTx(vault.chainId, inputToken.amount),
        tokens: [{ token: zeroAddress, index: -1 }]
      })
    } else if (!!options?.redeem) {
      route.push({
        ...getRedeemTx(
          inputToken.address,
          zapRouterAddress,
          inputToken.amount,
          options.redeem.exchangeRate,
          inputToken.decimals
        ),
        tokens: [{ token: inputToken.address, index: -1 }]
      })
    }

    route.push({
      ...getDepositTx(vault.address, zapRouterAddress),
      tokens: [{ token: vaultTokenAddress, index: 4 }]
    })
  }

  return route
}
