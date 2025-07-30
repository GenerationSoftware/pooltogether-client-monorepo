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
import { worldVaults } from './world'

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
    'gnosis',
    'world'
  ],
  version: { major: 2, minor: 20, patch: 0 },
  timestamp: '2025-07-30T17:46:30Z',
  logoURI: `${DOMAINS.app}/favicon.png`,
  tokens: [
    ...mainnetVaults,
    ...optimismVaults,
    ...baseVaults,
    ...arbitrumVaults,
    ...scrollVaults,
    ...gnosisVaults,
    ...worldVaults,
    ...optimismSepoliaVaults,
    ...baseSepoliaVaults,
    ...arbitrumSepoliaVaults,
    ...scrollSepoliaVaults,
    ...gnosisChiadoVaults
  ]
}

export default defaultVaultList
