import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'

export const TemporaryMoonwellWarning = (props: { vault: Vault }) => {
  const { vault } = props

  const { data: isMoonwellOverborrowed } = useQuery({
    queryKey: ['moonwellOverborrowedCheck', vault.chainId, vault.address],
    queryFn: async () => {
      try {
        console.log('beep')
        const moonwellYieldSourceABI = [
          {
            inputs: [],
            name: 'mToken',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function'
          }
        ] as const
        const moonwellTokenABI = [
          {
            inputs: [],
            name: 'totalBorrows',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function'
          },
          {
            inputs: [],
            name: 'comptroller',
            outputs: [{ internalType: 'contract ComptrollerInterface', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function'
          }
        ] as const
        const moonwellComptrollerABI = [
          {
            inputs: [{ indexed: false, internalType: 'address', name: '<input>', type: 'address' }],
            name: 'borrowCaps',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function'
          }
        ] as const

        const yieldSourceAddress = await vault.getYieldSource()
        const mTokenAddress = await vault.publicClient.readContract({
          address: yieldSourceAddress,
          abi: moonwellYieldSourceABI,
          functionName: 'mToken'
        })
        const totalBorrows = await vault.publicClient.readContract({
          address: mTokenAddress,
          abi: moonwellTokenABI,
          functionName: 'totalBorrows'
        })
        const comptroller = await vault.publicClient.readContract({
          address: mTokenAddress,
          abi: moonwellTokenABI,
          functionName: 'comptroller'
        })
        const borrowCap = await vault.publicClient.readContract({
          address: comptroller,
          abi: moonwellComptrollerABI,
          functionName: 'borrowCaps',
          args: [mTokenAddress]
        })

        return totalBorrows > borrowCap
      } catch {
        return false
      }
    },
    enabled: vault.tags?.includes('moonwell'),
    ...NO_REFETCH
  })

  if (!isMoonwellOverborrowed) return <></>

  return (
    <span className='flex flex-col gap-2 p-1 text-center text-sm text-pt-purple-200 bg-pt-purple-500 rounded-lg'>
      This vault's underlying yield source (Moonwell) is currently overborrowed, and may temporarily
      limit large withdrawals.
    </span>
  )
}
