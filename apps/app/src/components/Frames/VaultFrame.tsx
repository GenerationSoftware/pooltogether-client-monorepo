import { DOMAINS } from '@shared/utilities'
import Head from 'next/head'
import { DefaultFrame } from './DefaultFrame'

export interface VaultFrameProps {
  chainId?: string
  vaultAddress?: string
}

// TODO: this is just a temporary vault frame to at least link to the vault page with a button
export const VaultFrame = (props: VaultFrameProps) => {
  const { chainId, vaultAddress } = props

  if (!chainId || !vaultAddress) {
    return <DefaultFrame />
  }

  return (
    <Head>
      <meta property='fc:frame' content='vNext' />
      <meta
        property='fc:frame:image'
        content={`${DOMAINS.app}/facebook-share-image-1200-630.png`}
      />
      <meta name='fc:frame:button:1' content='Vault' />
      <meta name='fc:frame:button:1:action' content='link' />
      <meta
        name='fc:frame:button:1:target'
        content={`${DOMAINS.app}/vault/${chainId}/${vaultAddress}`}
      />
      <meta name='fc:frame:button:2' content='Account' />
      <meta name='fc:frame:button:2:action' content='link' />
      <meta name='fc:frame:button:2:target' content={`${DOMAINS.app}/account`} />
      <meta name='fc:frame:button:3' content='Docs' />
      <meta name='fc:frame:button:3:action' content='link' />
      <meta name='fc:frame:button:3:target' content={DOMAINS.docs} />
    </Head>
  )
}
