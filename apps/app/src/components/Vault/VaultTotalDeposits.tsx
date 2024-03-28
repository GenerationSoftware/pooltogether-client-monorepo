import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultBalance, useVaultShareData } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenValue } from '@shared/react-components'
import { Spinner } from '@shared/ui'

interface VaultTotalDepositsProps {
  vault: Vault
}

export const VaultTotalDeposits = (props: VaultTotalDepositsProps) => {
  const { vault } = props

  const { data: shareData } = useVaultShareData(vault)

  const { data: totalDeposits, isFetched: isFetchedTotalDeposits } = useVaultBalance(vault)

  if (!isFetchedTotalDeposits) {
    return <Spinner />
  }

  if (totalDeposits === undefined) {
    return <>?</>
  }

  if (totalDeposits.amount === 0n && !!shareData && shareData.totalSupply > 0n) {
    return <TokenAmount token={{ ...shareData, amount: shareData.totalSupply }} hideZeroes={true} />
  }

  return (
    <TokenValue
      token={totalDeposits}
      hideZeroes={true}
      fallback={<TokenAmount token={totalDeposits} hideZeroes={true} />}
    />
  )
}
