import { Spinner } from '@shared/ui'
import { BurnView } from 'src/views/BurnView'
import { Layout } from '@components/Layout'
import { useSelectedChainId } from '@hooks/useSelectedChainId'

export default function BurnPage() {
  const { chainId, isReady } = useSelectedChainId()

  return (
    <Layout>
      {!isReady && <Spinner />}
      {/* TODO: show some error message if invalid chainId */}
      {isReady && (!!chainId ? <BurnView chainId={chainId} /> : <></>)}
    </Layout>
  )
}
