import { EIP2612_PERMIT_TYPES, getSecondsSinceEpoch, OLD_DAI_PERMIT_TYPES } from '@shared/utilities'
import { useMemo, useState } from 'react'
import { Address, verifyTypedData, zeroAddress } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import { useTokenDomain, useTokenNonces, useTokenPermitSupport } from '..'

/**
 * Requests an EIP-2612 signature for any contract to spend any token
 * @param token the token to approve
 * @param spender the contract to approve spending to
 * @param options optional settings or callbacks
 * @returns
 */
export const useGenericApproveSignature = (
  token: { chainId: number; address: Address; amount: bigint },
  spender: Address,
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

  const { data: tokenPermitSupport } = useTokenPermitSupport(token?.chainId, token?.address)

  const { data: tokenDomain } = useTokenDomain(token?.chainId, token?.address)

  const { data: nonces } = useTokenNonces(token?.chainId, userAddress as Address, token?.address, {
    refetchOnWindowFocus: true
  })

  const [isInvalidSignature, setIsInvalidSignature] = useState<boolean>(false)
  const [deadline, setDeadline] = useState<bigint>(0n)

  const message = useMemo(() => {
    if (tokenPermitSupport === 'eip2612') {
      return {
        owner: userAddress ?? zeroAddress,
        spender,
        value: token?.amount ?? 0n,
        nonce: nonces ?? 0n,
        deadline: options?.deadline ?? BigInt(getSecondsSinceEpoch() + 600)
      }
    } else if (tokenPermitSupport === 'daiPermit') {
      return {
        holder: userAddress ?? zeroAddress,
        spender,
        nonce: nonces ?? 0n,
        expiry: options?.deadline ?? BigInt(getSecondsSinceEpoch() + 600),
        allowed: true
      }
    } else {
      return {}
    }
  }, [token, spender, userAddress, tokenPermitSupport, nonces])

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

    const isValid =
      !!message.value &&
      message.value === token?.amount &&
      (await verifyTypedData({
        address: userAddress as Address,
        domain: tokenDomain,
        message,
        types,
        primaryType: 'Permit',
        signature: sigToVerify
      }))

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
    isPending: isWaiting,
    isSuccess: isSigningSuccess,
    isError: isSigningError,
    signTypedData: _signTypedData
  } = useSignTypedData()

  const signTypedData = () => {
    if (tokenPermitSupport === 'eip2612') {
      setDeadline(message.deadline as bigint)
    } else if (tokenPermitSupport === 'daiPermit') {
      setDeadline(message.expiry as bigint)
    }

    _signTypedData(
      { domain: tokenDomain, message, types, primaryType: 'Permit' },
      { onSuccess: verifySignature, onError: options?.onError }
    )
  }

  const enabled =
    !!userAddress &&
    !!token?.amount &&
    tokenPermitSupport !== undefined &&
    tokenPermitSupport !== 'none' &&
    !!tokenDomain &&
    nonces !== undefined &&
    nonces !== -1n &&
    !!message.value &&
    message.value === token.amount &&
    !!types.Permit.length

  const signApprove = enabled ? signTypedData : undefined

  const isError = isSigningError || isInvalidSignature
  const isSuccess = isSigningSuccess && !isError

  return { signature, deadline, isWaiting, isSuccess, isError, signApprove }
}
