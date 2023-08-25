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
  const router = useRouter()

  const { address } = useAccount()

  const { setStep } = useVaultCreationSteps()

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  const onClickDeploy = () => {
    setStep(0)
    router.replace('/create')
  }

  if (!!address && isBrowser) {
    return (
      <div className='w-full max-w-[1440px] flex flex-col grow gap-5 items-center justify-center'>
        <div className='w-full relative flex items-center'>
          <span className='mx-auto text-3xl'>Your Prize Vaults</span>
          <PurpleButton onClick={onClickDeploy} className='absolute right-0'>
            Deploy a Prize Vault
          </PurpleButton>
        </div>
        <DeployedVaultsTable className='w-full mb-8' />
        <AddDeployedVaultForm className='w-full max-w-sm' />
      </div>
    )
  }

  return (
    <div className='flex flex-col grow gap-8 items-center justify-center'>
      <VaultsIntro />
      {/* TODO: add video tutorial once available */}
      <div className='flex gap-4 items-center'>
        <PurpleButton onClick={onClickDeploy}>Deploy a Prize Vault</PurpleButton>
        <Button href={LINKS.factoryDocs} target='_blank'>
          Read the Docs
        </Button>
      </div>
    </div>
  )
}
