import { useRouter } from 'next/router'
import { Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { Layout } from '@components/Layout'
import { V3Migration } from '@components/V3/V3Migration'
import { V4Migration } from '@components/V4/V4Migration'
import { V5Migration } from '@components/V5/V5Migration'
import { SUPPORTED_NETWORKS, SupportedNetwork } from '@constants/config'
import { useUserV3Balances } from '@hooks/useUserV3Balances'
import { useUserV4Balances } from '@hooks/useUserV4Balances'
import { useUserV5Balances } from '@hooks/useUserV5Balances'

export default function MigrationPage() {
  const router = useRouter()

  const { address: userAddress } = useAccount()

  const { data: userV5Balances } = useUserV5Balances(userAddress as Address)
  const { data: userV4Balances } = useUserV4Balances(userAddress as Address)
  const { data: userV3Balances } = useUserV3Balances(userAddress as Address)

  if (router.isReady) {
    const chainId =
      !!router.query.chainId &&
      typeof router.query.chainId === 'string' &&
      SUPPORTED_NETWORKS.includes(parseInt(router.query.chainId))
        ? (parseInt(router.query.chainId) as SupportedNetwork)
        : undefined

    const version =
      !!router.query.version &&
      typeof router.query.version === 'string' &&
      ['v5', 'v4', 'v3'].includes(router.query.version)
        ? router.query.version
        : undefined

    const tokenAddress =
      !!router.query.tokenAddress &&
      typeof router.query.tokenAddress === 'string' &&
      isAddress(router.query.tokenAddress)
        ? (router.query.tokenAddress.toLowerCase() as Lowercase<Address>)
        : undefined

    if (!!userAddress && !!chainId && !!version && !!tokenAddress) {
      if (version === 'v5') {
        const v5Migration = userV5Balances.find(
          (balance) => balance.token.address.toLowerCase() === tokenAddress
        )

        if (!!v5Migration) {
          return (
            <Layout>
              <V5Migration userAddress={userAddress} migration={v5Migration} />
            </Layout>
          )
        }
      } else if (version === 'v4') {
        const v4Migration = userV4Balances.find(
          (balance) => balance.token.address.toLowerCase() === tokenAddress
        )

        if (!!v4Migration) {
          return (
            <Layout>
              <V4Migration userAddress={userAddress} migration={v4Migration} />
            </Layout>
          )
        }
      } else if (version === 'v3') {
        const v3Migration = userV3Balances.find(
          (balance) => balance.token.address.toLowerCase() === tokenAddress
        )

        if (!!v3Migration) {
          return (
            <Layout>
              <V3Migration userAddress={userAddress} migration={v3Migration} />
            </Layout>
          )
        }
      }
    }

    router.replace('/')
  }
}
