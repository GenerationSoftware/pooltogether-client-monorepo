import { VaultList } from '@shared/types'
import { DOMAINS } from '@shared/utilities'
import { arbitrumVaults } from './arbitrum'
import { arbitrumSepoliaVaults } from './arbitrumSepolia'
import { baseVaults } from './base'
import { baseSepoliaVaults } from './baseSepolia'
import { gnosisVaults } from './gnosis'
import { gnosisChiadoVaults } from './gnosisChiado'
import { mainnetVaults } from './mainnet'
import { optimismVaults } from './optimism'
import { optimismSepoliaVaults } from './optimismSepolia'
import { scrollVaults } from './scroll'
import { scrollSepoliaVaults } from './scrollSepolia'

const defaultVaultList: VaultList = {
  name: 'Cabana Vault List',
  keywords: [
    'pooltogether',
    'cabana',
    'g9',
    'ethereum',
    'optimism',
    'base',
    'arbitrum',
    'scroll',
    'gnosis'
  ],
  version: { major: 2, minor: 17, patch: 2 },
  timestamp: '2025-02-04T16:43:36Z',
  logoURI: `${DOMAINS.app}/favicon.png`,
  tokens: [
    ...mainnetVaults,
    ...optimismVaults,
    ...baseVaults,
    ...arbitrumVaults,
    ...scrollVaults,
    ...gnosisVaults,
    ...optimismSepoliaVaults,
    ...baseSepoliaVaults,
    ...arbitrumSepoliaVaults,
    ...scrollSepoliaVaults,
    ...gnosisChiadoVaults
  ]
}

export default defaultVaultList
