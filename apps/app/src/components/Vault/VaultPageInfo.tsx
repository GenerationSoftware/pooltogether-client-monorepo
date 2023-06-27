import { getBlockExplorerUrl, shorten, Vault } from '@pooltogether/hyperstructure-client-js'
import { PrizePowerTooltip, WinChanceTooltip } from '@shared/react-components'
import { ExternalLink } from '@shared/ui'
import classNames from 'classnames'
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

  const { address: userAddress } = useAccount()

  return (
    <div
      className={classNames(
        'flex flex-col w-full max-w-screen-md gap-2 px-9 text-sm md:text-base',
        className
      )}
    >
      {!!userAddress && (
        <VaultInfoRow
          name='My Balance'
          data={<AccountVaultBalance vault={vault} className='!flex-row gap-1' />}
        />
      )}
      {!!userAddress && (
        <VaultInfoRow
          name={
            <span className='flex gap-2 items-center'>
              My Win Chance{' '}
              <WinChanceTooltip
                iconSize='sm'
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
            Prize Power{' '}
            <PrizePowerTooltip
              iconSize='sm'
              className='text-sm md:text-base'
              iconClassName='text-pt-purple-200'
            />
          </span>
        }
        data={<VaultPrizePower vault={vault} />}
      />
      <VaultInfoRow name='TVL' data={<VaultTotalDeposits vault={vault} />} />
      <VaultInfoRow
        name='Deposit Asset'
        data={!!vault.tokenData && <VaultInfoToken token={vault.tokenData} />}
      />
      <VaultInfoRow
        name='Prize Asset'
        data={!!vault.shareData && <VaultInfoToken token={vault.shareData} />}
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
      {token.symbol} |{' '}
      <ExternalLink
        href={getBlockExplorerUrl(token.chainId, token.address, 'token')}
        text={shorten(token.address, { short: true }) ?? ''}
        size='sm'
        className='text-pt-purple-200'
      />
    </span>
  )
}
