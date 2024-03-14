import { LINKS } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { ReactNode, useEffect, useMemo } from 'react'
import { isUsingCustomYieldSourceAtom } from 'src/atoms'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { useVaultInfo } from '@hooks/useVaultInfo'
import { StepInfo } from './StepInfo'

export const allVaultStepInfo: { title: string; info: ReactNode }[] = [
  {
    title: 'Choose a network',
    info: `This is the network your prize vault will be deployed on!`
  },
  {
    title: 'Choose a yield source',
    info: `Choose from a list of audited and compatible ERC-4626 yield sources to provide yield for your prize vault, or use your own.`
  },
  {
    title: 'Choose a token',
    info: `Choose the deposit token to use with ???`
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

  const { yieldSourceName } = useVaultInfo()

  const isUsingCustomYieldSource = useAtomValue(isUsingCustomYieldSourceAtom)

  useEffect(() => {
    allVaultStepInfo[2].info = `Choose the deposit token to use with ${yieldSourceName ?? '???'}`
  }, [yieldSourceName])

  const blockedSteps = useMemo(() => {
    const blocked: number[] = []

    if (step > 2 && isUsingCustomYieldSource) {
      blocked.push(2)
    }

    if (step > 6) {
      blocked.push(...[...Array(6).keys()])
    }

    return blocked
  }, [step, isUsingCustomYieldSource])

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
