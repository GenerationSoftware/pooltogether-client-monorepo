import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { FaqSection } from '@components/FaqSection'
import { Intro } from '@components/Intro'
import { Layout } from '@components/Layout'
import { Migrations } from '@components/Migrations'
import { MigrationsHeader } from '@components/MigrationsHeader'

export default function HomePage() {
  const { address: userAddress } = useAccount()

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  return (
    <Layout>
      <MigrationsHeader className='mb-8' />
      {isBrowser ? !!userAddress ? <Migrations userAddress={userAddress} /> : <Intro /> : <></>}
      <FaqSection className='mt-40' />
    </Layout>
  )
}
