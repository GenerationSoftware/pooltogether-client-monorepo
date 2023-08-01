import { useAtom } from 'jotai'
import { vaultCreationStepCounterAtom } from 'src/atoms'

/**
 * Returns an easily update-able step counter
 * @returns
 */
export const useSteps = () => {
  const [step, setStep] = useAtom(vaultCreationStepCounterAtom)

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
