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
    <div className='w-full flex flex-col grow gap-8 lg:flex-row lg:gap-4'>
      <div className='flex flex-col shrink-0 gap-8 items-center p-6 bg-pt-transparent lg:w-[27rem] lg:py-0 lg:pl-2 lg:pr-6 lg:bg-transparent'>
        <CreateVaultStepInfo className='grow items-center justify-center lg:items-start' />
        {showPreview.includes(step) && <VaultPreview />}
        {showDeployment.includes(step) && <DeployedVaultInfo className='w-full' />}
      </div>
      <CreateVaultStepContent />
    </div>
  )
}
