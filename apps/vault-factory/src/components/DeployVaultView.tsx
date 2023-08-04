import { XMarkIcon } from '@heroicons/react/24/outline'
import { Spinner, toast } from '@shared/ui'
import {
  getBlockExplorerName,
  getBlockExplorerUrl,
  getNiceNetworkNameByChainId,
  NETWORK
} from '@shared/utilities'
import classNames from 'classnames'
import { useSetAtom } from 'jotai'
import { vaultAddressAtom } from 'src/atoms'
import { useDeployedVaults } from '@hooks/useDeployedVaults'
import { useSteps } from '@hooks/useSteps'
import { DeployVaultButton } from './buttons/DeployVaultButton'
import { PrevButton } from './buttons/PrevButton'
import { PurpleButton } from './buttons/PurpleButton'
import { VaultPreview } from './VaultPreview'

interface DeployVaultViewProps {
  className?: string
}

export const DeployVaultView = (props: DeployVaultViewProps) => {
  const { className } = props

  const { nextStep } = useSteps()

  return (
    <div className={classNames('flex flex-col grow gap-12 items-center', className)}>
      <VaultPreview className='w-full max-w-md' />
      <div className='flex gap-2 items-center'>
        <PrevButton className='w-36' />
        <DeployVaultButton onSuccess={nextStep} />
        {/* TODO: remove test deploy button */}
        <TestDeployVaultButton onSuccess={nextStep} />
      </div>
    </div>
  )
}

const TestDeployVaultButton = (props: { onSuccess?: () => void }) => {
  const { onSuccess } = props

  const setVaultAddress = useSetAtom(vaultAddressAtom)

  const { addVault } = useDeployedVaults()

  const toastId = 'testToastPlsIgnore'
  const chainId = NETWORK.sepolia
  const address = '0x041a898Bc37129d2D2232163c3374f4077255F74'
  const txHash = '0x48b3f62b517c0c29fb78e5f8d2c670d274d7c376032ea29bf97009d41cca498a'
  const network = getNiceNetworkNameByChainId(chainId)
  const name = getBlockExplorerName(chainId)

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

  const handleClick = async () => {
    toast(
      <div className='relative w-full flex flex-col gap-2 items-center text-center smSonner:w-80'>
        <span className='flex items-center gap-2 text-pt-purple-50'>
          <Spinner className='after:border-y-pt-teal' /> Deploying prize vault...
        </span>
        <a
          href={getBlockExplorerUrl(chainId, txHash, 'tx')}
          target='_blank'
          className='text-xs text-pt-teal'
        >
          View on {name}
        </a>
        <XMarkIcon
          className='absolute top-0 right-0 h-3 w-3 text-pt-purple-100 cursor-pointer'
          onClick={() => toast.dismiss(toastId)}
        />
      </div>,
      { id: toastId }
    )
    await delay(10_000)
    setVaultAddress(address)
    addVault({ chainId, address })
    toast(
      <div className='relative w-full flex flex-col gap-2 items-center text-center smSonner:w-80'>
        <div className='flex flex-col items-center text-center'>
          <span className='text-xl font-semibold text-pt-teal'>Success!</span>
          <span className='text-pt-purple-50'>You deployed a prize vault on {network}</span>
        </div>
        <a
          href={getBlockExplorerUrl(chainId, txHash, 'tx')}
          target='_blank'
          className='text-xs text-pt-teal'
        >
          View on {name}
        </a>
        <XMarkIcon
          className='absolute top-0 right-0 h-3 w-3 text-pt-purple-100 cursor-pointer'
          onClick={() => toast.dismiss(toastId)}
        />
      </div>,
      { id: toastId }
    )
    onSuccess?.()
  }

  return <PurpleButton onClick={handleClick}>Test Deploy Button</PurpleButton>
}
