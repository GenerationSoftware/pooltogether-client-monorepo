import { useTokenBalance, useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import { getNiceNetworkNameByChainId, USDC_TOKEN_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { SupportedNetwork } from 'src/types'
import { Address, formatUnits, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { useVaultCreationSteps } from '@hooks/useVaultCreationSteps'
import { useVaultInfo } from '@hooks/useVaultInfo'
import { DeployVaultButton } from './buttons/DeployVaultButton'
import { PrevButton } from './buttons/PrevButton'
import { VaultPreview } from './VaultPreview'

interface DeployVaultViewProps {
  className?: string
}

export const DeployVaultView = (props: DeployVaultViewProps) => {
  const { className } = props

  const { nextStep } = useVaultCreationSteps()

  return (
    <div className={classNames('flex flex-col grow gap-8 items-center', className)}>
      <VaultPreview className='max-w-md' />
      <DeployVaultViewWarnings className='max-w-md' />
      <div className='flex gap-2 items-center'>
        <PrevButton className='w-36' />
        <DeployVaultButton onSuccess={nextStep} />
      </div>
    </div>
  )
}

const DeployVaultViewWarnings = (props: { className?: string }) => {
  const { className } = props

  const { address: userAddress } = useAccount()

  const { chainId, tokenAddress, yieldBuffer } = useVaultInfo()

  const { data: token } = useTokenBalance(
    chainId as SupportedNetwork,
    userAddress as Address,
    tokenAddress as Address,
    { refetchOnWindowFocus: true }
  )

  const { data: tokenPrices } = useTokenPrices(
    chainId as SupportedNetwork,
    !!chainId && !!tokenAddress ? [tokenAddress, USDC_TOKEN_ADDRESSES[chainId]] : []
  )

  const { setStep } = useVaultCreationSteps()

  const isBadTokenPrecision = useMemo(() => {
    if (!!token && !isNaN(token.decimals) && !!tokenPrices) {
      const tokenPrice = tokenPrices[token.address.toLowerCase() as Lowercase<Address>]
      const usdcPrice = tokenPrices[USDC_TOKEN_ADDRESSES[token.chainId]]

      if (!!tokenPrice && !!usdcPrice) {
        const precision = 10 ** token.decimals / tokenPrice
        const usdcPrecision = 10 ** 6 / usdcPrice // TODO: this assumes all USDC tokens have 6 decimals

        return precision < usdcPrecision
      }
    }

    return false
  }, [token, tokenPrices])

  const warning = useMemo(():
    | { text: string; fix?: { text: string; onClick: () => void } }
    | undefined => {
    if (token?.address === zeroAddress) {
      return {
        text: `The yield source you have selected doesn't seem valid.`,
        fix: { text: 'Select a valid yield source', onClick: () => setStep(1) }
      }
    } else if (!!token && isBadTokenPrecision) {
      return {
        text: `Using ${token.symbol} is likely to cause rounding error issues in the long run because of its high value to decimals ratio.`
      }
    } else if (!!token && !!yieldBuffer && token.amount < yieldBuffer) {
      return {
        text: `You need at least ${formatUnits(yieldBuffer, token.decimals)} ${
          token.symbol
        } on ${getNiceNetworkNameByChainId(
          token.chainId
        )} to deploy this prize vault. These tokens are donated to your new prize vault to prevent potential rounding errors.`
      }
    }
  }, [token, yieldBuffer])

  if (!warning) {
    return <></>
  }

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-3 items-start px-8 py-5 text-pt-warning-light bg-pt-transparent',
        'border border-pt-purple-100 rounded-2xl',
        className
      )}
    >
      <span className='text-xl font-bold'>Warning</span>
      <span className='text-sm leading-tight'>{warning.text}</span>
      {!!warning.fix && (
        <button onClick={warning.fix.onClick} className='text-sm text-pt-teal-dark'>
          {warning.fix.text}
        </button>
      )}
    </div>
  )
}
