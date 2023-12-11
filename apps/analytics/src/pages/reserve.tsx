import { getNetworkNameByChainId, PRIZE_POOLS } from '@shared/utilities'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ReservePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/${getNetworkNameByChainId(PRIZE_POOLS[0].chainId)}/reserve`)
  }, [])

  return null
}
