import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { StatsView } from 'src/views/StatsView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function StatsPage() {
  const router = useRouter()

  const { chainId, isReady } = useSelectedChainId()

  useEffect(() => {
    if (isReady && !chainId) {
      router.replace('/')
    }
  }, [chainId, isReady])

  return <Layout>{!!chainId && <StatsView chainId={chainId} />}</Layout>
}
