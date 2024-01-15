import { TokenWithLogo } from '@shared/types'
import { useMemo } from 'react'
import { SUPPORTED_NETWORKS, V4_POOLS } from '@constants/config'

export const useV4Tokens = () => {
  return useMemo(() => {
    const tokens: TokenWithLogo[] = []

    SUPPORTED_NETWORKS.forEach((network) => {
      const token = V4_POOLS[network]?.ticket
      !!token && tokens.push(token)
    })

    return tokens
  }, [])
}
