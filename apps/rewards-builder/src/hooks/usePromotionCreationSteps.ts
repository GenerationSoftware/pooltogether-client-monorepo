import { useAtom } from 'jotai'
import { promotionCreationStepCounterAtom } from 'src/atoms'

/**
 * Returns an easily update-able step counter for promotion creation
 * @returns
 */
export const usePromotionCreationSteps = () => {
  const [step, setStep] = useAtom(promotionCreationStepCounterAtom)

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
