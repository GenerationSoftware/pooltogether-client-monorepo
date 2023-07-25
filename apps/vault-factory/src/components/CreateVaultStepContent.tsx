import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { useSteps } from '@hooks/useSteps'
import { ChainAndTokenForm } from './forms/ChainAndTokenForm'

const allVaultStepContent: ReactNode[] = [<ChainAndTokenForm />]

interface CreateVaultStepContentProps {
  className?: string
}

export const CreateVaultStepContent = (props: CreateVaultStepContentProps) => {
  const { className } = props

  const { step } = useSteps()

  const content = useMemo(() => allVaultStepContent[step] ?? <></>, [step])

  return <div className={classNames('', className)}>{content}</div>
}
