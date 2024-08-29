import { TokenWithAmount, TokenWithSupply } from '@shared/types'
import {
  calculatePercentageOfBigInt,
  curveLpTokenABI,
  divideBigInts,
  getSecondsSinceEpoch,
  NETWORK,
  vaultABI,
  WRAPPED_NATIVE_ASSETS
} from '@shared/utilities'
import { Address, encodeFunctionData } from 'viem'

/**
 * Returns the expected amount out for a zap into a prize vault with an underlying LP token
 * @param inputToken the zap's input token
 * @param lpVaultToken the LP token being zapped into
 * @param firstLpSwap swap data for the first token in the LP
 * @param secondLpSwap swap data for the second token in the LP
 * @returns
 */
export const getLpSwapAmountOut = (
  inputToken: { address: Address; decimals: number; amount: bigint },
  lpVaultToken: TokenWithSupply & {
    token0: TokenWithSupply & TokenWithAmount
    token1: TokenWithSupply & TokenWithAmount
  },
  firstLpSwap: {
    tx?: {
      tx: { target: Address; value: bigint; data: `0x${string}` }
      amountOut: { expected: bigint; min: bigint }
      allowanceProxy: Address
    }
    isNecessary: boolean
  },
  secondLpSwap: {
    tx?: {
      tx: { target: Address; value: bigint; data: `0x${string}` }
      amountOut: { expected: bigint; min: bigint }
      allowanceProxy: Address
    }
    isNecessary: boolean
  }
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

/**
 * Returns basic TX data for a `deposit` call on a wrapped native asset contract
 * @param chainId chain ID for the transaction to take place in
 * @param amount the amount of tokens to be wrapped
 * @returns
 */
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

/**
 * Returns basic TX data for a `withdraw` call on a wrapped native asset contract
 * @param chainId chain ID for the transaction to take place in
 * @param amount the amount of tokens to be unwrapped
 * @returns
 */
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

/**
 * Returns basic TX data for a `addLiquidity` call on a velodrome-like LP contract
 * @param routerAddress the velodrome-like router address
 * @param tokenA the first token in the LP
 * @param tokenB the second token in the LP
 * @param to the recipient address of the resulting LP tokens
 * @param options optional settings
 * @returns
 */
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

/**
 * Returns basic TX data for a `add_liquidity` call on a curve LP contract
 * @param lpTokenAddress the curve LP address
 * @param underlyingTokenAmounts the amounts of each token to deposit into the LP
 * @param minOutput the transaction's minimum output
 * @returns
 */
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

/**
 * Returns basic TX data for a `withdraw` call to a Beefy vault contract
 * @param mooTokenAddress the Beefy vault contract to withdraw from
 * @param amount the amount to withdraw
 * @returns
 */
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

/**
 * Returns basic TX data for a `deposit` call to a prize vault
 * @param vaultAddress the prize vault address to deposit into
 * @param reciever the address to receive the resulting shares
 * @returns
 */
export const getDepositTx = (vaultAddress: Address, receiver: Address) => {
  return {
    target: vaultAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: vaultABI,
      functionName: 'deposit',
      args: [0n, receiver]
    })
  }
}

/**
 * Returns basic TX data for a `redeem` call to a prize vault
 * @param vaultAddress the prize vault address to redeem from
 * @param owner the address holding the shares being redeemed
 * @param amount the amount of shares to redeem
 * @param minAssets the minimum amount of assets to receive
 * @param options optional settings
 * @returns
 */
export const getRedeemTx = (
  vaultAddress: Address,
  owner: Address,
  amount: bigint,
  minAssets: bigint,
  options?: { receiver?: Address }
) => {
  return {
    target: vaultAddress,
    value: 0n,
    data: encodeFunctionData({
      abi: vaultABI,
      functionName: 'redeem',
      args: [amount, options?.receiver ?? owner, owner, minAssets]
    })
  }
}
