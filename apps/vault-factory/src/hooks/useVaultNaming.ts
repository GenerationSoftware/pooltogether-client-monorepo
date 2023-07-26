import { useToken } from '@pooltogether/hyperstructure-react-hooks'
import { useAtomValue } from 'jotai'
import { vaultChainIdAtom, vaultTokenAddressAtom, vaultYieldSourceNameAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'

/**
 * Returns a vault name and symbol based on its underlying token and yield source
 * @returns
 */
export const useVaultNaming = () => {
  const vaultChainId = useAtomValue(vaultChainIdAtom)
  const vaultTokenAddress = useAtomValue(vaultTokenAddressAtom)
  const vaultYieldSource = useAtomValue(vaultYieldSourceNameAtom)

  const { data: tokenData } = useToken(
    vaultChainId as SupportedNetwork,
    vaultTokenAddress as Address
  )

  const name = `Prize ${vaultYieldSource} ${tokenData?.symbol ?? '???'}`
  const symbol = `p${vaultYieldSource.charAt(0).toLowerCase()}${tokenData?.symbol ?? '???'}`

  return { name, symbol }
}
