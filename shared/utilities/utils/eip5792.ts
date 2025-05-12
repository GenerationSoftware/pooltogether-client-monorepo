import { GetCapabilitiesReturnType } from 'viem'

/**
 * Returns `true` if a wallet supports EIP 5792
 * @param capabilities the wallet capabilities for a specific network
 * @returns
 */
export const supportsEip5792 = (capabilities: GetCapabilitiesReturnType[number]) => {
  return capabilities.atomic?.status === 'supported' || capabilities.atomic?.status === 'ready'
}

/**
 * Returns `true` if a wallet supports EIP 7677
 * @param capabilities the wallet capabilities for a specific network
 * @returns
 */
export const supportsEip7677 = (capabilities: GetCapabilitiesReturnType[number]) => {
  return !!capabilities.paymasterService?.supported
}
