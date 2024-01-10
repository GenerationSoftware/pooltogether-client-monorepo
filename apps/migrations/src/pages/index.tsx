import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { Intro } from '@components/Intro'
import { Layout } from '@components/Layout'
import { Migrations } from '@components/Migrations'

export default function HomePage() {
  const { address: userAddress } = useAccount()

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  return (
    <Layout>
      {isBrowser ? !!userAddress ? <Migrations userAddress={userAddress} /> : <Intro /> : <></>}
    </Layout>
  )
}
