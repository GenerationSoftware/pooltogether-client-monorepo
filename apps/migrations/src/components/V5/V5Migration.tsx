import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGasCostEstimates,
  useTokenAllowance,
  useTokenBalance,
  useTokenPermitSupport,
  useTokens,
  useVault,
  useVaultTokenAddress,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowUturnLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { CurrencyValue, NetworkBadge, TokenIcon, TX_GAS_ESTIMATES } from '@shared/react-components'
import { TokenWithAmount } from '@shared/types'
import { Button, Spinner } from '@shared/ui'
import {
  erc20ABI,
  formatBigIntForDisplay,
  getSecondsSinceEpoch,
  lower,
  sToMs,
  TWAB_REWARDS_ADDRESSES,
  vaultABI
} from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Address, formatUnits, TransactionReceipt } from 'viem'
import { DepositButton } from '@components/DepositButton'
import { DepositWithPermitButton } from '@components/DepositWithPermitButton'
import { SimpleBadge } from '@components/SimpleBadge'
import { SwapWidget } from '@components/SwapWidget'
import { V5_PROMOTION_SETTINGS } from '@constants/config'
import { V5BalanceToMigrate } from '@hooks/useUserV5Balances'
import { useUserV5ClaimablePromotions } from '@hooks/useUserV5ClaimablePromotions'
import { useV5ClaimRewardsGasEstimate } from '@hooks/useV5ClaimRewardsGasEstimate'
import { ClaimRewardsButton } from './ClaimRewardsButton'
import { V5MigrationHeader } from './V5MigrationHeader'
import { WithdrawButton } from './WithdrawButton'

export type V5MigrationStep = 'claim' | 'withdraw' | 'swap' | 'deposit'

export interface V5MigrationProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  className?: string
}

export const V5Migration = (props: V5MigrationProps) => {
  const { userAddress, migration, className } = props

  const [actionsCompleted, setActionsCompleted] = useState(0)
  const [swappedAmountOut, setSwappedAmountOut] = useState(0n)

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV5ClaimablePromotions(
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
        onSuccess={(amount) => {
          setSwappedAmountOut(amount)
          setActionsCompleted(actionsCompleted + 1)
        }}
      />
    ),
    deposit: (
      <DepositContent
        userAddress={userAddress}
        migration={migration}
        depositAmount={swappedAmountOut}
        onSuccess={() => setActionsCompleted(actionsCompleted + 1)}
      />
    )
  }

  const migrationActions = useMemo((): V5MigrationStep[] => {
    if (isRewardsClaimable) {
      return ['claim', 'withdraw', 'swap', 'deposit']
    } else if (isRewardsClaimable !== undefined) {
      return ['withdraw', 'swap', 'deposit']
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
      {!!migrationActions.length ? (
        actionsCompleted < migrationActions.length &&
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

  const { data: claimable } = useUserV5ClaimablePromotions(
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

  const claimableTokenAddresses = new Set(claimable.map((entry) => lower(entry.tokenAddress)))
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
      const newTwabRewardsAddressesClaimed = twabRewardsAddressesClaimed.add(lower(txReceipt.to))
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

  const { data: gasEstimates, isFetched: isFetchedGasEstimates } = useGasCostEstimates(
    migration.token.chainId,
    {
      address: migration.token.address,
      abi: vaultABI,
      functionName: 'redeem',
      args: [migration.token.amount, userAddress, userAddress],
      account: userAddress
    },
    { refetchInterval: sToMs(10) }
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
        {isFetchedGasEstimates && !!gasEstimates ? (
          <CurrencyValue baseValue={gasEstimates.totalGasEth} />
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
  onSuccess?: (amount: bigint) => void
  className?: string
}

const SwapContent = (props: SwapContentProps) => {
  const { userAddress, migration, onSuccess, className } = props

  const fromVault = useVault(migration.vaultInfo)
  const toVault = useVault(migration.destination)

  const { data: fromTokenAddress } = useVaultTokenAddress(fromVault)
  const { data: toTokenAddress } = useVaultTokenAddress(toVault)

  const { data: fromToken } = useTokenBalance(
    fromVault.chainId,
    userAddress,
    fromTokenAddress as Address
  )

  const swapWidgetConfig = useMemo(() => {
    return {
      fromChain: migration.token.chainId,
      fromToken: fromTokenAddress,
      fromAmount: !!fromToken
        ? formatUnits(fromToken.amount, fromToken.decimals)
        : formatUnits(migration.token.amount, migration.token.decimals),
      toChain: migration.destination.chainId,
      toToken: toTokenAddress
    }
  }, [migration, fromTokenAddress, toTokenAddress])

  useEffect(() => {
    if (
      !!fromToken &&
      !!toTokenAddress &&
      fromToken.chainId === migration.destination.chainId &&
      fromToken.address.toLowerCase() === toTokenAddress.toLowerCase()
    ) {
      onSuccess?.(fromToken.amount)
    }
  }, [fromToken, toTokenAddress])

  return <SwapWidget config={swapWidgetConfig} onSuccess={onSuccess} className={className} />
}

interface DepositContentProps {
  userAddress: Address
  migration: V5BalanceToMigrate
  depositAmount: bigint
  onSuccess?: () => void
  className?: string
}

const DepositContent = (props: DepositContentProps) => {
  const { userAddress, migration, depositAmount, onSuccess, className } = props

  const vault = useVault(migration.destination)
  const { data: token } = useVaultTokenData(vault)

  const { data: tokenPermitSupport } = useTokenPermitSupport(
    token?.chainId as number,
    token?.address as Address
  )

  if (!token) {
    return <Spinner />
  }

  return (
    <div
      className={classNames(
        'w-full max-w-xl flex flex-col gap-6 items-center px-8 py-11 bg-pt-purple-700 rounded-md',
        className
      )}
    >
      <NetworkBadge chainId={migration.token.chainId} />
      <span className='text-sm font-semibold text-pt-purple-100'>Deposit Into V5:</span>
      <SimpleBadge className='gap-2 !text-2xl font-semibold'>
        {formatBigIntForDisplay(depositAmount, token.decimals)}
        <TokenIcon token={token} />
        <span className='text-pt-purple-200'>{token.symbol}</span>
      </SimpleBadge>
      <DepositGasEstimate
        userAddress={userAddress}
        vault={vault}
        token={{ ...token, amount: depositAmount }}
      />
      {tokenPermitSupport === 'eip2612' ? (
        <DepositWithPermitButton
          userAddress={userAddress}
          vault={vault}
          token={{ ...token, amount: depositAmount }}
          txOptions={{ onSuccess }}
          fullSized={true}
        />
      ) : (
        <DepositButton
          userAddress={userAddress}
          vault={vault}
          token={{ ...token, amount: depositAmount }}
          txOptions={{ onSuccess }}
          fullSized={true}
        />
      )}
    </div>
  )
}

interface DepositGasEstimateProps {
  userAddress: Address
  vault: Vault
  token: TokenWithAmount
}

const DepositGasEstimate = (props: DepositGasEstimateProps) => {
  const { userAddress, vault, token } = props

  const { data: tokenPermitSupport } = useTokenPermitSupport(
    token.chainId as number,
    token.address as Address
  )

  const { data: allowance, isFetched: isFetchedAllowance } = useTokenAllowance(
    vault.chainId,
    userAddress,
    vault.address,
    token.address
  )

  const { data: approvalGasEstimates, isFetched: isFetchedApprovalGasEstimates } =
    useGasCostEstimates(
      vault.chainId,
      {
        address: token.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [vault.address, token.amount],
        account: userAddress
      },
      { gasAmount: TX_GAS_ESTIMATES.approve, refetchInterval: sToMs(10) }
    )

  const { data: depositGasEstimates, isFetched: isFetchedDepositGasEstimates } =
    useGasCostEstimates(
      vault.chainId,
      {
        address: vault.address,
        abi: vaultABI,
        functionName: 'deposit',
        args: [token.amount, userAddress],
        account: userAddress
      },
      { gasAmount: TX_GAS_ESTIMATES.deposit, refetchInterval: sToMs(10) }
    )

  const { data: depositWithPermitGasEstimates, isFetched: isFetchedDepositWithPermitGasEstimates } =
    useGasCostEstimates(
      vault.chainId,
      {
        address: vault.address,
        abi: vaultABI,
        functionName: 'depositWithPermit',
        args: [
          1n,
          vault.address,
          getSecondsSinceEpoch(),
          28,
          '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf',
          '0x4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8'
        ],
        account: userAddress
      },
      { gasAmount: TX_GAS_ESTIMATES.depositWithPermit, refetchInterval: sToMs(10) }
    )

  const needsApproval = isFetchedAllowance && allowance !== undefined && allowance < token.amount

  const isFetched = needsApproval
    ? tokenPermitSupport === 'eip2612'
      ? isFetchedDepositWithPermitGasEstimates
      : isFetchedApprovalGasEstimates && isFetchedDepositGasEstimates
    : isFetchedDepositGasEstimates

  const gasEstimate = needsApproval
    ? tokenPermitSupport === 'eip2612'
      ? depositWithPermitGasEstimates?.totalGasEth ?? 0
      : (approvalGasEstimates?.totalGasEth ?? 0) + (depositGasEstimates?.totalGasEth ?? 0)
    : depositGasEstimates?.totalGasEth ?? 0

  return (
    <span className='flex gap-1 items-center text-sm font-semibold text-pt-purple-100'>
      Estimated Network Fee:{' '}
      {isFetched && !!gasEstimate ? <CurrencyValue baseValue={gasEstimate} /> : <Spinner />}
    </span>
  )
}
