import { SECONDS_PER_DAY } from '@shared/utilities'
import { GetStaticProps } from 'next'
import { getMessages } from 'src/utils'
import { Layout } from '@components/Layout'
import { VaultFilters } from '@components/Vault/VaultFilters'
import { VaultsDisclaimer } from '@components/Vault/VaultsDisclaimer'
import { VaultsDisplay } from '@components/Vault/VaultsDisplay'

interface VaultsPageProps {
  messages: IntlMessages
}

export const getStaticProps: GetStaticProps<VaultsPageProps> = async ({ locale }) => {
  const messages = await getMessages(locale, { useDefault: true })

  return {
    props: { messages },
    revalidate: SECONDS_PER_DAY
  }
}

export default function VaultsPage() {
  return (
    <Layout className='gap-6 lg:gap-14'>
      <VaultFilters />
      <VaultsDisclaimer className='lg:-mt-6' />
      <VaultsDisplay />
    </Layout>
  )
}
