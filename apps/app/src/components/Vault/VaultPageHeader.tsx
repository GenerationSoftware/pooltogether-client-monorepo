import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Vault } from '@pooltogether/hyperstructure-client-js'
import { NetworkBadge, TokenIcon } from '@shared/react-components'
import classNames from 'classnames'
import { useRouter } from 'next/router'

interface VaultPageHeaderProps {
  vault: Vault
  className?: string
}

export const VaultPageHeader = (props: VaultPageHeaderProps) => {
  const { vault, className } = props

  const router = useRouter()

  return (
    <>
      <div
        className={classNames('w-full max-w-screen-md flex flex-col gap-2 items-center', className)}
      >
        <div className='w-full flex relative justify-center items-center'>
          <BackButton />
          <div className='w-full max-w-[85%] inline-flex justify-center gap-2 items-center md:max-w-none'>
            <TokenIcon
              token={{
                chainId: vault.chainId,
                address: vault.address,
                name: vault.name,
                logoURI: vault.logoURI
              }}
              className='h-6 w-6 md:h-8 md:w-8'
            />
            <span className='text-2xl font-semibold font-averta whitespace-nowrap overflow-hidden overflow-ellipsis md:text-4xl'>
              {vault.name}
            </span>
          </div>
        </div>
        <NetworkBadge
          chainId={vault.chainId}
          appendText='Prize Pool'
          onClick={() => router.push(`/prizes?network=${vault.chainId}`)}
        />
      </div>
    </>
  )
}

// TODO: this button should return to wherever the user came from, not just the /vaults page
const BackButton = () => {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push('/vaults')}
      className='absolute left-0 flex items-center gap-2 text-pt-purple-100 cursor-pointer md:left-9'
    >
      <ArrowLeftIcon className='h-6 w-6 md:h-4 md:w-4' />
      <span className='hidden text-xs font-medium md:block'>Back</span>
    </div>
  )
}
