import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { getSharesFromAssets, lower, vaultABI } from '@shared/utilities'
import { useMemo } from 'react'
import { getArbitraryProxyTx } from 'src/utils'
import { Address, ContractFunctionArgs, encodeFunctionData, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ZAP_SETTINGS } from '@constants/config'
import { zapRouterABI } from '@constants/zapRouterABI'
import { useIsVelodromeLp } from './useIsVelodromeLp'
import { useLpToken } from './useLpToken'
import { useSendDepositZapTransaction } from './useSendDepositZapTransaction'
import { useSwapTx } from './useSwapTx'

type ZapPermit = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[0]
type ZapConfig = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[1]
type ZapRoute = ContractFunctionArgs<typeof zapRouterABI, 'nonpayable', 'executeOrder'>[3]

/**
 * Returns deposit zap with permit args
 * @param data input token, vault, signature, deadline, nonce, enabled
 * @returns
 */
export const useDepositZapWithPermitArgs = ({
  inputToken,
  vault,
  signature,
  deadline,
  nonce,
  enabled
}: {
  inputToken: Parameters<typeof useSendDepositZapTransaction>['0']
  vault: Vault
  signature: `0x${string}`
  deadline: bigint
  nonce: bigint
  enabled?: boolean
}) => {
  const zapRouterAddress = ZAP_SETTINGS[vault?.chainId]?.zapRouterAddress as Address | undefined

  const { address: userAddress } = useAccount()

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault)

  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { data: isLpSwapTxsNecessary, isFetched: isFetchedVaultTokenVelodromeLp } =
    useIsVelodromeLp(vaultToken!)

  const { data: lpVaultToken, isFetched: isFetchedLpVaultToken } = useLpToken(vaultToken!, {
    enabled: isLpSwapTxsNecessary ?? false
  })

  const swapInputToken: Parameters<typeof useSwapTx>['0']['from'] = {
    address: inputToken?.address,
    decimals: inputToken?.decimals,
    amount: inputToken?.amount
  }

  const isSwapTxNecessary = isFetchedVaultTokenVelodromeLp && !isLpSwapTxsNecessary

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
    from: {
      address: inputToken?.address,
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
    if (!!inputToken?.address && !!vaultToken && !!exchangeRate && !!swapTx) {
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
      }
    }
  }, [
    inputToken,
    vaultToken,
    exchangeRate,
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
    !!signature &&
    !!deadline &&
    nonce !== undefined &&
    nonce !== -1n &&
    enabled !== false &&
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
  const zapArgs = useMemo((): [ZapPermit, ZapConfig, `0x${string}`, ZapRoute] | undefined => {
    if (isFetched) {
      const zapPermit: ZapPermit = {
        permitted: [{ token: inputToken.address, amount: inputToken.amount }],
        nonce,
        deadline
      }

      const zapConfig: ZapConfig = {
        inputs: [{ token: inputToken.address, amount: inputToken.amount }],
        outputs: [
          { token: vault.address, minOutputAmount: amountOut.min },
          { token: inputToken.address, minOutputAmount: 0n },
          { token: vaultToken.address, minOutputAmount: 0n }
        ],
        relay: { target: zeroAddress, value: 0n, data: '0x0' },
        user: userAddress,
        recipient: userAddress
      }

      let zapRoute: ZapRoute = [{ ...depositTx, tokens: [{ token: vaultToken.address, index: 4 }] }]

      if (!!swapTx) {
        // Swap for vault token -> Deposit
        zapRoute = [
          {
            ...getArbitraryProxyTx(swapTx.allowanceProxy),
            tokens: [{ token: inputToken.address, index: -1 }]
          },
          { ...swapTx.tx, tokens: [{ token: inputToken.address, index: -1 }] },
          ...zapRoute
        ]
      }

      return [zapPermit, zapConfig, signature, zapRoute]
    }
  }, [
    inputToken,
    vault,
    signature,
    deadline,
    nonce,
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
