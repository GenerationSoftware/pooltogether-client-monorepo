import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { LiquidationsView } from 'src/views/LiquidationsView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function LiquidationsPage() {
  const router = useRouter()

  const { chainId, isReady } = useSelectedChainId()

  useEffect(() => {
    if (isReady && !chainId) {
      router.replace('/liquidations')
    }
  }, [chainId, isReady])

  return <Layout>{!!chainId && <LiquidationsView chainId={chainId} />}</Layout>
}
