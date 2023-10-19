import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { useAtomValue } from 'jotai'
import { vaultChainIdAtom, vaultYieldSourceAddressAtom, vaultYieldSourceNameAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'
import { useYieldSourceTokenAddress } from './useYieldSourceTokenAddress'

/**
 * Returns a vault name and symbol based on its underlying token and yield source
 * @returns
 */
export const useVaultNaming = () => {
  const vaultChainId = useAtomValue(vaultChainIdAtom)
  const vaultYieldSourceName = useAtomValue(vaultYieldSourceNameAtom)
  const vaultYieldSourceAddress = useAtomValue(vaultYieldSourceAddressAtom)

  const { data: tokenAddress } = useYieldSourceTokenAddress(
    vaultChainId as number,
    vaultYieldSourceAddress as Address
  )

  const { data: tokenData } = useToken(vaultChainId as SupportedNetwork, tokenAddress as Address)

  const name = `Prize ${tokenData?.symbol ?? '???'} - ${vaultYieldSourceName}`
  const symbol = `P${tokenData?.symbol ?? '???'}`

  return { name, symbol }
}
