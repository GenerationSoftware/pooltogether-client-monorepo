import { usePromotionCreationSteps } from '@hooks/usePromotionCreationSteps'
import { CreatePromotionStepContent } from './CreatePromotionStepContent'
import { CreatePromotionStepInfo } from './CreatePromotionStepInfo'
import { PromotionPreview } from './PromotionPreview'

export const CreatePageContent = () => {
  const { step } = usePromotionCreationSteps()

  const showPreview: number[] = [1, 2]

  return (
    <div className='w-full flex flex-col grow gap-8 lg:flex-row lg:gap-4'>
      <div className='flex flex-col shrink-0 gap-8 items-center p-6 bg-pt-transparent lg:w-[27rem] lg:py-0 lg:pl-2 lg:pr-6 lg:bg-transparent'>
        <CreatePromotionStepInfo className='grow items-center justify-center lg:items-start' />
        {showPreview.includes(step) && <PromotionPreview />}
      </div>
      <CreatePromotionStepContent />
    </div>
  )
}
