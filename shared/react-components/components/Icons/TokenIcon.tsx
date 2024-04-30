import { useCoingeckoTokenData } from '@shared/generic-react-hooks'
import { TokenWithLogo } from '@shared/types'
import { BasicIcon, Spinner } from '@shared/ui'
import { COINGECKO_PLATFORMS, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { TOKEN_LOGO_OVERRIDES } from '../../constants'

export interface TokenIconProps {
  token: Partial<TokenWithLogo>
  className?: string
}

export const TokenIcon = (props: TokenIconProps) => {
  const { token, className } = props

  const altText = !!token.symbol
    ? `${token.symbol} Logo`
    : !!token.name
    ? `${token.name} Logo`
    : 'Token Logo'

  const Icon = (props: { logoURI: string }) => (
    <img
      src={props.logoURI}
      alt={altText}
      className={classNames('h-6 w-6 rounded-full', className)}
    />
  )

  if (!!token.logoURI) {
    return <Icon logoURI={token.logoURI} />
  }

  if (!!token.chainId && !!token.address) {
    const logoOverride =
      TOKEN_LOGO_OVERRIDES[token.chainId as NETWORK]?.[
        token.address.toLowerCase() as Lowercase<string>
      ]

    if (!!logoOverride) {
      return <Icon logoURI={logoOverride} />
    }

    if (token.chainId === NETWORK.optimism && token.symbol?.startsWith('vAMMV2-')) {
      return <Icon logoURI='https://optimistic.etherscan.io/token/images/velodromefinance_32.png' />
    }

    if (token.chainId in COINGECKO_PLATFORMS) {
      return (
        <CoingeckoTokenIcon
          chainId={token.chainId}
          tokenAddress={token.address}
          altText={altText}
          symbol={token.symbol}
          className={className}
        />
      )
    }
  }

  return <FallbackTokenIcon symbol={token.symbol} className={className} />
}

interface CoingeckoTokenIconProps {
  chainId: number
  tokenAddress: string
  altText?: string
  symbol?: string
  className?: string
}

const CoingeckoTokenIcon = (props: CoingeckoTokenIconProps) => {
  const { chainId, tokenAddress, altText, symbol, className } = props

  const { data: tokenData, isFetched: isFetchedTokenData } = useCoingeckoTokenData(
    chainId,
    tokenAddress
  )

  if (!isFetchedTokenData) {
    return <Spinner />
  }

  if (!!tokenData?.image?.small) {
    return (
      <img
        src={tokenData.image.small}
        alt={altText}
        className={classNames('h-6 w-6 rounded-full', className)}
      />
    )
  }

  return <FallbackTokenIcon symbol={symbol} className={className} />
}

interface FallbackTokenIconProps {
  symbol?: string
  className?: string
}

const FallbackTokenIcon = (props: FallbackTokenIconProps) => {
  const { symbol, className } = props

  return (
    <BasicIcon content={!!symbol ? symbol.slice(0, 2).toUpperCase() : '?'} className={className} />
  )
}
