import { useSelectedVault, useSelectedVaults } from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { ExternalLink } from '@shared/ui'
import { LINKS, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { PrizePoolPrizesCard } from './PrizePoolPrizesCard'

interface PrizePoolDisplayProps {
  onNetworkChange?: (chainId: NETWORK) => void
  className?: string
}

export const PrizePoolDisplay = (props: PrizePoolDisplayProps) => {
  const { onNetworkChange, className } = props

  const t = useTranslations('Prizes')

  return (
    <div className={classNames('flex flex-col items-center text-center', className)}>
      <span className='text-2xl font-grotesk text-pt-teal-dark font-medium md:text-4xl'>
        {t('currentPrizes')}
      </span>
      <PrizePoolCarousel onNetworkChange={onNetworkChange} className='mt-8 mb-4' />
      <span>
        *
        {t.rich('learnMore', {
          link: (chunks) => (
            <ExternalLink
              href={LINKS.protocolBasicsDocs}
              size='xs'
              className='text-pt-purple-200 md:text-base'
              iconClassName='md:h-5 md:w-5'
            >
              {chunks}
            </ExternalLink>
          )
        })}
      </span>
    </div>
  )
}

interface PrizePoolCarouselProps {
  onNetworkChange?: (chainId: NETWORK) => void
  className?: string
}

// TODO: animate between different prize pools
const PrizePoolCarousel = (props: PrizePoolCarouselProps) => {
  const { onNetworkChange, className } = props

  const searchParams = useSearchParams()

  // TODO: should ideally highlight the largest prize pool if no network is set by searchParams
  const [prizePoolIndex, setPrizePoolIndex] = useState<number>(0)

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { vaults } = useSelectedVaults()
  const { setSelectedVaultById } = useSelectedVault()

  const handleNetworkChange = (chainId: number) => {
    if (!!chainId && chainId in NETWORK) {
      const vaultsArray = Object.values(vaults.vaults)
      const firstVaultInChain = vaultsArray.find((vault) => vault.chainId === chainId)
      !!firstVaultInChain && setSelectedVaultById(firstVaultInChain.id)
      onNetworkChange?.(chainId)
    }
  }

  useEffect(() => {
    const rawUrlNetwork = searchParams?.get('network')
    const chainId =
      !!rawUrlNetwork && typeof rawUrlNetwork === 'string' ? parseInt(rawUrlNetwork) : undefined

    if (!!chainId) {
      handleNetworkChange(chainId)
      const prizePoolIndex = prizePoolsArray.findIndex((pool) => pool.chainId === chainId)
      prizePoolIndex !== -1 && setPrizePoolIndex(prizePoolIndex)
    }
  }, [searchParams])

  useEffect(() => {
    const chainId = prizePoolsArray[prizePoolIndex]?.chainId
    !!chainId && handleNetworkChange(chainId)
  }, [prizePoolIndex])

  const prevPrizePoolIndex = prizePoolIndex === 0 ? prizePoolsArray.length - 1 : prizePoolIndex - 1
  const nextPrizePoolIndex = prizePoolIndex === prizePoolsArray.length - 1 ? 0 : prizePoolIndex + 1

  // TODO: ideally this isn't hardcoded, and matches the number of relevant prize tiers of the largest prize pool
  const minPrizeRows = 6

  return (
    <div
      className={classNames(
        'relative w-screen flex justify-center gap-8 overflow-hidden',
        className
      )}
    >
      <PrizePoolPrizesCard
        prizePool={prizePoolsArray[prevPrizePoolIndex]}
        minPrizeRows={minPrizeRows}
        className='hidden w-[calc(100vw-4rem)] shrink-0 lg:w-[38rem] lg:flex'
      />
      <PrizePoolPrizesCard
        prizePool={prizePoolsArray[prizePoolIndex]}
        minPrizeRows={minPrizeRows}
        className='w-[calc(100vw-4rem)] shrink-0 lg:w-[38rem]'
      />
      <PrizePoolPrizesCard
        prizePool={prizePoolsArray[nextPrizePoolIndex]}
        minPrizeRows={minPrizeRows}
        className='hidden w-[calc(100vw-4rem)] shrink-0 lg:w-[38rem] lg:flex'
      />
      <div className='absolute w-full h-full pointer-events-none lg:bg-[linear-gradient(90deg,#21064E_15%,transparent_35%,transparent_65%,#21064E_85%)]'>
        <div className='relative w-full h-full max-w-screen-xl mx-auto'>
          <button
            onClick={() => setPrizePoolIndex(prevPrizePoolIndex)}
            className='absolute top-[calc(50%-0.75rem)] left-4 p-1 bg-pt-purple-600 rounded-full pointer-events-auto lg:top-[calc(50%-1rem)] lg:bg-pt-transparent'
          >
            <ArrowLongLeftIcon className='w-6 text-pt-purple-200 stroke-2 lg:w-8' />
          </button>
          <button
            onClick={() => setPrizePoolIndex(nextPrizePoolIndex)}
            className='absolute top-[calc(50%-0.75rem)] right-4 p-1 bg-pt-purple-600 rounded-full pointer-events-auto lg:top-[calc(50%-1rem)] lg:bg-pt-transparent'
          >
            <ArrowLongRightIcon className='w-6 text-pt-purple-200 stroke-2 lg:w-8' />
          </button>
        </div>
      </div>
    </div>
  )
}
