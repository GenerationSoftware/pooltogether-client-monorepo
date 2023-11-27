import { ReactNode } from 'react'
import { usePromotionCreationSteps } from '@hooks/usePromotionCreationSteps'
import { StepInfo } from './StepInfo'

export const allPromotionStepInfo: { title: string; info: ReactNode }[] = [
  {
    title: 'Choose a network and vault',
    info: `Rewards will be distributed to users of this vault!`
  },
  {
    title: 'Configure your timing',
    info: `Rewards are distributed at the end of each epoch.`
  },
  {
    title: 'Set the rewards',
    info: `Select what token you want to reward, along with how much of it.`
  },
  {
    title: 'Deploy your rewards',
    info: `Make sure the settings are to your liking, then sign a transaction to deploy it onchain!`
  }
]

interface CreatePromotionStepInfoProps {
  className?: string
}

export const CreatePromotionStepInfo = (props: CreatePromotionStepInfoProps) => {
  const { className } = props

  const { step, setStep } = usePromotionCreationSteps()

  return (
    <StepInfo step={step} stepInfo={allPromotionStepInfo} setStep={setStep} className={className} />
  )
}
