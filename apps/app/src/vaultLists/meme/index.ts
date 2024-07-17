import { VaultList } from '@shared/types'
import { DOMAINS } from '@shared/utilities'
import { baseVaults } from './base'

const memeVaultList: VaultList = {
  name: 'Meme Vault List',
  keywords: ['pooltogether', 'memes', 'base'],
  version: { major: 1, minor: 1, patch: 0 },
  timestamp: '2024-07-17T15:23:43Z',
  logoURI: `${DOMAINS.app}/doge.png`,
  tokens: [...baseVaults]
}

export default memeVaultList
