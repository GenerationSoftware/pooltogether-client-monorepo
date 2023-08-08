import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'

interface StepInfoProps {
  step: number
  stepInfo: { title: string; info: ReactNode }[]
  setStep: (num: number) => void
  className?: string
}

export const StepInfo = (props: StepInfoProps) => {
  const { step, stepInfo, setStep, className } = props

  const { title, info } = useMemo(
    () => stepInfo[step] ?? { title: '?', info: '?' },
    [step, stepInfo]
  )

  return (
    <div className={classNames('flex flex-col', className)}>
      <span>
        {step + 1}/{stepInfo.length}
      </span>
      <h2 className='text-3xl'>{title}</h2>
      <span>{info}</span>
      <VaultStepGraphic step={step} maxSteps={stepInfo.length} setStep={setStep} className='mt-6' />
    </div>
  )
}

interface VaultStepGraphicProps {
  step: number
  maxSteps: number
  setStep: (num: number) => void
  className?: string
}

const VaultStepGraphic = (props: VaultStepGraphicProps) => {
  const { step, maxSteps, setStep, className } = props

  const completedSteps = [...Array(step).keys()]
  const futureSteps = step < maxSteps ? [...Array(maxSteps - step - 1).keys()] : []

  return (
    <div className={classNames('flex gap-3', className)}>
      {completedSteps.map((i) => (
        <div
          key={`completed-${i}`}
          onClick={() => setStep(i)}
          className='w-3 h-3 bg-pt-teal-dark rounded-full cursor-pointer'
        />
      ))}
      <div className='w-9 h-3 bg-pt-purple-50 rounded-full' />
      {futureSteps.map((i) => (
        <div key={`future-${i}`} className='w-3 h-3 bg-pt-purple-50/50 rounded-full' />
      ))}
    </div>
  )
}
