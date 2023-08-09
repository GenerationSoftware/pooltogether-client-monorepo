import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { CreateVaultStepContent } from './CreateVaultStepContent'
import { CreateVaultStepInfo } from './CreateVaultStepInfo'
import { DeployedVaultInfo } from './DeployedVaultInfo'
import { VaultPreview } from './VaultPreview'

export const CreatePageContent = () => {
  const { step } = useVaultCreationSteps()

  const showPreview: number[] = [1, 2, 3, 4]
  const showDeployment: number[] = [6, 7]

  return (
    <div className='w-full flex grow md:gap-4'>
      <div className='w-[27rem] flex flex-col shrink-0 gap-8 pl-2 pr-6'>
        <CreateVaultStepInfo className='grow justify-center' />
        {showPreview.includes(step) && <VaultPreview />}
        {showDeployment.includes(step) && <DeployedVaultInfo />}
      </div>
      <CreateVaultStepContent />
    </div>
  )
}
