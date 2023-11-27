import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { usePromotionCreationSteps } from '@hooks/usePromotionCreationSteps'
import { PurpleButton } from './buttons/PurpleButton'
import { DeployedPromotionsTable } from './DeployedPromotionsTable'

export const HomePageContent = () => {
  const { address } = useAccount()

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  if (isBrowser) {
    return (
      <div className='w-full max-w-[1440px] flex flex-col grow gap-5 items-center justify-center px-4 lg:px-0'>
        {/* TODO: if wallet is connected, display user rewards separately */}
        <div className='w-full relative flex items-center'>
          <span className='mx-auto text-3xl'>All Rewards</span>
          <DeployNewPromotionButton className='absolute hidden right-0 lg:block' />
        </div>
        <DeployedPromotionsTable className='w-full' />
        <DeployNewPromotionButton className='lg:hidden' />
      </div>
    )
  }

  return <></>
}

interface DeployNewPromotionButtonProps {
  className?: string
}

const DeployNewPromotionButton = (props: DeployNewPromotionButtonProps) => {
  const { className } = props

  const router = useRouter()

  const { setStep } = usePromotionCreationSteps()

  const onClickDeploy = () => {
    setStep(0)
    router.replace('/create')
  }

  return (
    <PurpleButton onClick={onClickDeploy} className={className}>
      Deploy New Rewards
    </PurpleButton>
  )
}
