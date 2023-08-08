import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'
import { DeployLiquidationPairForm } from './forms/DeployLiquidationPairForm'

const allLiquidationPairStepContent: ReactNode[] = [<DeployLiquidationPairForm />]

interface LiquidationPairStepContentProps {
  className?: string
}

export const LiquidationPairStepContent = (props: LiquidationPairStepContentProps) => {
  const { className } = props

  const { step } = useLiquidationPairSteps()

  const content = useMemo(() => allLiquidationPairStepContent[step] ?? <></>, [step])

  return (
    <div className={classNames('flex grow items-center justify-center', className)}>{content}</div>
  )
}
