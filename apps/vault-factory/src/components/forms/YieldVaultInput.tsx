import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { TokenIcon } from '@shared/react-components'
import { Card, ExternalLink, LINKS, Spinner, Tooltip } from '@shared/ui'
import { getBlockExplorerUrl, getVaultId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { vaultChainIdAtom } from 'src/atoms'
import { SupportedNetwork, YieldSourceVaultTag } from 'src/types'
import { Address } from 'viem'
import { NETWORK_CONFIG, VAULT_TAGS } from '@constants/config'
import { useDeployedVaultYieldSourceAddresses } from '@hooks/useDeployedVaultYieldSourceAddresses'
import { useYieldSourceTokenAddress } from '@hooks/useYieldSourceTokenAddress'

interface YieldVaultInputFormValues {
  vaultYieldSourceAddress: string
}

interface YieldVaultInputProps {
  yieldVault: (typeof NETWORK_CONFIG)[SupportedNetwork]['yieldSources'][number]['vaults'][number]
  className?: string
}

export const YieldVaultInput = (props: YieldVaultInputProps) => {
  const { yieldVault, className } = props

  const chainId = useAtomValue(vaultChainIdAtom)

  const { register } = useFormContext<YieldVaultInputFormValues>()

  if (!chainId) {
    return <Spinner />
  }

  const id = `yieldVault-${yieldVault.address}`

  return (
    <div className={classNames('max-w-sm lg:max-w-[25%]', className)}>
      <input
        id={id}
        {...register('vaultYieldSourceAddress', {
          validate: { isSelected: (v: string) => !!v || 'Select a deposit token!' }
        })}
        type='radio'
        value={yieldVault.address}
        className='hidden'
      />
      <label htmlFor={id}>
        <YieldVaultCard chainId={chainId} yieldVault={yieldVault} />
      </label>
    </div>
  )
}

interface YieldVaultCardProps {
  chainId: SupportedNetwork
  yieldVault: (typeof NETWORK_CONFIG)[SupportedNetwork]['yieldSources'][number]['vaults'][number]
}

const YieldVaultCard = (props: YieldVaultCardProps) => {
  const { chainId, yieldVault } = props

  const { data: tokenAddress } = useYieldSourceTokenAddress(chainId, yieldVault.address)
  const { data: token } = useToken(chainId, tokenAddress as Address)

  const { data: deployedVaultYieldSourceAddresses } = useDeployedVaultYieldSourceAddresses(chainId)

  const existingVaultAddresses = useMemo(() => {
    return Object.entries(deployedVaultYieldSourceAddresses)
      .filter((entry) => entry[1] === yieldVault.address.toLowerCase())
      .map((entry) => entry[0] as Lowercase<Address>)
  }, [yieldVault, deployedVaultYieldSourceAddresses])

  const { vaultYieldSourceAddress } = useWatch<YieldVaultInputFormValues>()

  const isSelected =
    !!vaultYieldSourceAddress &&
    vaultYieldSourceAddress.toLowerCase() === yieldVault.address.toLowerCase()

  return (
    <Card
      wrapperClassName={classNames(
        'w-full h-full border cursor-pointer overflow-hidden hover:bg-pt-purple-50/20',
        { 'border-pt-teal-dark': isSelected, 'border-transparent': !isSelected }
      )}
      className='gap-3 !justify-start !p-6'
    >
      <div className='flex items-center gap-1'>
        {!!token ? (
          <>
            <TokenIcon token={token} />
            <span className='text-lg font-bold text-pt-purple-100'>{token.symbol}</span>
          </>
        ) : (
          <Spinner />
        )}
      </div>
      <ExternalLink
        href={getBlockExplorerUrl(chainId, yieldVault.address)}
        size='xs'
        className='text-blue-500 hover:underline'
      >
        {shorten(yieldVault.address)}
      </ExternalLink>
      {!!existingVaultAddresses.length && (
        <div className='flex items-center gap-1 whitespace-nowrap'>
          <Tooltip
            content={
              <div className='flex flex-col'>
                {existingVaultAddresses.map((existingVaultAddress) => (
                  <ExternalLink
                    key={getVaultId({ chainId, address: existingVaultAddress })}
                    href={`${LINKS.app}/vault/${chainId}/${existingVaultAddress}`}
                    size='xs'
                    className='text-pt-purple-700 hover:underline'
                  >
                    {shorten(existingVaultAddress)}
                  </ExternalLink>
                ))}
              </div>
            }
          >
            <div className='flex gap-1 items-center whitespace-nowrap'>
              <span className='text-xs text-pt-purple-100'>
                {existingVaultAddresses.length} existing prize vault
                {existingVaultAddresses.length > 1 ? 's' : ''}
              </span>
              <InformationCircleIcon className='h-3 w-3' />
            </div>
          </Tooltip>
        </div>
      )}
      <YieldVaultCardTags tags={yieldVault.tags} className='mt-auto' />
    </Card>
  )
}

interface YieldVaultCardTagsProps {
  tags?: YieldSourceVaultTag[]
  className?: string
}

const YieldVaultCardTags = (props: YieldVaultCardTagsProps) => {
  const { tags, className } = props

  if (!tags?.length) {
    return <></>
  }

  return (
    <div className={classNames('flex flex-wrap gap-x-3 gap-y-2', className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className='px-1.5 py-1 text-xs text-pt-purple-700 bg-pt-purple-100 whitespace-nowrap rounded'
        >
          {VAULT_TAGS[tag]}
        </span>
      ))}
    </div>
  )
}
