import { TokenWithSupply } from '@shared/types'
import { lower, NETWORK } from '@shared/utilities'
import { Address } from 'viem'
import {
  useBeefyVault,
  useIsCurveLp,
  useIsVelodromeLp,
  useLpToken,
  useSelectedVaults,
  useVaultExchangeRate,
  useVaultTokenData
} from '..'

export const useZapTokenInfo = (chainId: NETWORK, address: Address) => {
  const {
    vaults: { vaults }
  } = useSelectedVaults()
  const vaultsArray = Object.values(vaults).filter((v) => v.chainId === chainId)

  const vault = !!address && vaultsArray.find((v) => lower(v.address) === lower(address))

  const { data: vaultToken, isFetched: isFetchedVaultToken } = useVaultTokenData(vault!)
  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault!)
  const { data: beefyVault, isFetched: isFetchedBeefyVault } = useBeefyVault(vault!)

  const potentialLpToken = !!vault ? vaultToken! : { chainId, address }

  const { data: isVelodromeLp, isFetched: isFetchedIsVelodromeLp } =
    useIsVelodromeLp(potentialLpToken)
  const { data: isCurveLp, isFetched: isFetchedIsCurveLp } = useIsCurveLp(potentialLpToken)

  const { data: lpToken, isFetched: isFetchedLpToken } = useLpToken(potentialLpToken, {
    enabled: (isVelodromeLp || isCurveLp) ?? false
  })

  const data: Partial<{
    vaultToken: TokenWithSupply
    exchangeRate: bigint
    beefyVault: ReturnType<typeof useBeefyVault>['data']
    isVelodromeLp: boolean
    isCurveLp: boolean
    lpToken: ReturnType<typeof useLpToken>['data']
  }> = { vaultToken, exchangeRate, beefyVault, isVelodromeLp, isCurveLp, lpToken }

  const isFetched =
    !!chainId &&
    !!address &&
    (!vault || (isFetchedVaultToken && isFetchedExchangeRate && isFetchedBeefyVault)) &&
    (!vaultToken || (isFetchedIsVelodromeLp && isFetchedIsCurveLp)) &&
    ((!isVelodromeLp && !isCurveLp) || isFetchedLpToken)

  return { data, isFetched }
}
