import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { BurnView } from 'src/views/BurnView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function BurnPage() {
  const router = useRouter()

  const { chainId, isReady } = useSelectedChainId()

  useEffect(() => {
    if (isReady && !chainId) {
      router.replace('/burn')
    }
  }, [chainId, isReady])

  return <Layout>{!!chainId && <BurnView chainId={chainId} />}</Layout>
}
