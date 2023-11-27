import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { usePromotionCreationSteps } from '@hooks/usePromotionCreationSteps'
import { DeployPromotionView } from './DeployPromotionView'
import { EpochsForm } from './forms/EpochsForm'
import { TokenForm } from './forms/TokenForm'
import { VaultForm } from './forms/VaultForm'

const allPromotionStepContent: ReactNode[] = [
  <VaultForm />,
  <EpochsForm />,
  <TokenForm />,
  <DeployPromotionView />
]

interface CreatePromotionStepContentProps {
  className?: string
}

export const CreatePromotionStepContent = (props: CreatePromotionStepContentProps) => {
  const { className } = props

  const { step } = usePromotionCreationSteps()

  const content = useMemo(() => allPromotionStepContent[step] ?? <></>, [step])

  return (
    <div className={classNames('flex grow items-center justify-center px-4 lg:px-0', className)}>
      {content}
    </div>
  )
}
