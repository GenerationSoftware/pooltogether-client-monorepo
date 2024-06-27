import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { DrawsView } from 'src/views/DrawsView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function DrawsPage() {
  const router = useRouter()

  const { chainId, isReady } = useSelectedChainId()

  useEffect(() => {
    if (isReady && !chainId) {
      router.replace('/draws')
    }
  }, [chainId, isReady])

  return <Layout>{!!chainId && <DrawsView chainId={chainId} />}</Layout>
}
