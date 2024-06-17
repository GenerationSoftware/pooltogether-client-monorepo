import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePublicClientsByChain,
  useSelectedVaultLists,
  useSelectedVaults,
  useVaultShareData,
  useVaultTokenAddress,
  useVaultYieldSource
} from '@generationsoftware/hyperstructure-react-hooks'
import {
  AlertIcon,
  DelegateButton,
  DepositButton,
  ErrorPooly,
  WithdrawButton
} from '@shared/react-components'
import { VaultInfo } from '@shared/types'
import { Button, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, getVaultId, LINKS, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import * as fathom from 'fathom-client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { AnchorHTMLAttributes, DetailedHTMLProps, useMemo } from 'react'
import { Address, isAddress } from 'viem'
import { FATHOM_EVENTS, SUPPORTED_NETWORKS } from '@constants/config'
import { useNetworks } from '@hooks/useNetworks'
import { VaultPageHeader } from './VaultPageHeader'
import { VaultPageInfo } from './VaultPageInfo'

interface VaultPageContentProps {
  queryParams: ParsedUrlQuery
}

export const VaultPageContent = (props: VaultPageContentProps) => {
  const { queryParams } = props

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

  if (!!chainId && !isFetchedVaultTokenAddress) {
    return (
      <>
        <VaultPageHeader vault={vault} className='max-w-[44rem]' />
        <Spinner />
      </>
    )
  }

  return (
    <>
      <VaultPageHeader vault={vault} className='max-w-[44rem]' />
      {!!vault && !!vaultTokenAddress ? (
        <>
          <Buttons vault={vault} className='max-w-[44rem] -mt-4' />
          <NotInVaultListsWarning vault={vault} className='max-w-[44rem]' />
          <VaultPageInfo
            vault={vault}
            show={['userBalance', 'userDelegationBalance', 'userWinChance']}
            className='max-w-[44rem]'
          />
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
            className='max-w-[44rem]'
          />
          <Disclaimer vault={vault} className='max-w-[44rem]' />
        </>
      ) : (
        <ErrorState chainId={rawChainId} tokenAddress={vaultTokenAddress} />
      )}
    </>
  )
}

interface ButtonsProps {
  vault: Vault
  className?: string
}

const Buttons = (props: ButtonsProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_tooltips = useTranslations('Tooltips')

  return (
    <div className={classNames('flex items-center gap-2 md:gap-4', className)}>
      <DepositButton
        vault={vault}
        extraOnClick={() => fathom.trackEvent(FATHOM_EVENTS.openedDepositModal)}
        intl={{ base: t_common, tooltips: t_tooltips }}
      />
      <WithdrawButton
        vault={vault}
        extraOnClick={() => fathom.trackEvent(FATHOM_EVENTS.openedWithdrawModal)}
        color='transparent'
      >
        {t_common('withdraw')}
      </WithdrawButton>
      <DelegateButton
        vault={vault}
        extraOnClick={() => fathom.trackEvent(FATHOM_EVENTS.openedDelegateModal)}
        color='transparent'
      >
        {t_common('delegate')}
      </DelegateButton>
    </div>
  )
}

interface NotInVaultListsWarningProps {
  vault: Vault
  className?: string
}

const NotInVaultListsWarning = (props: NotInVaultListsWarningProps) => {
  const { vault, className } = props

  const t = useTranslations('Vault')

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()
  const allVaultLists = Object.values({ ...localVaultLists, ...importedVaultLists })

  const vaultListEntries = useMemo(() => {
    const entries: VaultInfo[] = []

    if (!!vault) {
      allVaultLists.forEach((list) => {
        for (const entry of list.tokens) {
          if (vault.id === getVaultId(entry)) {
            entries.push(entry)
          }
        }
      })
    }

    return entries
  }, [vault, allVaultLists])

  if (!vault || vaultListEntries.length > 0) {
    return <></>
  }

  return (
    <span
      className={classNames(
        'w-full px-6 py-1 text-center text-sm font-medium bg-pt-warning-light text-pt-warning-dark rounded',
        className
      )}
    >
      {t('shortWarningNotInVaultLists')}
    </span>
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
