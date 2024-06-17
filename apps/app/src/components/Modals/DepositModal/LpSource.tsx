import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useSelectedVaultLists,
  useTokenBalance,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { VaultInfo } from '@shared/types'
import { ExternalLink } from '@shared/ui'
import { getVaultId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { getCleanURI } from 'src/utils'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

interface LpSourceProps {
  vault: Vault
  className?: string
}

export const LpSource = (props: LpSourceProps) => {
  const { vault, className } = props

  const t = useTranslations('Common')

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const { address: userAddress } = useAccount()
  const { data: vaultToken } = useVaultTokenData(vault)
  const { data: tokenWithAmount, isFetched: isFetchedTokenBalance } = useTokenBalance(
    vault.chainId,
    userAddress as Address,
    vaultToken?.address as Address
  )
  const tokenBalance =
    isFetchedTokenBalance && !!tokenWithAmount ? tokenWithAmount.amount : undefined

  const vaultListEntries = useMemo(() => {
    const entries: VaultInfo[] = []

    Object.values({ ...localVaultLists, ...importedVaultLists }).forEach((list) => {
      for (const entry of list.tokens) {
        if (vault.id === getVaultId(entry)) {
          entries.push(entry)
        }
      }
    })

    return entries
  }, [vault, localVaultLists, importedVaultLists])

  const sourceURI = useMemo(() => {
    let URI: string | undefined

    vaultListEntries.forEach((entry) => {
      const appURI = entry.extensions?.lp?.appURI
      if (!!appURI) URI = appURI
    })

    return URI
  }, [vaultListEntries])

  const cleanSourceURI = useMemo(() => {
    if (!!sourceURI) {
      return getCleanURI(sourceURI)
    }
  }, [sourceURI])

  if (!!vaultToken && !!sourceURI && !!cleanSourceURI && tokenBalance === 0n) {
    return (
      <span className={classNames('text-center text-sm', className)}>
        {t('getTokenAt', { token: vaultToken.symbol })}{' '}
        <ExternalLink href={sourceURI} size='sm' className='text-pt-purple-200'>
          {cleanSourceURI}
        </ExternalLink>
      </span>
    )
  }

  return <></>
}
