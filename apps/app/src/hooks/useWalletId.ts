import { atom, useAtom } from 'jotai'
import { useAccount } from 'wagmi'

export const walletIdOverwriteAtom = atom<string>('')

/**
 * Returns the currently connected wallet's ID
 * @returns
 */
export const useWalletId = () => {
  const { connector } = useAccount()

  const [walletIdOverwrite, setWalletId] = useAtom(walletIdOverwriteAtom)

  const walletId = walletIdOverwrite || connector?.id

  return { walletId, setWalletId }
}
