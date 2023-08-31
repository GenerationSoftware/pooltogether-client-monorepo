import { useSelectedVault, useSelectedVaults } from '@pooltogether/hyperstructure-react-hooks'
import { PrizePoolDropdown } from '@shared/react-components'
import { Button } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useNetworks } from '@hooks/useNetworks'
import { useSelectedPrizePool } from '@hooks/useSelectedPrizePool'
import { PrizesTable } from './PrizesTable'

export const PrizePoolDisplay = () => {
  const router = useRouter()

  const t_common = useTranslations('Common')
  const t_prizes = useTranslations('Prizes')

  const networks = useNetworks()

  const { vaults } = useSelectedVaults()
  const { setSelectedVaultById } = useSelectedVault()

  const { selectedPrizePool } = useSelectedPrizePool()

  const handleNetworkChange = (chainId: number) => {
    if (!!chainId && chainId in NETWORK) {
      const firstVaultInChain = Object.values(vaults.vaults).find(
        (vault) => vault.chainId === chainId
      )
      !!firstVaultInChain && setSelectedVaultById(firstVaultInChain.id)
    }
  }

  useEffect(() => {
    const rawUrlNetwork = router.query['network']
    const chainId =
      !!rawUrlNetwork && typeof rawUrlNetwork === 'string' ? parseInt(rawUrlNetwork) : undefined
    if (!!chainId) {
      handleNetworkChange(chainId)
    }
  }, [router])

  return (
    <>
      <PrizePoolDropdown
        networks={networks}
        selectedNetwork={selectedPrizePool?.chainId as NETWORK}
        onSelect={handleNetworkChange}
        intl={{ common: t_common, switchPrizePool: t_prizes('switchPrizePool') }}
      />
      <Link href={`/vaults?network=${selectedPrizePool?.chainId}`} passHref={true}>
        <Button>{t_common('depositToWin')}</Button>
      </Link>
      {!!selectedPrizePool && <PrizesTable prizePool={selectedPrizePool} />}
    </>
  )
}
