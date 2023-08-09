import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { DeployVaultView } from './DeployVaultView'
import { ClaimerForm } from './forms/ClaimerForm'
import { DeployLiquidationPairForm } from './forms/DeployLiquidationPairForm'
import { NameAndSymbolForm } from './forms/NameAndSymbolForm'
import { NetworkForm } from './forms/NetworkForm'
import { OwnerAndFeesForm } from './forms/OwnerAndFeesForm'
import { SetLiquidationPairForm } from './forms/SetLiquidationPairForm'
import { YieldSourceForm } from './forms/YieldSourceForm'

const allVaultStepContent: ReactNode[] = [
  <NetworkForm />,
  <YieldSourceForm />,
  <OwnerAndFeesForm />,
  <NameAndSymbolForm />,
  <ClaimerForm />,
  <DeployVaultView />,
  <DeployLiquidationPairForm />,
  <SetLiquidationPairForm />
]

interface CreateVaultStepContentProps {
  className?: string
}

export const CreateVaultStepContent = (props: CreateVaultStepContentProps) => {
  const { className } = props

  const { step } = useVaultCreationSteps()

  const content = useMemo(() => allVaultStepContent[step] ?? <></>, [step])

  return (
    <div className={classNames('flex grow items-center justify-center', className)}>{content}</div>
  )
}
