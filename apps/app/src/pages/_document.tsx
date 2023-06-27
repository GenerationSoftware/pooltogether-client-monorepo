import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    const title = 'PoolTogether Hyperstructure App'

    return (
      <Html className='bg-pt-bg-purple-darker text-pt-purple-50 overflow-x-hidden dark'>
        {/* TODO: add meta tags, link to manifest, etc. to head */}
        <Head>
          <title>{title}</title>
          <link rel='icon' href='/favicon.ico' />
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
