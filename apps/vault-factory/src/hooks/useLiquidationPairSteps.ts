import { useAtom } from 'jotai'
import { liquidationPairStepCounterAtom } from 'src/atoms'

/**
 * Returns an easily update-able step counter for liquidation pair creation and assignment
 * @returns
 */
export const useLiquidationPairSteps = () => {
  const [step, setStep] = useAtom(liquidationPairStepCounterAtom)

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    if (step !== 0) {
      setStep(step - 1)
    }
  }

  return { step, setStep, nextStep, prevStep }
}
