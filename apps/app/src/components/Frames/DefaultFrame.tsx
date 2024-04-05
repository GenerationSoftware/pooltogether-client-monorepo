import { DOMAINS } from '@shared/utilities'
import Head from 'next/head'
import { APP_URL } from '@constants/config'

export const DefaultFrame = () => (
  <Head>
    <meta property='fc:frame' content='vNext' />
    <meta property='fc:frame:image' content={`${APP_URL}/facebook-share-image-1200-630.png`} />
    <meta name='fc:frame:button:1' content='Prizes' />
    <meta name='fc:frame:button:1:action' content='link' />
    <meta name='fc:frame:button:1:target' content={`${APP_URL}/prizes`} />
    <meta name='fc:frame:button:2' content='Vaults' />
    <meta name='fc:frame:button:2:action' content='link' />
    <meta name='fc:frame:button:2:target' content={`${APP_URL}/vaults`} />
    <meta name='fc:frame:button:3' content='Account' />
    <meta name='fc:frame:button:3:action' content='link' />
    <meta name='fc:frame:button:3:target' content={`${APP_URL}/account`} />
    <meta name='fc:frame:button:4' content='Docs' />
    <meta name='fc:frame:button:4:action' content='link' />
    <meta name='fc:frame:button:4:target' content={DOMAINS.docs} />
  </Head>
)
