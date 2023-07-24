import Link from 'next/link'
import { PurpleButton } from '@components/buttons/PurpleButton'
import { Layout } from '@components/Layout'

export default function HomePage() {
  return (
    <Layout>
      <Link href='/create' passHref={true}>
        <PurpleButton>Click this to create a vault - WIP</PurpleButton>
      </Link>
    </Layout>
  )
}
