import {
  calculatePercentageOfBigInt,
  divideBigInts,
  getAssetsFromShares,
  getSecondsSinceEpoch,
  NETWORK,
  vaultABI,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { Address, encodeFunctionData } from 'viem'
import { curveLpTokenABI } from '@constants/curveLpTokenABI'
import { useLpToken } from '@hooks/zaps/useLpToken'
import { useSendDepositZapTransaction } from '@hooks/zaps/useSendDepositZapTransaction'
import { useSwapTx } from '@hooks/zaps/useSwapTx'

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

export const getUnwrapTx = (chainId: number, amount: bigint) => {
  return {
    target: WRAPPED_NATIVE_ASSETS[chainId as NETWORK]!,
    value: 0n,
    data: encodeFunctionData({
      abi: [
        {
          constant: false,
          inputs: [{ internalType: 'uint256', name: 'wad', type: 'uint256' }],
          name: 'withdraw',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'withdraw',
      args: [amount]
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

export const getCurveAddLiquidityTx = (
  lpTokenAddress: Address,
  underlyingTokenAmounts: [bigint, bigint],
  minOutput: bigint
) => {
  return {
    target: lpTokenAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: curveLpTokenABI,
      functionName: 'add_liquidity',
      args: [[underlyingTokenAmounts[0], underlyingTokenAmounts[1]], minOutput]
    })
  }
}

export const getBeefyWithdrawTx = (mooTokenAddress: Address, amount: bigint) => {
  return {
    target: mooTokenAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: [
        {
          inputs: [{ internalType: 'uint256', name: '_shares', type: 'uint256' }],
          name: 'withdraw',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'withdraw',
      args: [amount]
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
