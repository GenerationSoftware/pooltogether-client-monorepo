import { ReactNode } from 'react'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'
import { allVaultStepInfo } from './CreateVaultStepInfo'
import { StepInfo } from './StepInfo'

const allLiquidationPairStepInfo: { title: string; info: ReactNode }[] = [
  allVaultStepInfo[7],
  allVaultStepInfo[8]
]

interface LiquidationPairStepInfoProps {
  className?: string
}

export const LiquidationPairStepInfo = (props: LiquidationPairStepInfoProps) => {
  const { className } = props

  const { step, setStep } = useLiquidationPairSteps()

  return (
    <StepInfo
      step={step}
      stepInfo={allLiquidationPairStepInfo}
      setStep={setStep}
      className={className}
    />
  )
}
