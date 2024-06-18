import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePublicClientsByChain,
  useSelectedVaults,
  useVaultPromotionsApr,
  useVaultShareData,
  useVaultTokenAddress,
  useVaultYieldSource
} from '@generationsoftware/hyperstructure-react-hooks'
import { AlertIcon, ErrorPooly } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, getVaultId, LINKS, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { AnchorHTMLAttributes, DetailedHTMLProps, useMemo } from 'react'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { SUPPORTED_NETWORKS, TWAB_REWARDS_SETTINGS } from '@constants/config'
import { useNetworks } from '@hooks/useNetworks'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { VaultPageBonusRewardsSection } from './VaultPageBonusRewardsSection'
import { VaultPageButtons } from './VaultPageButtons'
import { VaultPageCards } from './VaultPageCards'
import { VaultPageHeader } from './VaultPageHeader'
import { VaultPageInfo } from './VaultPageInfo'
import { VaultPagePrizesSection } from './VaultPagePrizesSection'
import { VaultPageVaultListWarning } from './VaultPageVaultListWarning'

interface VaultPageContentProps {
  queryParams: ParsedUrlQuery
}

export const VaultPageContent = (props: VaultPageContentProps) => {
  const { queryParams } = props

  const { address: userAddress } = useAccount()

  const networks = useNetworks()
  const clientsByChain = usePublicClientsByChain()

  const { vaults } = useSelectedVaults()

  const rawChainId =
    !!queryParams.chainId && typeof queryParams.chainId === 'string'
      ? parseInt(queryParams.chainId)
      : undefined

  const chainId =
    !!rawChainId && networks.includes(rawChainId) ? (rawChainId as NETWORK) : undefined

  const address =
    !!queryParams.vaultAddress &&
    typeof queryParams.vaultAddress === 'string' &&
    isAddress(queryParams.vaultAddress)
      ? queryParams.vaultAddress
      : undefined

  const vault = useMemo(() => {
    if (!!chainId && !!address) {
      const vaultId = getVaultId({ chainId, address })
      return vaults?.vaults[vaultId] ?? new Vault(chainId, address, clientsByChain[chainId])
    }
  }, [chainId, address, vaults])

  const { data: vaultTokenAddress, isFetched: isFetchedVaultTokenAddress } = useVaultTokenAddress(
    vault!
  )

  const prizePoolsArray = Object.values(useSupportedPrizePools())
  const prizePool = prizePoolsArray.find((prizePool) => prizePool.chainId === vault?.chainId)
  const tokenAddresses = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].tokenAddresses : []
  const { data: vaultPromotionsApr } = useVaultPromotionsApr(vault!, prizePool!, tokenAddresses, {
    fromBlock: !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].fromBlock : undefined
  })

  const maxWidthClassName = 'max-w-screen-md'

  if (!!chainId && !isFetchedVaultTokenAddress) {
    return (
      <>
        <VaultPageHeader vault={vault} className={maxWidthClassName} />
        <Spinner />
      </>
    )
  }

  return (
    <>
      <VaultPageHeader vault={vault} className={maxWidthClassName} />
      {!!vault && !!vaultTokenAddress ? (
        <>
          <VaultPageButtons vault={vault} className={classNames(maxWidthClassName, '-mt-4')} />
          <VaultPageVaultListWarning vault={vault} className={maxWidthClassName} />
          {!!userAddress && (
            <VaultPageInfo
              vault={vault}
              show={['userBalance', 'userDelegationBalance', 'userWinChance']}
              className={maxWidthClassName}
            />
          )}
          <VaultPageCards vault={vault} className={maxWidthClassName} />
          {!!prizePool && (
            <div
              className={classNames(
                'w-full grid grid-cols-1 gap-3',
                { 'md:grid-cols-2': !!vaultPromotionsApr },
                maxWidthClassName
              )}
            >
              <VaultPagePrizesSection prizePool={prizePool} />
              {!!vaultPromotionsApr && (
                <VaultPageBonusRewardsSection vault={vault} prizePool={prizePool} />
              )}
            </div>
          )}
          {/* TODO: add recent winners on this vault */}
          <VaultPageInfo
            vault={vault}
            show={[
              'prizeToken',
              'depositToken',
              'vaultOwner',
              'vaultFee',
              'vaultFeeRecipient',
              'lpSourceURI'
            ]}
            className={maxWidthClassName}
          />
          {/* TODO: add bar chart of prize pool contributions over time (7d or 30d) - maybe include prize yield line? */}
          <Disclaimer vault={vault} className={maxWidthClassName} />
        </>
      ) : (
        <ErrorState chainId={rawChainId} tokenAddress={vaultTokenAddress} />
      )}
    </>
  )
}

interface DisclaimerProps {
  vault: Vault
  className?: string
}

const Disclaimer = (props: DisclaimerProps) => {
  const { vault, className } = props

  const t_vault = useTranslations('Vault')

  const { data: share } = useVaultShareData(vault)
  const { data: yieldSourceAddress } = useVaultYieldSource(vault)

  const linkProps: Partial<
    DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
  > = { target: '_blank', className: 'text-pt-purple-300 hover:text-pt-purple-400' }

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-4 items-center p-6 text-pt-purple-100 bg-pt-transparent rounded-lg',
        className
      )}
    >
      <div className='flex gap-2 items-center'>
        <AlertIcon className='w-5 h-5' />
        <span className='lg:font-semibold'>
          {t_vault('learnAboutVault', { vaultName: vault.name ?? share?.name ?? '?' })}
        </span>
      </div>
      <span>
        {t_vault.rich('smartContractRisk', {
          docsLink: (chunks) => (
            <a href={LINKS.docs} {...linkProps}>
              {chunks}
            </a>
          ),
          vaultLink: (chunks) => (
            <a href={getBlockExplorerUrl(vault.chainId, vault.address)} {...linkProps}>
              {chunks}
            </a>
          ),
          yieldLink: (chunks) => (
            <a
              href={getBlockExplorerUrl(
                vault.chainId,
                yieldSourceAddress ?? `${vault.address}/#readContract`
              )}
              {...linkProps}
            >
              {chunks}
            </a>
          )
        })}
      </span>
    </div>
  )
}

interface ErrorStateProps {
  chainId?: number
  tokenAddress?: Address
  className?: string
}

const ErrorState = (props: ErrorStateProps) => {
  const { chainId, tokenAddress, className } = props

  const t_vault = useTranslations('Vault')
  const t_error = useTranslations('Error')

  const networks = useNetworks()

  const isInvalidNetwork = !chainId || !networks.includes(chainId)
  const isInvalidInterface = !tokenAddress

  return (
    <div
      className={classNames(
        'w-full max-w-md flex flex-col gap-6 items-center text-center',
        className
      )}
    >
      <ErrorPooly className='w-full max-w-[50%]' />
      {isInvalidNetwork ? (
        <div className='flex flex-col gap-2'>
          <span>{t_error('vaultInvalidNetwork')}</span>
          {!!chainId && SUPPORTED_NETWORKS.testnets.includes(chainId) && (
            <span>{t_error('vaultEnableTestnets')}</span>
          )}
          {!!chainId && SUPPORTED_NETWORKS.mainnets.includes(chainId) && (
            <span>{t_error('vaultDisableTestnets')}</span>
          )}
        </div>
      ) : isInvalidInterface ? (
        <span>{t_error('vaultInvalidInterface')}</span>
      ) : (
        <span>{t_error('vaultQueryError')}</span>
      )}
      <Link href='/vaults' passHref={true}>
        <Button>{t_vault('returnToVaults')}</Button>
      </Link>
    </div>
  )
}
