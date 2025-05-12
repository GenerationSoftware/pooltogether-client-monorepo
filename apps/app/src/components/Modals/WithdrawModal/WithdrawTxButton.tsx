import { getAssetsFromShares, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSend5792RedeemTransaction,
  useSendRedeemTransaction,
  useTokenBalance,
  useUserVaultDelegationBalance,
  useUserVaultShareBalance,
  useUserVaultTokenBalance,
  useVaultBalance,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useMiscSettings } from '@shared/generic-react-hooks'
import { TransactionButton } from '@shared/react-components'
import { Button } from '@shared/ui'
import { supportsEip5792, supportsEip7677 } from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Address, parseUnits } from 'viem'
import { useAccount, useCapabilities } from 'wagmi'
import { PAYMASTER_URLS } from '@constants/config'
import { WithdrawModalView } from '.'
import { isValidFormInput } from '../TxFormInput'
import { withdrawFormShareAmountAtom } from './WithdrawForm'

interface WithdrawTxButtonProps {
  vault: Vault
  modalView: string
  setModalView: (view: WithdrawModalView) => void
  setWithdrawTxHash: (txHash: string) => void
  refetchUserBalances?: () => void
  onSuccessfulWithdrawal?: () => void
}

export const WithdrawTxButton = (props: WithdrawTxButtonProps) => {
  const {
    vault,
    modalView,
    setModalView,
    setWithdrawTxHash,
    refetchUserBalances,
    onSuccessfulWithdrawal
  } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

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

  const dataTx = useSendRedeemTransaction(withdrawAmount, vault, {
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

  const { data: walletCapabilities } = useCapabilities()
  const chainWalletCapabilities = walletCapabilities?.[vault.chainId] ?? {}

  const { isActive: isEip5792Disabled } = useMiscSettings('eip5792Disabled')
  const isUsingEip5792 = supportsEip5792(chainWalletCapabilities) && !isEip5792Disabled

  const { isActive: isEip7677Disabled } = useMiscSettings('eip7677Disabled')
  const paymasterUrl = PAYMASTER_URLS[vault.chainId]
  const isUsingEip7677 =
    !!paymasterUrl && supportsEip7677(chainWalletCapabilities) && !isEip7677Disabled

  const data5792Tx = useSend5792RedeemTransaction(withdrawAmount, vault, {
    minAssets: expectedAssetAmount,
    paymasterService: isUsingEip7677 ? { url: paymasterUrl, optional: true } : undefined,
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
    },
    enabled: isUsingEip5792
  })

  const sendTx = isUsingEip5792
    ? data5792Tx.send5792RedeemTransaction
    : dataTx.sendRedeemTransaction
  const isWaitingWithdrawal = isUsingEip5792 ? data5792Tx.isWaiting : dataTx.isWaiting
  const isConfirmingWithdrawal = isUsingEip5792 ? data5792Tx.isConfirming : dataTx.isConfirming
  const isSuccessfulWithdrawal = isUsingEip5792 ? data5792Tx.isSuccess : dataTx.isSuccess
  const withdrawTxHash = isUsingEip5792 ? data5792Tx.txHashes?.at(-1) : dataTx.txHash

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
    !!sendTx

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
        write={sendTx}
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
