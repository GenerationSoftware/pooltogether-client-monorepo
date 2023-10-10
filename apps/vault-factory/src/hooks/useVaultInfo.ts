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
  vaultYieldSourceAddressAtom,
  vaultYieldSourceNameAtom
} from 'src/atoms'
import { Address } from 'viem'
import { CONTRACTS } from '@constants/config'
import { useYieldSourceTokenAddress } from './useYieldSourceTokenAddress'

/**
 * Returns all info required to deploy a new vault
 * @returns
 */
export const useVaultInfo = (): Partial<VaultDeployInfo> => {
  const chainId = useAtomValue(vaultChainIdAtom)
  const yieldSourceName = useAtomValue(vaultYieldSourceNameAtom)
  const yieldSourceAddress = useAtomValue(vaultYieldSourceAddressAtom)
  const feePercentage = useAtomValue(vaultFeePercentageAtom)
  const feeRecipient = useAtomValue(vaultFeeRecipientAddressAtom)
  const owner = useAtomValue(vaultOwnerAddressAtom)
  const name = useAtomValue(vaultNameAtom)
  const symbol = useAtomValue(vaultSymbolAtom)
  const claimer = useAtomValue(vaultClaimerAddressAtom)

  const { data: token } = useYieldSourceTokenAddress(
    chainId as number,
    yieldSourceAddress as Address
  )

  const prizePool = !!chainId ? CONTRACTS[chainId].prizePool : undefined

  return {
    chainId,
    token,
    name,
    symbol,
    yieldSourceName,
    yieldSourceAddress,
    prizePool,
    claimer,
    feeRecipient,
    feePercentage,
    owner
  }
}
