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
  keywords: ['pooltogether', 'cabana', 'g9', 'optimism', 'base', 'arbitrum'],
  version: { major: 2, minor: 10, patch: 0 },
  timestamp: '2024-07-24T21:19:51Z',
  logoURI: `${DOMAINS.app}/favicon.png`,
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
