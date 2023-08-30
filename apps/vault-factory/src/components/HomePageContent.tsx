import { Button, LINKS } from '@shared/ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { PurpleButton } from './buttons/PurpleButton'
import { DeployedVaultsTable } from './DeployedVaultsTable'
import { AddDeployedVaultForm } from './forms/AddDeployedVaultForm'
import { VaultsIntro } from './VaultsIntro'

export const HomePageContent = () => {
  const { address } = useAccount()

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  if (!!address && isBrowser) {
    return (
      <div className='w-full max-w-[1440px] flex flex-col grow gap-5 items-center justify-center px-4 lg:px-0'>
        <div className='w-full relative flex items-center'>
          <span className='mx-auto text-3xl'>Your Prize Vaults</span>
          <DeployNewVaultButton className='absolute hidden right-0 lg:block' />
        </div>
        <DeployedVaultsTable className='w-full' />
        <DeployNewVaultButton className='lg:hidden' />
        <AddDeployedVaultForm className='w-full mt-8' />
      </div>
    )
  }

  return (
    <div className='flex flex-col grow gap-8 items-center justify-center px-4 lg:px-0'>
      <VaultsIntro />
      {/* TODO: add video tutorial once available */}
      <div className='flex flex-col gap-4 items-center sm:flex-row'>
        <DeployNewVaultButton />
        <Button href={LINKS.factoryDocs} target='_blank'>
          Read the Docs
        </Button>
      </div>
    </div>
  )
}

interface DeployNewVaultButtonProps {
  className?: string
}

const DeployNewVaultButton = (props: DeployNewVaultButtonProps) => {
  const { className } = props

  const router = useRouter()

  const { setStep } = useVaultCreationSteps()

  const onClickDeploy = () => {
    setStep(0)
    router.replace('/create')
  }

  return (
    <PurpleButton onClick={onClickDeploy} className={className}>
      Deploy a Prize Vault
    </PurpleButton>
  )
}
