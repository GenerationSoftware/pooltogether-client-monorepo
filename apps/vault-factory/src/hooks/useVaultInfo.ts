import { VaultDeployInfo } from '@shared/types'
import { useAtomValue } from 'jotai'
import {
  vaultChainIdAtom,
  vaultClaimerAddressAtom,
  vaultFeePercentageAtom,
  vaultFeeRecipientAddressAtom,
  vaultNameAtom,
  vaultOwnerAddressAtom,
  vaultSymbolAtom,
  vaultTokenAddressAtom,
  vaultYieldSourceAddressAtom,
  vaultYieldSourceNameAtom
} from 'src/atoms'
import { CONTRACTS } from '@constants/config'

/**
 * Returns all info required to deploy a new vault
 * @returns
 */
export const useVaultInfo = (): Partial<VaultDeployInfo> => {
  const chainId = useAtomValue(vaultChainIdAtom)
  const token = useAtomValue(vaultTokenAddressAtom)
  const yieldSourceName = useAtomValue(vaultYieldSourceNameAtom)
  const yieldSourceAddress = useAtomValue(vaultYieldSourceAddressAtom)
  const feePercentage = useAtomValue(vaultFeePercentageAtom)
  const feeRecipient = useAtomValue(vaultFeeRecipientAddressAtom)
  const owner = useAtomValue(vaultOwnerAddressAtom)
  const name = useAtomValue(vaultNameAtom)
  const symbol = useAtomValue(vaultSymbolAtom)
  const claimer = useAtomValue(vaultClaimerAddressAtom)

  const prizePool = !!chainId ? CONTRACTS[chainId].prizePool : undefined
  const twabController = !!chainId ? CONTRACTS[chainId].twabController : undefined

  return {
    chainId,
    token,
    name,
    symbol,
    twabController,
    yieldSourceName,
    yieldSourceAddress,
    prizePool,
    claimer,
    feeRecipient,
    feePercentage,
    owner
  }
}
