import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePublicClientsByChain,
  useSelectedVaultLists,
  useSelectedVaults,
  useVaultPromotionsApr,
  useVaultShareData,
  useVaultTokenAddress,
  useVaultYieldSource
} from '@generationsoftware/hyperstructure-react-hooks'
import { useScreenSize } from '@shared/generic-react-hooks'
import {
  AlertIcon,
  DelegateButton,
  DepositButton,
  ErrorPooly,
  WithdrawButton
} from '@shared/react-components'
import { VaultInfo } from '@shared/types'
import { Button, Card, ExternalLink, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, getVaultId, LINKS, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import * as fathom from 'fathom-client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { AnchorHTMLAttributes, DetailedHTMLProps, ReactNode, useMemo } from 'react'
import { getCleanURI } from 'src/utils'
import { Address, isAddress } from 'viem'
import { PrizePoolPrizesCard } from '@components/Prizes/PrizePoolPrizesCard'
import { FATHOM_EVENTS, SUPPORTED_NETWORKS, TWAB_REWARDS_SETTINGS } from '@constants/config'
import { useNetworks } from '@hooks/useNetworks'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { VaultBonusRewards } from './VaultBonusRewards'
import { VaultPageHeader } from './VaultPageHeader'
import { VaultPageInfo } from './VaultPageInfo'
import { VaultPrizeYield } from './VaultPrizeYield'
import { VaultTotalDeposits } from './VaultTotalDeposits'
import { VaultWinChance } from './VaultWinChance'

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
          <Buttons vault={vault} className={classNames(maxWidthClassName, '-mt-4')} />
          <NotInVaultListsWarning vault={vault} className={maxWidthClassName} />
          <VaultPageInfo
            vault={vault}
            show={['userBalance', 'userDelegationBalance', 'userWinChance']}
            className={maxWidthClassName}
          />
          <Cards vault={vault} className={maxWidthClassName} />
          <div
            className={classNames(
              'w-full grid grid-cols-1 gap-3',
              { 'md:grid-cols-2': !!vaultPromotionsApr },
              maxWidthClassName
            )}
          >
            {!!prizePool && <PrizesSection prizePool={prizePool} />}
            {!!vaultPromotionsApr && <BonusRewardsSection vault={vault} />}
          </div>
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

interface CardsProps {
  vault: Vault
  className?: string
}

const Cards = (props: CardsProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_vault = useTranslations('Vault')

  const { isDesktop } = useScreenSize()

  return (
    <div
      className={classNames(
        'w-full grid grid-cols-1 gap-3 md:grid-cols-2',
        { 'md:grid-cols-3': !!vault.yieldSourceName },
        className
      )}
    >
      <SimpleCard title={t_vault('headers.totalDeposited')}>
        <VaultTotalDeposits
          vault={vault}
          className='gap-2'
          valueClassName='!text-2xl text-pt-purple-100 font-semibold md:!text-3xl'
          amountClassName='!text-sm text-pt-purple-300 md:!text-base'
        />
      </SimpleCard>
      <SimpleCard title={t_vault('headers.winChance')}>
        <VaultWinChance vault={vault} className='h-10 w-auto' />
        <div className='flex items-center gap-2 text-sm text-pt-purple-300 md:text-base'>
          <span>{t_vault('headers.prizeYield')}:</span>
          <VaultPrizeYield vault={vault} label={t_common('apr')} />
        </div>
      </SimpleCard>
      {!!vault.yieldSourceName && (
        <SimpleCard title={t_vault('headers.yieldSource')}>
          <span className='text-2xl text-pt-purple-100 font-semibold md:text-3xl'>
            {vault.yieldSourceName}
          </span>
          {!!vault.yieldSourceURI && (
            <ExternalLink
              href={vault.yieldSourceURI}
              size={isDesktop ? 'md' : 'sm'}
              className='text-pt-purple-300 hover:text-pt-purple-400'
            >
              {getCleanURI(vault.yieldSourceURI)}
            </ExternalLink>
          )}
        </SimpleCard>
      )}
    </div>
  )
}

interface SimpleCardProps {
  title: ReactNode
  children: ReactNode
  className?: string
  wrapperClassName?: string
}

const SimpleCard = (props: SimpleCardProps) => {
  const { title, children, className, wrapperClassName } = props

  return (
    <Card className={classNames('text-center', className)} wrapperClassName={wrapperClassName}>
      <span className='mb-2 text-xl text-pt-purple-300 font-semibold md:mb-3 md:text-2xl'>
        {title}
      </span>
      <div className='grow flex flex-col items-center justify-center gap-2'>{children}</div>
    </Card>
  )
}

interface PrizesSectionProps {
  prizePool: PrizePool
  className?: string
}

const PrizesSection = (props: PrizesSectionProps) => {
  const { prizePool, className } = props

  const t_prizes = useTranslations('Prizes')

  // TODO: better title?
  return (
    <SimpleCard
      title={t_prizes('currentPrizes')}
      className='!p-0'
      wrapperClassName={classNames('bg-transparent shadow-none', className)}
    >
      <PrizePoolPrizesCard
        prizePool={prizePool}
        className='bg-transparent shadow-none'
        innerClassName='!p-0'
        networkClassName='hidden'
        headersClassName='hidden'
        prizeClassName='!pl-0 pr-3 !text-2xl !text-pt-purple-100 font-semibold md:!text-3xl'
        frequencyClassName='!pr-0 pl-3 !text-pt-purple-300'
      />
    </SimpleCard>
  )
}

interface BonusRewardsSectionProps {
  vault: Vault
  className?: string
}

const BonusRewardsSection = (props: BonusRewardsSectionProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_vault = useTranslations('Vault')

  return (
    <SimpleCard
      title={t_vault('headers.bonusRewards')}
      className='!p-0'
      wrapperClassName={classNames('bg-transparent shadow-none', className)}
    >
      <VaultBonusRewards
        vault={vault}
        valueClassName='text-2xl text-pt-purple-100 font-semibold md:text-3xl'
        append={<span className='text-sm text-pt-purple-300 md:text-base'>{t_common('apr')}</span>}
      />
      {/* TODO: distributed every X hours/days */}
      {/* TODO: next claim in X hours/days */}
    </SimpleCard>
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
