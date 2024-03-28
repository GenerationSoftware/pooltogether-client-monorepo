import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { PrizesView } from 'src/views/PrizesView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function PrizesPage() {
  const router = useRouter()

  const { chainId, isReady } = useSelectedChainId()

  useEffect(() => {
    if (isReady && !chainId) {
      router.replace('/prizes')
    }
  }, [chainId, isReady])

  return <Layout>{!!chainId && <PrizesView chainId={chainId} />}</Layout>
}
