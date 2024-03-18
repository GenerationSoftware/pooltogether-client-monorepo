import {
  useToken,
  useTokenBalance,
  useTokenPrices
} from '@generationsoftware/hyperstructure-react-hooks'
import { getNiceNetworkNameByChainId, MAX_UINT_96, USDC_TOKEN_ADDRESSES } from '@shared/utilities'
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

  const { data: tokenWithSupply } = useToken(chainId as SupportedNetwork, tokenAddress as Address)

  const { data: tokenPrices } = useTokenPrices(
    chainId as SupportedNetwork,
    !!chainId && !!tokenAddress ? [tokenAddress, USDC_TOKEN_ADDRESSES[chainId]] : []
  )

  const { setStep } = useVaultCreationSteps()

  const warnings = useMemo(() => {
    const warnings: { id: string; text: string; fix?: { text: string; onClick: () => void } }[] = []

    if (!!token) {
      // Invalid yield source
      if (token.address === zeroAddress) {
        warnings.push({
          id: 'invalidYieldSource',
          text: `The yield source you have selected doesn't seem valid.`,
          fix: { text: 'Select a valid yield source', onClick: () => setStep(1) }
        })
      }

      // Bad precision per dollar
      if (!isNaN(token.decimals) && !!tokenPrices) {
        const tokenPrice = tokenPrices[token.address.toLowerCase() as Lowercase<Address>]
        const usdcPrice = tokenPrices[USDC_TOKEN_ADDRESSES[token.chainId]]

        if (!!tokenPrice && !!usdcPrice) {
          const precision = 10 ** token.decimals / tokenPrice
          const usdcPrecision = 10 ** 6 / usdcPrice // TODO: this assumes all USDC tokens have 6 decimals

          if (precision < usdcPrecision) {
            warnings.push({
              id: 'badPrecisionPerDollar',
              text: `Using ${token.symbol} is likely to cause rounding error issues in the long run because of its high value to decimals ratio.`
            })
          }
        }
      }

      // Total supply too large
      if (!!tokenWithSupply && tokenWithSupply.totalSupply > MAX_UINT_96) {
        const numTokens = formatUnits(MAX_UINT_96, token.decimals)

        warnings.push({
          id: 'largeTotalSupply',
          text: `A maximum of ${numTokens} ${token.symbol} can be deposited into this prize vault (less than its total supply).`
        })
      }

      // Not enough tokens in wallet
      if (!!yieldBuffer && token.amount < yieldBuffer) {
        const numTokens = formatUnits(yieldBuffer, token.decimals)
        const networkName = getNiceNetworkNameByChainId(token.chainId)

        warnings.push({
          id: 'missingTokensInWallet',
          text: `You need at least ${numTokens} ${token.symbol} on ${networkName} to deploy this prize vault. These tokens are donated to your new prize vault to prevent potential rounding errors.`
        })
      }
    }

    return warnings
  }, [token, yieldBuffer, tokenPrices])

  if (!warnings.length) {
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
      <span className='text-xl font-bold'>Warning{warnings.length > 1 ? 's' : ''}</span>
      {warnings.map((warning) => (
        <div key={warning.id} className='text-sm'>
          <span className='leading-tight'>{warning.text}</span>
          {!!warning.fix && (
            <button onClick={warning.fix.onClick} className='text-pt-teal-dark'>
              {warning.fix.text}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
