import { Button, LINKS } from '@shared/ui'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
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
      <div className='w-full max-w-[1440px] flex flex-col grow gap-5 items-center justify-center'>
        <div className='w-full relative flex items-center'>
          <span className='mx-auto text-3xl'>Your Prize Vaults</span>
          <Link href='/create' passHref={true} className='absolute right-0'>
            <PurpleButton>Deploy a Prize Vault</PurpleButton>
          </Link>
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
        <Link href='/create' passHref={true}>
          <PurpleButton>Deploy a Prize Vault</PurpleButton>
        </Link>
        {/* TODO: add more specific docs link */}
        <Button href={LINKS.docs} target='_blank'>
          Read the Docs
        </Button>
      </div>
    </div>
  )
}
