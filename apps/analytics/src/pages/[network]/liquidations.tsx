import { Spinner } from '@shared/ui'
import { LiquidationsView } from 'src/views/LiquidationsView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function LiquidationsPage() {
  const { chainId, isReady } = useSelectedChainId()

  return (
    <Layout>
      {!isReady && <Spinner />}
      {/* TODO: show some error message if invalid chainId */}
      {isReady && (!!chainId ? <LiquidationsView chainId={chainId} /> : <></>)}
    </Layout>
  )
}
