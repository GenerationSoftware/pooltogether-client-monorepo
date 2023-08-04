import { useSteps } from '@hooks/useSteps'
import { CreateVaultStepContent } from './CreateVaultStepContent'
import { CreateVaultStepInfo } from './CreateVaultStepInfo'
import { VaultPreview } from './VaultPreview'

export const CreatePageContent = () => {
  const { step } = useSteps()

  const showPreview: number[] = [0, 1, 2, 3, 4]

  return (
    <div className='w-full flex grow md:gap-4'>
      <div className='w-[27rem] flex flex-col shrink-0 gap-8 pl-2 pr-6'>
        <CreateVaultStepInfo className='grow justify-center' />
        {showPreview.includes(step) && <VaultPreview />}
      </div>
      <CreateVaultStepContent />
    </div>
  )
}
