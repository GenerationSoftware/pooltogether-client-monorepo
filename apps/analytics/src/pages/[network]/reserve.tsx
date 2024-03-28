import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ReserveView } from 'src/views/ReserveView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function ReservePage() {
  const router = useRouter()

  const { chainId, isReady } = useSelectedChainId()

  useEffect(() => {
    if (isReady && !chainId) {
      router.replace('/reserve')
    }
  }, [chainId, isReady])

  return <Layout>{!!chainId && <ReserveView chainId={chainId} />}</Layout>
}
