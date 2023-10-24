import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { EIP2612_PERMIT_TYPES, getSecondsSinceEpoch, OLD_DAI_PERMIT_TYPES } from '@shared/utilities'
import { useMemo, useState } from 'react'
import { Address, TypedDataDomain, verifyTypedData, zeroAddress } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import { useTokenNonces, useTokenPermitSupport, useTokenVersion, useVaultTokenData } from '..'

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
    deadline?: bigint
    onSuccess?: (signature: `0x${string}`) => void
    onError?: () => void
  }
): {
  signature?: `0x${string}`
  deadline?: bigint
  isWaiting: boolean
  isSuccess: boolean
  isError: boolean
  signApprove?: () => void
} => {
  const { address: userAddress } = useAccount()

  const { data: token } = useVaultTokenData(vault)

  const { data: tokenPermitSupport } = useTokenPermitSupport(
    token?.chainId as number,
    token?.address as Address
  )

  const { data: tokenVersion } = useTokenVersion(
    token?.chainId as number,
    token?.address as Address
  )

  const { data: nonces } = useTokenNonces(
    token?.chainId as number,
    userAddress as Address,
    token?.address as Address,
    { refetchOnWindowFocus: true }
  )

  const [isInvalidSignature, setIsInvalidSignature] = useState<boolean>(false)
  const [deadline, setDeadline] = useState<bigint>(0n)

  const domain: TypedDataDomain | undefined = useMemo(() => {
    if (!!token && !!tokenVersion && Number(tokenVersion) >= 1) {
      return {
        chainId: token.chainId,
        name: token.name,
        verifyingContract: token.address,
        version: tokenVersion
      }
    }
  }, [token, tokenVersion])

  const message = useMemo(() => {
    if (tokenPermitSupport === 'eip2612') {
      return {
        owner: userAddress ?? zeroAddress,
        spender: vault.address,
        value: amount,
        nonce: nonces ?? 0n,
        deadline: options?.deadline ?? BigInt(getSecondsSinceEpoch() + 600)
      }
    } else if (tokenPermitSupport === 'daiPermit') {
      return {
        holder: userAddress ?? zeroAddress,
        spender: vault.address,
        nonce: nonces ?? 0n,
        expiry: options?.deadline ?? BigInt(getSecondsSinceEpoch() + 600),
        allowed: true
      }
    } else {
      return {}
    }
  }, [amount, vault, userAddress, tokenPermitSupport, nonces])

  const types = useMemo(() => {
    if (tokenPermitSupport === 'eip2612') {
      return EIP2612_PERMIT_TYPES
    } else if (tokenPermitSupport === 'daiPermit') {
      return OLD_DAI_PERMIT_TYPES
    } else {
      return { Permit: [] }
    }
  }, [tokenPermitSupport])

  const verifySignature = async (sigToVerify: `0x${string}`) => {
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
      options?.onSuccess?.(sigToVerify)
      return true
    } else {
      setIsInvalidSignature(true)
      options?.onError?.()
      return false
    }
  }

  const {
    data: signature,
    isLoading: isWaiting,
    isSuccess: isSigningSuccess,
    isError: isSigningError,
    signTypedData
  } = useSignTypedData({
    domain,
    message,
    types,
    primaryType: 'Permit',
    onSuccess: verifySignature,
    onError: options?.onError
  })

  const _signTypedData = () => {
    if (tokenPermitSupport === 'eip2612') {
      setDeadline(message.deadline as bigint)
    } else if (tokenPermitSupport === 'daiPermit') {
      setDeadline(message.expiry as bigint)
    }
    signTypedData()
  }

  const enabled =
    !!userAddress &&
    !!token &&
    tokenPermitSupport !== undefined &&
    tokenPermitSupport !== 'none' &&
    !!tokenVersion &&
    nonces !== undefined &&
    nonces !== -1n &&
    !!domain &&
    !!message.value

  const signApprove = enabled ? _signTypedData : undefined

  const isError = isSigningError || isInvalidSignature
  const isSuccess = isSigningSuccess && !isError

  return { signature, deadline, isWaiting, isSuccess, isError, signApprove }
}
