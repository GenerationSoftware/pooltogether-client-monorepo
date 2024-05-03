import {
  useTokenPermitSupport,
  useVault,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { NetworkBadge, TokenIcon } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { Address } from 'viem'
import { DepositButton } from './DepositButton'
import { DepositGasEstimate } from './DepositGasEstimate'
import { DepositWithPermitButton } from './DepositWithPermitButton'
import { SimpleBadge } from './SimpleBadge'

interface DepositContentProps {
  userAddress: Address
  destination: { chainId: number; address: Address }
  depositAmount: bigint
  onSuccess?: () => void
  className?: string
}

export const DepositContent = (props: DepositContentProps) => {
  const { userAddress, destination, depositAmount, onSuccess, className } = props

  const vault = useVault(destination)
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
      <NetworkBadge chainId={destination.chainId} />
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
