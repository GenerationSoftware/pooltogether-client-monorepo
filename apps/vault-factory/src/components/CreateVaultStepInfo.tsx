import { LINKS } from '@shared/ui'
import { ReactNode, useMemo } from 'react'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { StepInfo } from './StepInfo'

export const allVaultStepInfo: { title: string; info: ReactNode }[] = [
  {
    title: 'Choose a network',
    info: `This is network your prize vault will be deployed on!`
  },
  {
    title: 'Choose a yield source',
    info: `Any ERC-4626 compatible yield source can be used to generate yield for your prize vault.`
  },
  {
    title: 'Configure ownership and vault fees',
    info: `Set the owner of this vault, and optionally configure a percentage of yield to go a specific address.`
  },
  {
    title: 'Name your vault',
    info: `Give your vault a name and symbol! Users may see these in their wallets after depositing, so pick something easy to understand.`
  },
  {
    title: 'Configure a claimer',
    info: (
      <>
        By default, all vaults use the same claimer contract to make it easy for bots to claim
        prizes. If you'd like to set up prize claims differently, or claim them yourself, set
        another contract address here.{' '}
        <a href={LINKS.protocolDevDocs} target='_blank' className='text-pt-teal-dark'>
          Read our docs for more info.
        </a>
      </>
    )
  },
  {
    title: 'Deploy your vault',
    info: `Make sure your vault is set up correctly, then sign a transaction to deploy it onchain!`
  },
  {
    title: 'Deploy your liquidation pair',
    info: `This is the contract that enables your prize vault's yield to be liquidated for POOL prizes. We've set some initial settings automatically, but feel free to customize these.`
  },
  {
    title: 'Set the liquidation pair to your prize vault',
    info: `This transaction will configure your prize vault to use the liquidation pair contract you've just deployed!`
  }
]

interface CreateVaultStepInfoProps {
  className?: string
}

export const CreateVaultStepInfo = (props: CreateVaultStepInfoProps) => {
  const { className } = props

  const { step, setStep } = useVaultCreationSteps()

  const blockedSteps = useMemo(() => {
    if (step >= 6) {
      return [...Array(6).keys()]
    }
    return []
  }, [step])

  return (
    <StepInfo
      step={step}
      stepInfo={allVaultStepInfo}
      setStep={setStep}
      blockedSteps={blockedSteps}
      className={className}
    />
  )
}
