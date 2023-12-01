import { NETWORK, NETWORK_NAME, PRIZE_POOLS } from '@shared/utilities'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const useSelectedChainId = () => {
  const router = useRouter()

  const chainId = useMemo(() => {
    if (typeof router.query.network === 'string' && router.query.network in NETWORK) {
      const _chainId = NETWORK[router.query.network as NETWORK_NAME]

      const prizePool = PRIZE_POOLS.find((prizePool) => prizePool.chainId === _chainId)
      if (!!prizePool) {
        return _chainId
      }
    }
  }, [router.query])

  return { chainId, isReady: router.isReady }
}
