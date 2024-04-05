import { shorten } from '@shared/utilities'
import Head from 'next/head'
import { isAddress } from 'viem'
import { APP_URL } from '@constants/config'

export interface AccountFrameProps {
  user?: string
}

export const AccountFrame = (props: AccountFrameProps) => {
  const { user } = props

  const postUrl = new URL(`${APP_URL}/api/frame/account`)

  if (!!user) {
    postUrl.searchParams.set('user', user)
  }

  const formattedUser = !!user ? (isAddress(user) ? shorten(user) : user) : null

  return (
    <Head>
      <meta property='fc:frame' content='vNext' />
      {/* TODO: add "check your account" image */}
      <meta property='fc:frame:image' content={`${APP_URL}/facebook-share-image-1200-630.png`} />
      <meta name='fc:frame:post_url' content={postUrl.toString()} />
      {!!user ? (
        <>
          <meta name='fc:frame:button:1' content={`Check ${formattedUser}'s Account`} />
          <meta name='fc:frame:button:2' content='View on App' />
          <meta name='fc:frame:button:2:action' content='link' />
          <meta name='fc:frame:button:2:target' content={`${APP_URL}/account/${user}`} />
        </>
      ) : (
        <>
          <meta name='fc:frame:input:text' content='Enter an address or ENS...' />
          <meta name='fc:frame:button:1' content='Check Account' />
        </>
      )}
    </Head>
  )
}
