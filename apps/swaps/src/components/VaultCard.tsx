import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenIcon } from '@shared/react-components'
import { Token } from '@shared/types'
import { LINKS } from '@shared/ui'
import { ExternalLink } from '@shared/ui'
import { DOLPHIN_ADDRESS, getNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { Address, zeroAddress } from 'viem'
import { CURVE_POOLS } from '@constants/config'

interface VaultCardProps {
  vault: Vault
  prizeToken: Token
  className?: string
}

export const VaultCard = (props: VaultCardProps) => {
  const { vault, prizeToken, className } = props

  const { data: shareToken } = useVaultShareData(vault)
  const { data: token } = useVaultTokenData(vault)

  if (!!shareToken && !!token) {
    return (
      <div
        className={classNames(
          'w-full max-w-xs flex flex-col gap-6 items-center text-center p-11 rounded-lg',
          'bg-pt-purple-200 text-pt-purple-600',
          'border border-pt-purple-400',
          className
        )}
      >
        <VaultCardHeader token={token} shareToken={shareToken} prizeToken={prizeToken} />
        <VaultCardActions shareToken={shareToken} />
      </div>
    )
  }

  return <></>
}

interface VaultCardHeaderProps {
  token: Token
  shareToken: Token
  prizeToken: Token
  className?: string
}

const VaultCardHeader = (props: VaultCardHeaderProps) => {
  const { token, shareToken, prizeToken, className } = props

  return (
    <div className={classNames('w-full flex flex-col gap-2 items-center', className)}>
      <div className='relative'>
        <TokenIcon token={token} />
        <TokenIcon token={prizeToken} className='absolute top-3 left-3 !h-4 !w-4' />
      </div>
      <span className='font-semibold text-xl text-pt-purple-800'>{shareToken.name}</span>
      <ExternalLink
        href={`${LINKS.app}/vault/${shareToken.chainId}/${shareToken.address}`}
        size='sm'
      >
        Learn about this token
      </ExternalLink>
    </div>
  )
}

interface VaultCardActionsProps {
  shareToken: Token
  className?: string
}

const VaultCardActions = (props: VaultCardActionsProps) => {
  const { shareToken, className } = props

  const network = getNetworkNameByChainId(shareToken.chainId)

  const curvePool = CURVE_POOLS[shareToken.chainId]?.[shareToken.address.toLowerCase() as Address]

  const actions: { [id: string]: { href: string; text: string } } = {
    'portals': {
      href: `https://app.portals.fi/?inputToken=${network}%3A${zeroAddress}&outputToken=${network}%3A${shareToken.address.toLowerCase()}`,
      text: 'Swap on Portals'
    },
    'metamask': {
      href: `https://portfolio.metamask.io/swap?chainId=${shareToken.chainId}&toAddress=${shareToken.address}`,
      text: 'Swap on MetaMask'
    },
    'llamaswap': {
      href: `https://swap.defillama.com/?chain=${network}&to=${shareToken.address}`,
      text: 'Swap on Llamaswap'
    },
    'paraswap': {
      href: `https://app.paraswap.io/#/${DOLPHIN_ADDRESS}-${shareToken.address}?network=${network}`,
      text: 'Swap on Paraswap'
    },
    '1inch': {
      href: `https://app.1inch.io/#/${shareToken.chainId}/simple/swap/${DOLPHIN_ADDRESS}/${shareToken.address}`,
      text: 'Swap on 1inch'
    },
    'uniswap': {
      href: `https://app.uniswap.org/tokens/${network}/${shareToken.address}`,
      text: 'Swap on Uniswap'
    },
    'curve': {
      href: !!curvePool ? `https://curve.fi/#/${network}/pools/${curvePool}/swap` : '',
      text: 'Swap on Curve'
    },
    'jumper': {
      href: `https://jumper.exchange/?fromChain=${shareToken.chainId}&toChain=${shareToken.chainId}&toToken=${shareToken.address}&utm_source=cabana`,
      text: 'Swap on Jumper'
    },
    'cabana': {
      href: `${LINKS.app}/vault/${shareToken.chainId}/${shareToken.address}`,
      text: 'Deposit on Cabana.fi'
    }
  }

  return (
    <div className={classNames('w-full flex flex-col gap-2', className)}>
      {Object.entries(actions).map(
        ([id, action]) =>
          !!action.href && (
            <VaultCardLink key={`link-${id}`} href={action.href}>
              {action.text}
            </VaultCardLink>
          )
      )}
    </div>
  )
}

interface VaultCardLinkProps {
  href: string
  children: ReactNode
  className?: string
}

const VaultCardLink = (props: VaultCardLinkProps) => {
  const { href, children, className } = props

  return (
    <ExternalLink
      href={href}
      className={classNames(
        'gap-2 justify-center px-3 py-2 font-medium text-sm rounded-lg',
        'bg-pt-purple-300 text-pt-purple-800',
        'hover:bg-pt-purple-400',
        className
      )}
      iconClassName='text-pt-purple-500'
    >
      {children}
    </ExternalLink>
  )
}
