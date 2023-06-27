import { useSelectedVaults } from '@pooltogether/hyperstructure-react-hooks'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Layout } from '@components/Layout'
import { VaultPageButtons } from '@components/Vault/VaultPageButtons'
import { VaultPageHeader } from '@components/Vault/VaultPageHeader'
import { VaultPageInfo } from '@components/Vault/VaultPageInfo'

// TODO: need to be able to load a vault not in selected vault lists
export default function VaultPage() {
  const router = useRouter()

  const { vaultId } = router.query

  const { vaults } = useSelectedVaults()

  const vault = useMemo(() => {
    return vaults?.vaults[vaultId as string]
  }, [vaultId, vaults])

  if (router.isReady) {
    return (
      <Layout className='gap-12'>
        {!!vault && (
          <>
            <VaultPageHeader vault={vault} />
            <VaultPageInfo vault={vault} />
            <VaultPageButtons vault={vault} />
          </>
        )}
      </Layout>
    )
  }
}
