import { useAtomValue } from 'jotai'
import { appViewAtom } from 'src/atoms'
import { Layout } from '@components/Layout'
import { BaseView } from '@views/BaseView'
import { EditingView } from '@views/EditingView'
import { PreviewView } from '@views/PreviewView'

export default function Dashboard() {
  const appView = useAtomValue(appViewAtom)

  return (
    <Layout>
      {appView === 'base' && <BaseView />}
      {appView === 'editing' && <EditingView />}
      {appView === 'preview' && <PreviewView />}
    </Layout>
  )
}
