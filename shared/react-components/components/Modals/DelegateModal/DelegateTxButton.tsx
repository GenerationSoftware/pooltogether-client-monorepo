import { Vault } from '@generationsoftware/hyperstructure-client-js'
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
import { Intl } from '@shared/types'
import { Button } from '@shared/ui'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Address, formatUnits, parseUnits } from 'viem'
import { useAccount, useNetwork } from 'wagmi'
import { DelegateModalView } from '.'
import { delegateFormShareAmountAtom } from '../../Form/DelegateForm'
import { isValidFormInput } from '../../Form/TxFormInput'
import { TransactionButton } from '../../Transaction/TransactionButton'

interface DelegateTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: DelegateModalView) => void
  setDelegateTxHash: (txHash: string) => void
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  refetchUserBalances?: () => void
  onSuccessfulDelegation?: () => void
  intl?: {
    base?: Intl<
      | 'enterAnAmount'
      | 'reviewDelegation'
      | 'delegateTx'
      | 'confirmDelegation'
      | 'switchNetwork'
      | 'switchingNetwork'
    >
    common?: Intl<'connectWallet'>
  }
}

export const DelegateTxButton = (props: DelegateTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setDelegateTxHash,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    refetchUserBalances,
    onSuccessfulDelegation,
    intl
  } = props

  const { address: userAddress, isDisconnected } = useAccount()
  const { chain } = useNetwork()

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

  const formShareAmount = useAtomValue(delegateFormShareAmountAtom)

  const isValidFormShareAmount =
    decimals !== undefined ? isValidFormInput(formShareAmount, decimals) : false

  const delegateAmount = isValidFormShareAmount
    ? parseUnits(formShareAmount, decimals as number)
    : 0n

  const {
    isWaiting: isWaitingDelegation,
    isConfirming: isConfirmingDelegation,
    isSuccess: isSuccessfulDelegation,
    txHash: delegateTxHash,
    sendRedeemTransaction
  } = useSendRedeemTransaction(delegateAmount, vault, {
    onSend: () => {
      setModalView('waiting')
    },
    onSuccess: () => {
      refetchUserTokenBalance()
      refetchUserVaultTokenBalance()
      refetchUserVaultDelegationBalance()
      refetchVaultBalance()
      refetchUserBalances?.()
      onSuccessfulDelegation?.()
      setModalView('success')
    },
    onError: () => {
      setModalView('error')
    }
  })

  useEffect(() => {
    if (
      !!delegateTxHash &&
      isConfirmingDelegation &&
      !isWaitingDelegation &&
      !isSuccessfulDelegation
    ) {
      setDelegateTxHash(delegateTxHash)
      setModalView('confirming')
    }
  }, [delegateTxHash, isConfirmingDelegation])

  const isAaveCollateralizationErrored =
    vault.tags?.includes('aave') &&
    !!vaultExchangeRate &&
    vault.decimals !== undefined &&
    parseFloat(formatUnits(vaultExchangeRate, vault.decimals)) !== 1

  const delegateEnabled =
    !isDisconnected &&
    !!userAddress &&
    !!tokenData &&
    isFetchedUserVaultShareBalance &&
    !!userVaultShareBalance &&
    isValidFormShareAmount &&
    !!delegateAmount &&
    userVaultShareBalance.amount >= delegateAmount &&
    !!sendRedeemTransaction &&
    !isAaveCollateralizationErrored

  if (delegateAmount === 0n) {
    return (
      <Button color='transparent' fullSized={true} disabled={true}>
        {intl?.base?.('enterAnAmount') ?? 'Enter an amount'}
      </Button>
    )
  } else if (!isDisconnected && chain?.id === vault.chainId && modalView === 'main') {
    return (
      <Button onClick={() => setModalView('review')} fullSized={true} disabled={!delegateEnabled}>
        {intl?.base?.('reviewDelegation') ?? 'Review Delegation'}
      </Button>
    )
  } else {
    return (
      <TransactionButton
        chainId={vault.chainId}
        isTxLoading={isWaitingDelegation || isConfirmingDelegation}
        isTxSuccess={isSuccessfulDelegation}
        write={sendRedeemTransaction}
        txHash={delegateTxHash}
        txDescription={
          intl?.base?.('delegateTx', { symbol: tokenData?.symbol ?? '?' }) ??
          `${tokenData?.symbol} Delegation`
        }
        fullSized={true}
        disabled={!delegateEnabled}
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        addRecentTransaction={addRecentTransaction}
        intl={intl}
      >
        {intl?.base?.('confirmDelegation') ?? 'Confirm Delegation'}
      </TransactionButton>
    )
  }
}
