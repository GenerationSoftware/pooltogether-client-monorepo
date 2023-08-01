import { Button, LINKS } from '@shared/ui'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { DeployedVaultsTable } from '@components/DeployedVaultsTable'
import { AddDeployedVaultForm } from '@components/forms/AddDeployedVaultForm'
import { Layout } from '@components/Layout'
import { VaultsIntro } from '@components/VaultsIntro'

export default function HomePage() {
  const { address } = useAccount()

  return (
    <Layout>
      {!!address ? (
        <div className='w-full flex flex-col grow gap-5 items-center justify-center'>
          <div className='w-full max-w-[1440px] relative flex items-center'>
            <span className='mx-auto text-3xl'>Your Prize Vaults</span>
            <Link href='/create' passHref={true} className='absolute right-0'>
              <PurpleButton>Deploy a Prize Vault</PurpleButton>
            </Link>
          </div>
          <DeployedVaultsTable className='mb-8' />
          <AddDeployedVaultForm className='w-full max-w-sm' />
        </div>
      ) : (
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
      )}
    </Layout>
  )
}
