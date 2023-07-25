import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { useSteps } from '@hooks/useSteps'

const allVaultStepInfo: { title: string; info: ReactNode }[] = [
  {
    title: 'Choose a network and deposit token',
    info: `This is the asset users will deposit into your prize vault, and the network it belongs to!`
  },
  {
    title: 'Choose a yield source',
    info: `Choose from a list of audited ERC 4626 yield sources, or set your own custom ERC 4626 yield source.`
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
      // TODO: add links
      <>
        By default, prize vaults use the{' '}
        <a href='#' className='text-pt-teal-dark'>
          Cabana Claimer Bot
        </a>
        , however advanced users may want to run their own bot.{' '}
        <a href='#' className='text-pt-teal-dark'>
          Read our docs for more info.
        </a>
      </>
    )
  },
  {
    title: 'Deploy your vault',
    info: `Make sure your vault is set up correctly, then sign a transaction to deploy it onchain!`
  }
]

interface CreateVaultStepInfoProps {
  className?: string
}

export const CreateVaultStepInfo = (props: CreateVaultStepInfoProps) => {
  const { className } = props

  const { step } = useSteps()

  const { title, info } = useMemo(() => allVaultStepInfo[step] ?? { title: '?', info: '?' }, [step])

  return (
    <div className={classNames('flex flex-col', className)}>
      <span>
        {step + 1}/{allVaultStepInfo.length}
      </span>
      <h2 className='text-3xl'>{title}</h2>
      <span>{info}</span>
      <VaultStepGraphic className='mt-6' />
    </div>
  )
}

interface VaultStepGraphicProps {
  className?: string
}

const VaultStepGraphic = (props: VaultStepGraphicProps) => {
  const { className } = props

  const { step, setStep } = useSteps()

  const completedSteps = [...Array(step).keys()]
  const futureSteps =
    step < allVaultStepInfo.length ? [...Array(allVaultStepInfo.length - step - 1).keys()] : []

  return (
    <div className={classNames('flex gap-3', className)}>
      {completedSteps.map((i) => (
        <div
          key={`completed-${i}`}
          onClick={() => setStep(i)}
          className='w-3 h-3 bg-pt-teal-dark rounded-full cursor-pointer'
        />
      ))}
      <div className='w-9 h-3 bg-pt-purple-50 rounded-full' />
      {futureSteps.map((i) => (
        <div key={`future-${i}`} className='w-3 h-3 bg-pt-purple-50/50 rounded-full' />
      ))}
    </div>
  )
}
