import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { PrizePoolBadge, TokenIcon } from '@shared/react-components'
import { Token, TokenWithLogo } from '@shared/types'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { Address } from 'viem'
import { NetworkFees } from '../../NetworkFees'
import { withdrawFormShareAmountAtom, withdrawFormTokenAmountAtom } from '../WithdrawForm'

interface ReviewViewProps {
  vault: Vault
}

export const ReviewView = (props: ReviewViewProps) => {
  const { vault } = props

  const t_common = useTranslations('Common')
  const t_modals = useTranslations('TxModals')

  const formShareAmount = useAtomValue(withdrawFormShareAmountAtom)
  const formTokenAmount = useAtomValue(withdrawFormTokenAmountAtom)

  const { data: shareData } = useVaultShareData(vault)
  const { data: tokenData } = useVaultTokenData(vault)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-xl font-semibold text-center'>{t_modals('confirmWithdrawal')}</span>
      <PrizePoolBadge
        chainId={vault.chainId}
        hideBorder={true}
        intl={t_common}
        className='!py-1 mx-auto'
      />
      {!!shareData && !!tokenData && (
        <div className='flex flex-col w-full gap-1'>
          <BasicWithdrawFormInput
            token={{
              ...shareData,
              amount: formShareAmount,
              logoURI: vault.logoURI ?? vault.tokenLogoURI
            }}
            fallbackLogoTokenAddress={tokenData?.address}
          />
          <BasicWithdrawFormInput
            token={{ ...tokenData, amount: formTokenAmount, logoURI: vault.tokenLogoURI }}
          />
        </div>
      )}
      <NetworkFees vault={vault} show={['withdraw']} />
    </div>
  )
}

interface BasicWithdrawFormInputProps {
  token: Token & Partial<TokenWithLogo> & { amount: string }
  fallbackLogoTokenAddress?: Address
}

// TODO: this should probably include token value like in the main view
const BasicWithdrawFormInput = (props: BasicWithdrawFormInputProps) => {
  const { token, fallbackLogoTokenAddress } = props

  return (
    <div className='bg-pt-transparent p-3 rounded-lg border border-transparent md:p-4'>
      <div className='flex justify-between gap-6'>
        <span
          title={token.amount}
          className='text-lg font-semibold bg-transparent text-pt-purple-50 whitespace-nowrap overflow-hidden overflow-ellipsis md:text-2xl'
        >
          {token.amount}
        </span>
        <div className='flex shrink-0 items-center gap-1'>
          <TokenIcon
            token={token}
            fallbackToken={{ chainId: token.chainId, address: fallbackLogoTokenAddress }}
          />
          <span className='text-lg font-semibold md:text-2xl'>{token.symbol}</span>
        </div>
      </div>
    </div>
  )
}
