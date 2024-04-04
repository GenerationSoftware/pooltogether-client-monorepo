import { DOMAINS } from '@shared/utilities'
import Head from 'next/head'

export const DefaultFrame = () => (
  <Head>
    <meta property='fc:frame' content='vNext' />
    <meta property='fc:frame:image' content={`${DOMAINS.app}/facebook-share-image-1200-630.png`} />
    <meta name='fc:frame:button:1' content='Prizes' />
    <meta name='fc:frame:button:1:action' content='link' />
    <meta name='fc:frame:button:1:target' content={`${DOMAINS.app}/prizes`} />
    <meta name='fc:frame:button:2' content='Vaults' />
    <meta name='fc:frame:button:2:action' content='link' />
    <meta name='fc:frame:button:2:target' content={`${DOMAINS.app}/vaults`} />
    <meta name='fc:frame:button:3' content='Account' />
    <meta name='fc:frame:button:3:action' content='link' />
    <meta name='fc:frame:button:3:target' content={`${DOMAINS.app}/account`} />
    <meta name='fc:frame:button:4' content='Docs' />
    <meta name='fc:frame:button:4:action' content='link' />
    <meta name='fc:frame:button:4:target' content={DOMAINS.docs} />
  </Head>
)
