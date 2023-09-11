import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useEffect, useMemo, useState } from 'react'
import { Address, TypedDataDomain, verifyTypedData, zeroAddress } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import { useTokenNonces, useVaultTokenData } from '..'

/**
 * Requests an EIP-2612 signature for a vault to spend tokens
 * @param amount the amount to be approved
 * @param vault the vault to approve spending to
 * @param options optional callbacks
 * @returns
 */
export const useApproveSignature = (
  amount: bigint,
  vault: Vault,
  options?: {
    onSuccess?: (signature: `0x${string}`) => void
    onError?: () => void
  }
): {
  signature?: `0x${string}`
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  signApprove?: () => void
} => {
  const { address: userAddress } = useAccount()

  const { data: token } = useVaultTokenData(vault)

  const { data: nonces } = useTokenNonces(
    token?.chainId as number,
    userAddress as Address,
    token?.address as Address,
    { refetchOnWindowFocus: true }
  )

  const [isInvalidSignature, setIsInvalidSignature] = useState<boolean>(false)

  const domain: TypedDataDomain | undefined = useMemo(() => {
    if (!!token) {
      return {
        chainId: token.chainId,
        name: token.name,
        verifyingContract: token.address,
        version: '1'
      }
    }
  }, [token])

  const message = useMemo(() => {
    const owner = userAddress ?? zeroAddress
    const spender = vault.address
    const value = amount
    const nonce = nonces ?? 0n
    const deadline = BigInt(Math.floor(Date.now() / 1_000) + 300)

    return { owner, spender, value, nonce, deadline }
  }, [amount, vault, userAddress, nonces])

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  } as const

  const {
    data: signature,
    isLoading,
    isSuccess,
    isError: isSigningError,
    signTypedData
  } = useSignTypedData({
    domain,
    message,
    types,
    primaryType: 'Permit'
  })

  const verifySignature = async (
    sigToVerify: `0x${string}`,
    callbacks?: { onSuccess?: (sig: `0x${string}`) => void; onError?: () => void }
  ) => {
    setIsInvalidSignature(false)

    const isValid = await verifyTypedData({
      address: userAddress as Address,
      domain,
      message,
      types,
      primaryType: 'Permit',
      signature: sigToVerify
    })

    if (isValid) {
      callbacks?.onSuccess?.(sigToVerify)
      return true
    } else {
      setIsInvalidSignature(true)
      callbacks?.onError?.()
      return false
    }
  }

  useEffect(() => {
    if (!!signature && isSuccess) {
      verifySignature(signature)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isSigningError) {
      options?.onError?.()
    }
  }, [isSigningError])

  const enabled = !!userAddress && !!token && nonces !== undefined && !!domain && !!message.value
  const signApprove = enabled ? signTypedData : undefined

  const isError = isSigningError || isInvalidSignature

  return { signature, isLoading, isSuccess, isError, signApprove }
}
