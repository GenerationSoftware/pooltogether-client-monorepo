import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useTokenPermitSupport,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl, Token, TokenWithLogo } from '@shared/types'
import { useAtomValue } from 'jotai'
import { Address } from 'viem'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { depositFormShareAmountAtom, depositFormTokenAmountAtom } from '../../../Form/DepositForm'
import { TokenIcon } from '../../../Icons/TokenIcon'
import { NetworkFees, NetworkFeesProps } from '../../NetworkFees'
import { Odds } from '../../Odds'

interface ReviewViewProps {
  vault: Vault
  prizePool: PrizePool
  intl?: {
    base?: Intl<'confirmDeposit' | 'weeklyChances' | 'oneInXChance'>
    common?: Intl<'prizePool'>
    fees?: NetworkFeesProps['intl']
  }
}

// TODO: add warning if deposit doesn't make sense gas-wise
export const ReviewView = (props: ReviewViewProps) => {
  const { vault, prizePool, intl } = props

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)
  const formShareAmount = useAtomValue(depositFormShareAmountAtom)

  const { data: shareData } = useVaultShareData(vault)
  const { data: tokenData } = useVaultTokenData(vault)

  const { data: tokenPermitSupport } = useTokenPermitSupport(
    tokenData?.chainId as number,
    tokenData?.address as Address
  )

  const feesToShow: NetworkFeesProps['show'] =
    tokenPermitSupport === 'eip2612'
      ? ['depositWithPermit', 'withdraw']
      : ['approve', 'deposit', 'withdraw']

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-xl font-semibold text-center'>
        {intl?.base?.('confirmDeposit') ?? 'Confirm Deposit'}
      </span>
      <PrizePoolBadge
        chainId={vault.chainId}
        hideBorder={true}
        intl={intl?.common}
        className='!py-1 mx-auto'
      />
      {!!shareData && !!tokenData && (
        <div className='flex flex-col w-full gap-1'>
          <BasicDepositFormInput
            token={{ ...tokenData, amount: formTokenAmount, logoURI: vault.tokenLogoURI }}
          />
          <BasicDepositFormInput
            token={{
              ...shareData,
              amount: formShareAmount,
              logoURI: vault.logoURI ?? vault.tokenLogoURI
            }}
          />
        </div>
      )}
      <div className='flex flex-col gap-4 mx-auto md:flex-row md:gap-9'>
        <Odds vault={vault} prizePool={prizePool} intl={intl?.base} />
        <NetworkFees vault={vault} show={feesToShow} intl={intl?.fees} />
      </div>
    </div>
  )
}

interface BasicDepositFormInputProps {
  token: Token & Partial<TokenWithLogo> & { amount: string }
}

const BasicDepositFormInput = (props: BasicDepositFormInputProps) => {
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
