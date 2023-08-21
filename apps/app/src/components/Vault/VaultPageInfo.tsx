import { getBlockExplorerUrl, shorten, Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaultShareData, useVaultTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { PrizePowerTooltip, WinChanceTooltip } from '@shared/react-components'
import { ExternalLink, Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { AccountVaultOdds } from '@components/Account/AccountVaultOdds'
import { VaultPrizePower } from './VaultPrizePower'
import { VaultTotalDeposits } from './VaultTotalDeposits'

interface VaultPageInfoProps {
  vault: Vault
  className?: string
}

export const VaultPageInfo = (props: VaultPageInfoProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_vault = useTranslations('Vault')
  const t_tooltips = useTranslations('Tooltips')

  const { address: userAddress } = useAccount()

  const { data: shareData, isFetched: isFetchedShareData } = useVaultShareData(vault)
  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  return (
    <div
      className={classNames(
        'flex flex-col w-full max-w-screen-md gap-2 px-9 text-sm md:text-base',
        className
      )}
    >
      {!!userAddress && (
        <VaultInfoRow
          name={t_vault('headers.yourBalance')}
          data={<AccountVaultBalance vault={vault} className='!flex-row gap-1' />}
        />
      )}
      {!!userAddress && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              {t_vault('headers.yourWinChance')}
              <WinChanceTooltip
                iconSize='sm'
                intl={{ text: t_tooltips('winChance') }}
                className='text-sm md:text-base'
                iconClassName='text-pt-purple-200'
              />
            </span>
          }
          data={<AccountVaultOdds vault={vault} />}
        />
      )}
      <VaultInfoRow
        name={
          <span className='flex gap-2 items-center'>
            {t_vault('headers.prizePower')}
            <PrizePowerTooltip
              iconSize='sm'
              intl={{ text: t_tooltips('prizePower'), learnMore: t_common('learnMore') }}
              className='text-sm md:text-base'
              iconClassName='text-pt-purple-200'
            />
          </span>
        }
        data={<VaultPrizePower vault={vault} />}
      />
      <VaultInfoRow name={t_vault('headers.tvl')} data={<VaultTotalDeposits vault={vault} />} />
      <VaultInfoRow
        name={t_vault('headers.depositAsset')}
        data={
          isFetchedTokenData ? (
            !!tokenData ? (
              <VaultInfoToken token={tokenData} />
            ) : (
              '?'
            )
          ) : (
            <Spinner />
          )
        }
      />
      <VaultInfoRow
        name={t_vault('headers.prizeAsset')}
        data={
          isFetchedShareData ? (
            !!shareData ? (
              <VaultInfoToken token={shareData} />
            ) : (
              '?'
            )
          ) : (
            <Spinner />
          )
        }
      />
    </div>
  )
}

interface VaultInfoRowProps {
  name: ReactNode
  data: ReactNode
}

const VaultInfoRow = (props: VaultInfoRowProps) => {
  const { name, data } = props

  return (
    <div className='inline-flex w-full items-center justify-between'>
      <span className='text-pt-purple-100'>{name}</span>
      <span>{data}</span>
    </div>
  )
}

interface VaultInfoTokenProps {
  token: { chainId: number; address: string; symbol: string }
}

const VaultInfoToken = (props: VaultInfoTokenProps) => {
  const { token } = props

  return (
    <span>
      {token.symbol ?? '?'} |{' '}
      <ExternalLink
        href={getBlockExplorerUrl(token.chainId, token.address, 'token')}
        text={shorten(token.address, { short: true }) ?? ''}
        size='sm'
        className='text-pt-purple-200'
      />
    </span>
  )
}
