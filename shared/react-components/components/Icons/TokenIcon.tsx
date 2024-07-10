import { useCoingeckoTokenData } from '@shared/generic-react-hooks'
import { TokenWithLogo } from '@shared/types'
import { BasicIcon, Spinner } from '@shared/ui'
import { COINGECKO_PLATFORMS, lower, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { Address } from 'viem'
import { TOKEN_LOGO_OVERRIDES } from '../../constants'

export interface TokenIconProps {
  token: Partial<TokenWithLogo>
  fallbackToken?: Partial<TokenWithLogo>
  showSpinner?: boolean
  className?: string
}

export const TokenIcon = (props: TokenIconProps) => {
  const { token, fallbackToken, showSpinner, className } = props

  const altText = !!token.symbol
    ? `${token.symbol} Logo`
    : !!token.name
    ? `${token.name} Logo`
    : 'Token Logo'

  if (!!token.logoURI) {
    return <Icon logoURI={token.logoURI} altText={altText} className={className} />
  }

  if (!!token.chainId && !!token.address) {
    const logoOverride = TOKEN_LOGO_OVERRIDES[token.chainId as NETWORK]?.[lower(token.address)]

    if (!!logoOverride) {
      return <Icon logoURI={logoOverride} altText={altText} className={className} />
    }

    if (token.chainId === NETWORK.optimism && token.symbol?.startsWith('vAMMV2-')) {
      return (
        <Icon
          logoURI='https://optimistic.etherscan.io/token/images/velodromefinance_32.png'
          altText={altText}
          className={className}
        />
      )
    }

    if (token.chainId === NETWORK.base && token.symbol?.startsWith('vAMM-')) {
      return (
        <Icon
          logoURI='https://basescan.org/token/images/aerodrome_32.png'
          altText={altText}
          className={className}
        />
      )
    }

    if (token.chainId in COINGECKO_PLATFORMS) {
      return (
        <CoingeckoTokenIcon
          token={token as TokenWithLogo}
          fallbackToken={
            !!fallbackToken?.chainId && !!fallbackToken.address
              ? (fallbackToken as TokenWithLogo)
              : undefined
          }
          altText={altText}
          showSpinner={showSpinner}
          className={className}
        />
      )
    }
  }

  if (!!fallbackToken) {
    return <TokenIcon token={fallbackToken} className={className} showSpinner={showSpinner} />
  }

  return <FallbackIcon symbol={token.symbol} className={className} />
}

interface CoingeckoTokenIconProps {
  token: { chainId: number; address: Address } & Partial<TokenWithLogo>
  fallbackToken?: { chainId: number; address: Address } & Partial<TokenWithLogo>
  altText?: string
  showSpinner?: boolean
  className?: string
}

const CoingeckoTokenIcon = (props: CoingeckoTokenIconProps) => {
  const { token, fallbackToken, altText, showSpinner, className } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useCoingeckoTokenData(
    token.chainId,
    token.address
  )

  if (!isFetchedTokenData) {
    return showSpinner === false ? <></> : <Spinner />
  }

  if (!!tokenData?.image?.small) {
    return <Icon logoURI={tokenData.image.small} altText={altText} className={className} />
  }

  if (!!fallbackToken && fallbackToken.chainId in COINGECKO_PLATFORMS) {
    return (
      <CoingeckoTokenIcon
        token={fallbackToken}
        altText={altText}
        showSpinner={showSpinner}
        className={className}
      />
    )
  }

  return <FallbackIcon symbol={token.symbol} className={className} />
}

interface IconProps {
  logoURI: string
  altText?: string
  className?: string
}

const Icon = (props: IconProps) => {
  const { logoURI, altText, className } = props

  return (
    <img src={logoURI} alt={altText} className={classNames('h-6 w-6 rounded-full', className)} />
  )
}

interface FallbackIconProps {
  symbol?: string
  className?: string
}

const FallbackIcon = (props: FallbackIconProps) => {
  const { symbol, className } = props

  return (
    <BasicIcon content={!!symbol ? symbol.slice(0, 2).toUpperCase() : '?'} className={className} />
  )
}
