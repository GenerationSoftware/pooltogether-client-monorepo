import { useTokenBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { SupportedNetwork } from 'src/types'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { useVaultInfo } from '@hooks/useVaultInfo'
import { DeployVaultButton } from './buttons/DeployVaultButton'
import { PrevButton } from './buttons/PrevButton'
import { VaultPreview } from './VaultPreview'

interface DeployVaultViewProps {
  className?: string
}

export const DeployVaultView = (props: DeployVaultViewProps) => {
  const { className } = props

  const { nextStep } = useVaultCreationSteps()

  return (
    <div className={classNames('flex flex-col grow gap-8 items-center', className)}>
      <VaultPreview className='max-w-md' />
      <DeployVaultViewWarnings className='max-w-md' />
      <div className='flex gap-2 items-center'>
        <PrevButton className='w-36' />
        <DeployVaultButton onSuccess={nextStep} />
      </div>
    </div>
  )
}

// TODO: add invalid yield source warning
// TODO: add precision per dollar check warning
const DeployVaultViewWarnings = (props: { className?: string }) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const { chainId, tokenAddress, yieldBuffer } = useVaultInfo()

  const { data: token } = useTokenBalance(
    chainId as SupportedNetwork,
    userAddress as Address,
    tokenAddress as Address,
    { refetchOnWindowFocus: true }
  )

  const warning = useMemo(():
    | { text: string; fix?: { text: string; onClick: () => void } }
    | undefined => {
    if (!!token && !!yieldBuffer && token.amount < yieldBuffer) {
      return {
        text: `You need at least ${formatUnits(yieldBuffer, token.decimals)} ${
          token.symbol
        } on ${getNiceNetworkNameByChainId(
          token.chainId
        )} to deploy this prize vault. These tokens are donated to your new prize vault to prevent potential rounding errors.`
      }
    }
  }, [token, yieldBuffer])

  if (!warning) {
    return <></>
  }

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-3 px-8 py-5 text-pt-warning-light bg-pt-transparent',
        'border border-pt-purple-100 rounded-2xl',
        className
      )}
    >
      <span className='text-xl font-bold'>Warning</span>
      <span className='text-sm leading-tight'>{warning.text}</span>
      {!!warning.fix && (
        <button onClick={warning.fix.onClick} className='text-pt-teal-dark'>
          {warning.fix.text}
        </button>
      )}
    </div>
  )
}
