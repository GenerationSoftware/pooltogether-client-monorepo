import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useToken, useVaultTokenAddress } from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePoolBadge, SuccessPooly } from '@shared/react-components'
import { Token } from '@shared/types'
import { Button, ExternalLink, Spinner } from '@shared/ui'
import {
  erc20ABI,
  formatBigIntForDisplay,
  getBlockExplorerName,
  getBlockExplorerUrl,
  lower
} from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Address, decodeEventLog, TransactionReceipt } from 'viem'
import { useAccount, useTransactionReceipt } from 'wagmi'
import { withdrawFormTokenAddressAtom } from '../WithdrawForm'

interface SuccessViewProps {
  vault: Vault
  closeModal: () => void
  txHash?: string
}

export const SuccessView = (props: SuccessViewProps) => {
  const { vault, txHash, closeModal } = props

  const router = useRouter()

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const { address: userAddress } = useAccount()

  const { data: vaultTokenAddress } = useVaultTokenAddress(vault)

  const formTokenAddress = useAtomValue(withdrawFormTokenAddressAtom)

  const tokenAddress = formTokenAddress ?? vaultTokenAddress

  const { data: token } = useToken(vault.chainId, tokenAddress!)

  const { data: txReceipt } = useTransactionReceipt({
    chainId: vault.chainId,
    hash: txHash as `0x${string}`
  })

  const tokensReceived = useMemo(() => {
    if (!!userAddress && !!token && !!txReceipt) {
      return getTokensReceived(userAddress, token, txReceipt)
    }
  }, [userAddress, token, txReceipt])

  const formattedTokensReceived =
    !!token && !!tokensReceived
      ? formatBigIntForDisplay(tokensReceived, token.decimals, { maximumFractionDigits: 5 })
      : '?'
  const tokens = `${formattedTokensReceived} ${token?.symbol}`
  const name = getBlockExplorerName(vault.chainId)

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='flex flex-col gap-3 items-center'>
        <div className='flex flex-col items-center text-lg font-medium text-center'>
          <span className='text-pt-teal'>{t_modals('success')}</span>
          <span>{!!tokensReceived ? t_modals('gotTokens', { tokens }) : <Spinner />}</span>
        </div>
        <PrizePoolBadge
          chainId={vault.chainId}
          hideBorder={true}
          intl={t_common}
          className='!py-1'
        />
        <SuccessPooly className='w-40 h-auto mt-3' />
      </div>
      {!!txHash && (
        <ExternalLink
          href={getBlockExplorerUrl(vault.chainId, txHash, 'tx')}
          size='sm'
          className='text-pt-teal'
        >
          {t_common('viewOn', { name })}
        </ExternalLink>
      )}
      <Button
        fullSized={true}
        color='transparent'
        onClick={() => {
          router.push(`/account`)
          closeModal()
        }}
      >
        {t_modals('viewAccount')}
      </Button>
    </div>
  )
}

const getTokensReceived = (userAddress: Address, token: Token, txReceipt: TransactionReceipt) => {
  if (txReceipt.status !== 'success') return undefined

  const txLogs = [...txReceipt.logs].reverse()

  for (let i = 0; i < txLogs.length; i++) {
    try {
      const { data, topics, address } = txLogs[i]

      if (lower(token.address) === lower(address)) {
        const { args: eventArgs } = decodeEventLog({
          abi: erc20ABI,
          eventName: 'Transfer',
          data,
          topics
        })

        if (!!eventArgs && lower(eventArgs.to) === lower(userAddress)) {
          return eventArgs.value
        }
      }
    } catch {}
  }
}
