import {
  useTokenBalances,
  useTokenPrices,
  useTokens
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithAmount, TokenWithPrice } from '@shared/types'
import { DOLPHIN_ADDRESS, lower, NETWORK } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'

// TODO: should not hardcode token options (fetch from some existing tokenlist - paraswap would be ideal)
const swapTokenOptions: { [chainId: number]: Address[] } = {
  [NETWORK.optimism]: [
    DOLPHIN_ADDRESS, // ETH
    '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC
    '0x4200000000000000000000000000000000000006', // WETH
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
    '0x395Ae52bB17aef68C2888d941736A71dC6d4e125', // POOL
    '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819', // LUSD
    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58' // USDT
  ],
  [NETWORK.base]: [
    DOLPHIN_ADDRESS, // ETH
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    '0x940181a94A35A4569E4529A3CDfB74e38FD98631', // AERO
    '0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3', // POOL
    '0x4200000000000000000000000000000000000006', // WETH
    '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452', // wstETH
    '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', // cbETH
    '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // DAI
    '0x368181499736d0c0CC614DBB145E2EC1AC86b8c6' // LUSD
  ]
}

/**
 * Returns token options to use for swap transactions
 * @param chainId the chain ID the swap is to be made in
 * @returns
 */
export const useSwapTokenOptions = (chainId: number) => {
  const tokenAddresses = swapTokenOptions[chainId] ?? []

  const { address: userAddress } = useAccount()

  const { data: tokens } = useTokens(chainId, tokenAddresses)

  const { data: tokenBalances } = useTokenBalances(
    chainId,
    userAddress as Address,
    tokenAddresses,
    { refetchOnWindowFocus: true }
  )
  const { data: tokenPrices } = useTokenPrices(chainId, tokenAddresses)

  const tokenOptions = useMemo(() => {
    const options: (TokenWithAmount & Required<TokenWithPrice> & { value: number })[] = []

    if (!!tokens) {
      Object.values(tokens).forEach((token) => {
        const amount = tokenBalances?.[token.address]?.amount ?? 0n
        const price = tokenPrices?.[lower(token.address)] ?? 0
        const value = parseFloat(formatUnits(amount, token.decimals)) * price

        options.push({ ...token, amount, price, value })
      })

      options.sort((a, b) => b.value - a.value)
    }

    return options
  }, [tokens, tokenBalances, tokenPrices])

  return tokenOptions
}
