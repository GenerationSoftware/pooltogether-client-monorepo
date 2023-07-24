import { ChainAndTokenForm } from '@components/forms/ChainAndTokenForm'
import { Layout } from '@components/Layout'
import { PoweredByPT } from '@components/PoweredByPT'
import { VaultPreview } from '@components/VaultPreview'

export default function CreatePage() {
  return (
    <Layout isSidebarActive={true}>
      <div className='w-full flex grow gap-8'>
        {/* TODO: info on current step */}
        <div className='w-[27rem] flex flex-col pr-4'>
          <VaultPreview />
          <PoweredByPT />
        </div>
        <ChainAndTokenForm />
      </div>
    </Layout>
  )
}
