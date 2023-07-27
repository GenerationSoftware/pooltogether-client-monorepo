import { CreateVaultStepContent } from '@components/CreateVaultStepContent'
import { CreateVaultStepInfo } from '@components/CreateVaultStepInfo'
import { Layout } from '@components/Layout'
import { VaultPreview } from '@components/VaultPreview'
import { useSteps } from '@hooks/useSteps'

export default function CreatePage() {
  const { step } = useSteps()

  return (
    <Layout isSidebarActive={true}>
      <div className='w-full flex grow md:gap-4'>
        <div className='w-[27rem] flex flex-col shrink-0 gap-8 pl-2 pr-6'>
          <CreateVaultStepInfo className='grow justify-center' />
          {step !== 5 && <VaultPreview />}
        </div>
        <CreateVaultStepContent />
      </div>
    </Layout>
  )
}
