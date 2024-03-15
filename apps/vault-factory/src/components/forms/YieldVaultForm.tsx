import { Selection, SelectionItem, Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { vaultChainIdAtom, vaultYieldSourceAddressAtom, vaultYieldSourceIdAtom } from 'src/atoms'
import { YieldSourceVaultTag } from 'src/types'
import { Address } from 'viem'
import { NextButton } from '@components/buttons/NextButton'
import { PrevButton } from '@components/buttons/PrevButton'
import { NETWORK_CONFIG } from '@constants/config'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { YieldVaultInput } from './YieldVaultInput'

export interface YieldVaultFormValues {
  vaultYieldSourceAddress: string
}

interface YieldVaultFormProps {
  className?: string
}

export const YieldVaultForm = (props: YieldVaultFormProps) => {
  const { className } = props

  const formMethods = useForm<YieldVaultFormValues>({ mode: 'onChange' })

  const chainId = useAtomValue(vaultChainIdAtom)
  const vaultYieldSourceId = useAtomValue(vaultYieldSourceIdAtom)
  const [vaultYieldSourceAddress, setVaultYieldSourceAddress] = useAtom(vaultYieldSourceAddressAtom)

  const { nextStep } = useVaultCreationSteps()

  const [filterId, setFilterId] = useState<'all' | YieldSourceVaultTag>('all')

  useEffect(() => {
    !!vaultYieldSourceAddress &&
      formMethods.setValue('vaultYieldSourceAddress', vaultYieldSourceAddress, {
        shouldValidate: true
      })
  }, [])

  const onSubmit = (data: YieldVaultFormValues) => {
    setVaultYieldSourceAddress(data.vaultYieldSourceAddress.trim() as Address)
    nextStep()
  }

  const yieldSource = useMemo(() => {
    if (!!chainId) {
      return NETWORK_CONFIG[chainId].yieldSources.find(
        (yieldSource) => yieldSource.id === vaultYieldSourceId
      )
    }
  }, [chainId, vaultYieldSourceId])

  const yieldVaults = useMemo(() => {
    if (!!yieldSource) {
      return filterId === 'all'
        ? yieldSource.vaults
        : yieldSource.vaults.filter((yieldVault) => yieldVault.tags?.includes(filterId))
    }
  }, [yieldSource, filterId])

  if (!chainId || !yieldSource || !yieldVaults) {
    return <Spinner />
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className={classNames('flex flex-col grow gap-12 items-center', className)}
      >
        <div className='w-full flex flex-col gap-4 items-center'>
          <span className='text-sm font-medium text-pt-purple-100'>Select Deposit Token</span>
          <YieldVaultFilterSelection
            allYieldVaults={yieldSource.vaults}
            selectedFilterId={filterId}
            onSelectFilter={setFilterId}
          />
          <div className='w-full h-[50vh] max-w-screen-md p-6 bg-pt-transparent rounded-2xl overflow-y-auto'>
            <div className='w-full flex flex-wrap justify-center gap-6'>
              {yieldVaults.map((yieldVault) => (
                <YieldVaultInput
                  key={`${yieldSource.id}-${chainId}-${yieldVault.address}`}
                  yieldVault={yieldVault}
                  className='w-full'
                />
              ))}
            </div>
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <PrevButton />
          <NextButton disabled={!formMethods.formState.isValid} />
        </div>
      </form>
    </FormProvider>
  )
}

interface YieldVaultFilterSelectionProps {
  allYieldVaults: { tags?: YieldSourceVaultTag[] }[]
  selectedFilterId: 'all' | YieldSourceVaultTag
  onSelectFilter: (id: 'all' | YieldSourceVaultTag) => void
  className?: string
}

const YieldVaultFilterSelection = (props: YieldVaultFilterSelectionProps) => {
  const { allYieldVaults, selectedFilterId, onSelectFilter, className } = props

  const isTagPresent = (vaults: { tags?: YieldSourceVaultTag[] }[], tag: YieldSourceVaultTag) => {
    return !!vaults.find((vault) => vault.tags?.includes(tag))
  }

  const filterItems = useMemo(() => {
    const items: SelectionItem[] = [
      {
        id: 'all',
        content: 'Show All',
        onClick: () => onSelectFilter('all'),
        className: 'whitespace-nowrap'
      }
    ]

    if (isTagPresent(allYieldVaults, 'stablecoin')) {
      items.push({
        id: 'stablecoin',
        content: 'Stablecoins',
        onClick: () => onSelectFilter('stablecoin')
      })
    }

    if (isTagPresent(allYieldVaults, 'lp')) {
      items.push({
        id: 'lp',
        content: 'LP Tokens',
        onClick: () => onSelectFilter('lp'),
        className: 'whitespace-nowrap'
      })
    }

    if (isTagPresent(allYieldVaults, 'lst')) {
      items.push({
        id: 'lst',
        content: 'Liquid Staking',
        onClick: () => onSelectFilter('lst'),
        className: 'whitespace-nowrap'
      })
    }

    return items
  }, [allYieldVaults])

  return (
    <Selection
      items={filterItems}
      activeItem={selectedFilterId}
      buttonColor='purple'
      className={classNames('flex-wrap justify-center', className)}
    />
  )
}
