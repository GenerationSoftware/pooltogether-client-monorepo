import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getMessages } from 'src/utils'
import { Layout } from '@components/Layout'
import { VaultPageContent } from '@components/Vault/VaultPageContent'

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

interface VaultPageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<VaultPageProps> = async ({ locale }) => {
  const messages = await getMessages(locale)

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

export default function VaultPage() {
  const router = useRouter()

  const [vaultName, setVaultName] = useState<string>('')

  if (router.isReady && !router.isFallback) {
    return (
      <Layout overrides={{ pageTitle: vaultName }} className='gap-8'>
        <VaultPageContent queryParams={router.query} onFetchedVaultName={setVaultName} />
      </Layout>
    )
  }
}
