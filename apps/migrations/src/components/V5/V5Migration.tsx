import {
  useTokenBalance,
  useTokens,
  useVault,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowUturnLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { CurrencyValue, NetworkBadge, TokenIcon } from '@shared/react-components'
import { TokenWithAmount } from '@shared/types'
import { Button, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { Address, formatUnits, TransactionReceipt } from 'viem'
import { SimpleBadge } from '@components/SimpleBadge'
import { SwapWidget } from '@components/SwapWidget'
import { V5_PROMOTION_SETTINGS } from '@constants/config'
import { V5BalanceToMigrate } from '@hooks/useUserV5Balances'
import { useUserV5ClaimableRewards } from '@hooks/useUserV5ClaimableRewards'
import { useV5ClaimRewardsGasEstimate } from '@hooks/useV5ClaimRewardsGasEstimate'
import { useV5WithdrawGasEstimate } from '@hooks/useV5WithdrawGasEstimate'
import { ClaimRewardsButton } from './ClaimRewardsButton'
import { V5MigrationHeader } from './V5MigrationHeader'
import { WithdrawButton } from './WithdrawButton'

export type V5MigrationStep = 'claim' | 'withdraw' | 'swap'

export interface V5MigrationProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  className?: string
}

export const V5Migration = (props: V5MigrationProps) => {
  const { userAddress, migration, className } = props

  const [actionsCompleted, setActionsCompleted] = useState(0)

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV5ClaimableRewards(
    migration.token.chainId,
    migration.vaultInfo.address,
    userAddress
  )

  const isRewardsClaimable =
    isFetchedClaimable || !V5_PROMOTION_SETTINGS[migration.token.chainId]
      ? !!claimable?.length
      : undefined

  const allMigrationActions: Record<V5MigrationStep, ReactNode> = {
    claim: (
      <ClaimContent
        userAddress={userAddress}
        migration={migration}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    ),
    withdraw: (
      <WithdrawContent
        userAddress={userAddress}
        migration={migration}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    ),
    swap: (
      <SwapContent
        userAddress={userAddress}
        migration={migration}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    )
  }

  const migrationActions = useMemo((): V5MigrationStep[] => {
    if (isRewardsClaimable) {
      return ['claim', 'withdraw', 'swap']
    } else if (isRewardsClaimable !== undefined) {
      return ['withdraw', 'swap']
    } else {
      return []
    }
  }, [allMigrationActions, isRewardsClaimable])

  return (
    <div className={classNames('w-full flex flex-col gap-16 items-center', className)}>
      <V5MigrationHeader
        migration={migration}
        actions={migrationActions}
        actionsCompleted={actionsCompleted}
      />
      {!!migrationActions?.length ? (
        allMigrationActions[
          migrationActions[Math.min(actionsCompleted, migrationActions.length - 1)]
        ]
      ) : (
        <Spinner />
      )}
      {actionsCompleted >= migrationActions.length && (
        <Link href='/' passHref={true}>
          <Button>
            <span className='flex gap-2 items-center'>
              <ArrowUturnLeftIcon className='h-5 w-5' /> Go back to migrate other prize tokens
            </span>
          </Button>
        </Link>
      )}
    </div>
  )
}

interface ClaimContentProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

const ClaimContent = (props: ClaimContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const { data: claimable } = useUserV5ClaimableRewards(
    migration.token.chainId,
    migration.vaultInfo.address,
    userAddress
  )

  const twabRewardsAddresses = [...new Set(claimable.map((e) => e.twabRewardsAddress))]
  const twabRewardsAddress =
    twabRewardsAddresses[0] ?? TWAB_REWARDS_ADDRESSES[migration.token.chainId]

  const [twabRewardsAddressesClaimed, setTwabRewardsAddressesClaimed] = useState<
    Set<Lowercase<Address>>
  >(new Set())

  const { data: gasEstimate, isFetched: isFetchedGasEstimate } = useV5ClaimRewardsGasEstimate(
    migration.token.chainId,
    migration.vaultInfo.address,
    userAddress,
    { twabRewardsAddress }
  )

  const claimableTokenAddresses = new Set(
    claimable.map((entry) => entry.tokenAddress.toLowerCase() as Lowercase<Address>)
  )
  const { data: tokenData } = useTokens(migration.vaultInfo.chainId, [...claimableTokenAddresses])

  const tokensToClaim = useMemo(() => {
    const tokens: TokenWithAmount[] = []

    if (!!tokenData) {
      Object.values(tokenData).forEach((token) => {
        const amount = claimable
          .filter((e) => e.tokenAddress === token.address.toLowerCase())
          .reduce((a, b) => a + b.total, 0n)

        if (!!amount) {
          tokens.push({ ...token, amount })
        }
      })
    }

    return tokens
  }, [tokenData])

  if (claimable === undefined) {
    return <Spinner />
  }

  const onSuccessClaimTX = (txReceipt: TransactionReceipt) => {
    if (!!onSuccess && !!txReceipt.to) {
      const newTwabRewardsAddressesClaimed = twabRewardsAddressesClaimed.add(
        txReceipt.to.toLowerCase() as Lowercase<Address>
      )
      setTwabRewardsAddressesClaimed(newTwabRewardsAddressesClaimed)
      if (newTwabRewardsAddressesClaimed.size >= twabRewardsAddresses.length) {
        onSuccess?.()
      }
    }
  }

  return (
    <div
      className={classNames(
        'w-full max-w-xl flex flex-col gap-6 items-center px-8 py-11 bg-pt-purple-700 rounded-md',
        className
      )}
    >
      <NetworkBadge chainId={migration.token.chainId} />
      <div className='flex flex-col gap-2 items-center'>
        <span className='text-sm font-semibold text-pt-purple-100'>Claim Your Rewards:</span>
        {tokensToClaim.map((token) => (
          <SimpleBadge
            key={`claimable-${token.chainId}-${token.address}`}
            className='gap-2 !text-2xl font-semibold'
          >
            {formatBigIntForDisplay(token.amount, token.decimals)}
            <TokenIcon token={token} />
            <span className='text-pt-purple-200'>{token.symbol}</span>
          </SimpleBadge>
        ))}
        <span className='flex gap-1 items-center text-sm font-semibold text-pt-purple-100'>
          Estimated Network Fee:{' '}
          {isFetchedGasEstimate && !!gasEstimate ? (
            <CurrencyValue baseValue={gasEstimate.totalGasEth} />
          ) : (
            <Spinner />
          )}
        </span>
      </div>
      <ClaimRewardsButton
        chainId={migration.token.chainId}
        vaultAddress={migration.vaultInfo.address}
        userAddress={userAddress}
        txOptions={{ twabRewardsAddress, onSuccess: (txReceipt) => onSuccessClaimTX(txReceipt) }}
        buttonText={
          twabRewardsAddresses.length > 1
            ? `Claim Rewards (${twabRewardsAddressesClaimed.size + 1} / ${
                twabRewardsAddresses.length
              } TXs)`
            : undefined
        }
        fullSized={true}
      />
      <button
        onClick={onSuccess}
        className='flex gap-1 items-center text-sm hover:text-pt-purple-100'
      >
        Skip claiming rewards <ChevronDoubleRightIcon className='w-4 h-4' />
      </button>
    </div>
  )
}

interface WithdrawContentProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

const WithdrawContent = (props: WithdrawContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const { data: gasEstimate, isFetched: isFetchedGasEstimate } = useV5WithdrawGasEstimate(
    userAddress,
    migration
  )

  return (
    <div
      className={classNames(
        'w-full max-w-xl flex flex-col gap-6 items-center px-8 py-11 bg-pt-purple-700 rounded-md',
        className
      )}
    >
      <NetworkBadge chainId={migration.token.chainId} />
      <span className='text-sm font-semibold text-pt-purple-100'>Withdraw From V5:</span>
      <SimpleBadge className='gap-2 !text-2xl font-semibold'>
        {formatBigIntForDisplay(migration.token.amount, migration.token.decimals)}
        <TokenIcon token={{ ...migration.token, ...migration.vaultInfo }} />
        <span className='text-pt-purple-200'>{migration.token.symbol}</span>
      </SimpleBadge>
      <span className='flex gap-1 items-center text-sm font-semibold text-pt-purple-100'>
        Estimated Network Fee:{' '}
        {isFetchedGasEstimate && !!gasEstimate ? (
          <CurrencyValue baseValue={gasEstimate.totalGasEth} />
        ) : (
          <Spinner />
        )}
      </span>
      <WithdrawButton
        migration={migration}
        txOptions={{ onSuccess }}
        includeTokenSymbol={true}
        fullSized={true}
      />
    </div>
  )
}

interface SwapContentProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  onSuccess?: () => void
  className?: string
}

const SwapContent = (props: SwapContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const vault = useVault(migration.vaultInfo)

  const { data: underlyingTokenAddress } = useVaultTokenAddress(vault)

  const { data: underlyingToken } = useTokenBalance(
    migration.token.chainId,
    userAddress,
    underlyingTokenAddress as Address
  )

  const swapWidgetConfig = useMemo(() => {
    return {
      fromChain: migration.token.chainId,
      fromToken: underlyingTokenAddress,
      fromAmount: !!underlyingToken
        ? formatUnits(underlyingToken.amount, underlyingToken.decimals)
        : undefined,
      toChain: migration.destination.chainId,
      toToken: migration.destination.address
    }
  }, [migration, underlyingToken])

  return <SwapWidget config={swapWidgetConfig} onSuccess={onSuccess} className={className} />
}
