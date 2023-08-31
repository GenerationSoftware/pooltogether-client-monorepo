import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaultShareData, useVaultTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { Intl, Token, TokenWithLogo } from '@shared/types'
import { useAtomValue } from 'jotai'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import {
  withdrawFormShareAmountAtom,
  withdrawFormTokenAmountAtom
} from '../../../Form/WithdrawForm'
import { TokenIcon } from '../../../Icons/TokenIcon'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'

interface ReviewViewProps {
  vault: Vault
  intl?: {
    base?: Intl<'confirmWithdrawal'>
    common?: Intl<'prizePool'>
    fees?: NetworkFeesProps['intl']
  }
}

export const ReviewView = (props: ReviewViewProps) => {
  const { vault, intl } = props

  const formShareAmount = useAtomValue(withdrawFormShareAmountAtom)
  const formTokenAmount = useAtomValue(withdrawFormTokenAmountAtom)

  const { data: shareData } = useVaultShareData(vault)
  const { data: tokenData } = useVaultTokenData(vault)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-xl font-semibold text-center'>
        {intl?.base?.('confirmWithdrawal') ?? 'Confirm Withdrawal'}
      </span>
      <PrizePoolBadge
        chainId={vault.chainId}
        hideBorder={true}
        intl={intl?.common}
        className='!py-1 mx-auto'
      />
      {!!shareData && !!tokenData && (
        <div className='flex flex-col w-full gap-1'>
          <BasicWithdrawFormInput
            token={{ ...shareData, amount: formShareAmount, logoURI: vault.logoURI }}
          />
          <BasicWithdrawFormInput
            token={{ ...tokenData, amount: formTokenAmount, logoURI: vault.tokenLogoURI }}
          />
        </div>
      )}
      <NetworkFees vault={vault} show={['withdraw']} intl={intl?.fees} />
    </div>
  )
}

interface BasicWithdrawFormInputProps {
  token: Token & Partial<TokenWithLogo> & { amount: string }
}

const BasicWithdrawFormInput = (props: BasicWithdrawFormInputProps) => {
  const { token } = props

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
          <TokenIcon token={token} />
          <span className='text-lg font-semibold md:text-2xl'>{token.symbol}</span>
        </div>
      </div>
    </div>
  )
}
