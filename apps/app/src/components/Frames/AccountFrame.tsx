import { DOMAINS, shorten } from '@shared/utilities'
import Head from 'next/head'
import { isAddress } from 'viem'

export interface AccountFrameProps {
  user?: string
}

export const AccountFrame = (props: AccountFrameProps) => {
  const { user } = props

  return (
    <Head>
      <meta property='fc:frame' content='vNext' />
      {/* TODO: add "check your account" image */}
      <meta
        property='fc:frame:image'
        content={`${DOMAINS.app}/facebook-share-image-1200-630.png`}
      />
      <meta
        name='fc:frame:post_url'
        content={`${DOMAINS.app}/api/frame/account${!!user ? `/${user}` : ''}`}
      />
      {!!user ? (
        <meta
          name='fc:frame:button:1'
          content={`Check ${isAddress(user) ? shorten(user) : user}\`s Account`}
        />
      ) : (
        <>
          <meta name='fc:frame:input:text' content='Enter an address or ENS...' />
          <meta name='fc:frame:button:1' content='Check Account' />
        </>
      )}
    </Head>
  )
}
