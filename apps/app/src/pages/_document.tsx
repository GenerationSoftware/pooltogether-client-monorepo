import { DOMAINS } from '@shared/utilities'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    const title = 'Good Together'
    const description = 'Browse, deposit into and withdraw from any number of PoolTogether vaults.'
    const keywords =
      'pooltogether prize savings win save protocol blockchain vault vaultlist 4626 ethereum'
    const ogImage = `${DOMAINS.app}/facebook-share-image-1200-630.png`
    const twitterImage = `${DOMAINS.app}/twitter-share-image-1200-675.png`

    return (
      <Html className='bg-pt-bg-purple-darker text-pt-purple-50 overflow-x-hidden dark'>
        <Head>
          <link rel='icon' href='/favicon.png' type='image/x-icon' />
          <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
          <link rel='manifest' href='/manifest.json' />

          <meta name='theme-color' content='#005BBF' />
          <meta name='description' content={description} />
          <meta name='keywords' content={keywords} />
          <meta name='author' content='Generation Software Forked By MyEVM.xyz' />

          <meta property='og:title' content={title} />
          <meta property='og:description' content={description} />
          <meta property='og:site_name' content={title} />
          <meta property='og:url' content={DOMAINS.app} />
          <meta property='og:type' content='website' />
          <meta property='og:image' content={ogImage} />
          <meta property='og:rich_attachment' content='true' />
          <meta property='og:image:width' content='1200' />
          <meta property='og:image:height' content='630' />

          <meta property='twitter:title' content={title} />
          <meta property='twitter:description' content={description} />
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:site' content={'@g9software'} />
          <meta property='twitter:image:src' content={twitterImage} />
          <meta property='twitter:url' content={DOMAINS.app} />
          <meta property='twitter:creator' content={'@g9software'} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
