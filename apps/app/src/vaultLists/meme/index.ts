import { VaultList } from '@shared/types'
import { DOMAINS } from '@shared/utilities'
import { baseVaults } from './base'

const memeVaultList: VaultList = {
  name: 'Meme Vault List',
  keywords: ['pooltogether', 'memes', 'base'],
  version: { major: 1, minor: 1, patch: 1 },
  timestamp: '2024-08-19T05:52:33Z',
  logoURI: `${DOMAINS.app}/doge.png`,
  tokens: [...baseVaults]
}

export default memeVaultList
