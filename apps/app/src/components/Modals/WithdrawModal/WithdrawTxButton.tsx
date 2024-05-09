import { getAssetsFromShares, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSendRedeemTransaction,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultShareBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { TransactionButton } from '@shared/react-components'
import { Button } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Address, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { WithdrawModalView } from '.'
import { isValidFormInput } from '../TxFormInput'
import { withdrawFormShareAmountAtom } from './WithdrawForm'

interface WithdrawTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: WithdrawModalView) => void
  setWithdrawTxHash: (txHash: string) => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  refetchUserBalances?: () => void
  onSuccessfulWithdrawal?: () => void
}

export const WithdrawTxButton = (props: WithdrawTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setWithdrawTxHash,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    refetchUserBalances,
    onSuccessfulWithdrawal
  } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const { address: userAddress, chain, isDisconnected } = useAccount()

  const { data: tokenData } = useVaultTokenData(vault)
  const decimals = vault.decimals ?? tokenData?.decimals

  const { data: userVaultShareBalance, isFetched: isFetchedUserVaultShareBalance } =
    useUserVaultShareBalance(vault, userAddress as Address)

  const { refetch: refetchUserVaultTokenBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  )

  const { refetch: refetchUserTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress as Address,
    tokenData?.address as Address
  )

  const { refetch: refetchUserVaultDelegationBalance } = useUserVaultDelegationBalance(
    vault,
    userAddress as Address
  )

  const { refetch: refetchVaultBalance } = useVaultBalance(vault)

  const { data: vaultExchangeRate } = useVaultExchangeRate(vault)

  const formShareAmount = useAtomValue(withdrawFormShareAmountAtom)

  const isValidFormShareAmount =
    decimals !== undefined ? isValidFormInput(formShareAmount, decimals) : false

  const withdrawAmount = isValidFormShareAmount
    ? parseUnits(formShareAmount, decimals as number)
    : 0n

  // TODO: this should accept user input in case of lossy vaults
  const expectedAssetAmount =
    !!withdrawAmount && !!vaultExchangeRate
      ? getAssetsFromShares(withdrawAmount, vaultExchangeRate, decimals as number)
      : 0n

  const {
    isWaiting: isWaitingWithdrawal,
    isConfirming: isConfirmingWithdrawal,
    isSuccess: isSuccessfulWithdrawal,
    txHash: withdrawTxHash,
    sendRedeemTransaction
  } = useSendRedeemTransaction(withdrawAmount, vault, {
    minAssets: expectedAssetAmount,
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: () => {
      refetchUserTokenBalance()
      refetchUserVaultTokenBalance()
      refetchUserVaultDelegationBalance()
      refetchVaultBalance()
      refetchUserBalances?.()
      onSuccessfulWithdrawal?.()
      setModalView('success')
    },
    onError: () => {
      setModalView('error')
    }
  })

  useEffect(() => {
    if (
      !!withdrawTxHash &&
      isConfirmingWithdrawal &&
      !isWaitingWithdrawal &&
      !isSuccessfulWithdrawal
    ) {
      setWithdrawTxHash(withdrawTxHash)
      setModalView('confirming')
    }
  }, [withdrawTxHash, isConfirmingWithdrawal])

  const withdrawEnabled =
    !isDisconnected &&
    !!userAddress &&
    !!tokenData &&
    isFetchedUserVaultShareBalance &&
    !!userVaultShareBalance &&
    isValidFormShareAmount &&
    !!withdrawAmount &&
    userVaultShareBalance.amount >= withdrawAmount &&
    !!sendRedeemTransaction

  if (withdrawAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {t_modals('enterAnAmount')}
      </Button>
    )
  } else if (!isDisconnected && chain?.id === vault.chainId && modalView === 'main') {
    return (
      <Button onClick={() => setModalView('review')} fullSized={true} disabled={!withdrawEnabled}>
        {t_modals('reviewWithdrawal')}
      </Button>
    )
  } else {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingWithdrawal || isConfirmingWithdrawal}
        isTxSuccess={isSuccessfulWithdrawal}
        write={sendRedeemTransaction}
        txHash={withdrawTxHash}
        txDescription={t_modals('withdrawTx', { symbol: tokenData?.symbol ?? '?' })}
        fullSized={true}
        disabled={!withdrawEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        intl={{ base: t_modals, common: t_common }}
      >
        {t_modals('confirmWithdrawal')}
      </TransactionButton>
    )
  }
}
