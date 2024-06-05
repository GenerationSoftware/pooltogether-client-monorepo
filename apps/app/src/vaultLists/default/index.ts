import { VaultList } from '@shared/types'
import { DOMAINS } from '@shared/utilities'
import { arbitrumVaults } from './arbitrum'
import { arbitrumSepoliaVaults } from './arbitrumSepolia'
import { baseVaults } from './base'
import { baseSepoliaVaults } from './baseSepolia'
import { optimismVaults } from './optimism'
import { optimismSepoliaVaults } from './optimismSepolia'

const defaultVaultList: VaultList = {
  name: 'Cabana Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'optimism'],
  version: { major: 2, minor: 8, patch: 2 },
  timestamp: '2024-06-04T19:40:08Z',
  logoURI: `${DOMAINS.app}/pooltogether-token-logo.svg`,
  tokens: [
    ...optimismVaults,
    ...baseVaults,
    ...arbitrumVaults,
    ...optimismSepoliaVaults,
    ...baseSepoliaVaults,
    ...arbitrumSepoliaVaults
  ]
}

export default defaultVaultList
