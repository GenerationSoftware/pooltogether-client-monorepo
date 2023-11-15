import { VaultList } from '@shared/types'
import { LINKS } from '@shared/ui'
import { NETWORK } from '@shared/utilities'
import { testnetVaults } from './testnet'

const defaultVaultList: VaultList = {
  name: 'Cabana Vault List',
  keywords: ['pooltogether', 'cabana', 'g9', 'optimism'],
  version: { major: 1, minor: 15, patch: 1 },
  timestamp: '2023-11-15T21:12:30Z',
  logoURI: `${LINKS.app}/pooltogether-token-logo.svg`,
  tokens: [
    {
      chainId: NETWORK.optimism,
      address: '0xE3B3a464ee575E8E25D2508918383b89c832f275',
      name: 'Prize USDC.e - Aave',
      decimals: 6,
      symbol: 'pUSDC.e',
      logoURI: `${LINKS.app}/icons/pUSDC.e.svg`,
      yieldSourceURI:
        'https://app.aave.com/reserve-overview/?underlyingAsset=0x7f5c764cbc14f9669b88837ca1490cca17c31607&marketName=proto_optimism_v3',
      extensions: {
        underlyingAsset: {
          address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
          symbol: 'USDC.e',
          name: 'USDC (Bridged from Ethereum)'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0x29Cb69D4780B53c1e5CD4D2B817142D2e9890715',
      name: 'Prize WETH - Aave',
      decimals: 18,
      symbol: 'pWETH',
      logoURI: `${LINKS.app}/icons/pWETH.svg`,
      yieldSourceURI:
        'https://app.aave.com/reserve-overview/?underlyingAsset=0x4200000000000000000000000000000000000006&marketName=proto_optimism_v3',
      extensions: {
        underlyingAsset: {
          address: '0x4200000000000000000000000000000000000006',
          symbol: 'WETH',
          name: 'Wrapped Ether'
        }
      }
    },
    {
      chainId: NETWORK.optimism,
      address: '0xCe8293f586091d48A0cE761bBf85D5bCAa1B8d2b',
      name: 'Prize DAI - Aave',
      decimals: 18,
      symbol: 'pDAI',
      logoURI: `${LINKS.app}/icons/pDAI.svg`,
      yieldSourceURI:
        'https://app.aave.com/reserve-overview/?underlyingAsset=0xda10009cbd5d07dd0cecc66161fc93d7c9000da1&marketName=proto_optimism_v3',
      extensions: {
        underlyingAsset: {
          address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
          symbol: 'DAI',
          name: 'Dai Stablecoin'
        }
      }
    },
    ...testnetVaults
  ]
}

export default defaultVaultList
