import {
  DOLPHIN_ADDRESS,
  LINKS,
  NETWORK,
  POOL_TOKEN_ADDRESSES,
  USDC_TOKEN_ADDRESSES
} from '@shared/utilities'

/**
 * Token Logo URLs
 */
const tokenLogoUrls = {
  eth: `${LINKS.app}/icons/ether.svg`,
  pool: 'https://assets.coingecko.com/coins/images/14003/standard/PoolTogether.png',
  usdc: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png',
  dai: 'https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png',
  gusd: 'https://assets.coingecko.com/coins/images/5992/standard/gemini-dollar-gusd.png',
  weth: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png',
  wbtc: 'https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png',
  lusd: 'https://assets.coingecko.com/coins/images/14666/standard/Group_3.png',
  op: 'https://optimistic.etherscan.io/token/images/optimism_32.png',
  steth: 'https://assets.coingecko.com/coins/images/13442/standard/steth_logo.png',
  usdt: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  usda: 'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/src/assets/tokens/stUSD.svg',
  eura: 'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/src/assets/tokens/stEUR.svg',
  crash: 'https://assets.coingecko.com/coins/images/37152/standard/apCdaaX9_400x400.jpg',
  degen: 'https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png',
  dude: 'https://assets.coingecko.com/coins/images/36860/standard/dudelogo.png',
  higher: 'https://assets.coingecko.com/coins/images/36084/standard/200x200logo.png',
  well: 'https://assets.coingecko.com/coins/images/26133/standard/WELL.png',
  bifi: 'https://assets.coingecko.com/coins/images/12704/standard/bifi.png',
  mooBIFI:
    'https://assets.coingecko.com/coins/images/32597/standard/319381e63428d3c2ab6e035d5f3abd76.png',
  reth: 'https://assets.coingecko.com/coins/images/20764/standard/reth.png',
  snx: 'https://assets.coingecko.com/coins/images/3406/standard/SNX.png',
  crv: 'https://assets.coingecko.com/coins/images/12124/standard/Curve.png',
  based: 'https://basescan.org/token/images/basedtoken_32.png',
  uni: 'https://assets.coingecko.com/coins/images/12504/standard/uniswap-logo.png',
  ldo: 'https://assets.coingecko.com/coins/images/13573/standard/Lido_DAO.png',
  aero: 'https://assets.coingecko.com/coins/images/31745/standard/token.png',
  cbeth: 'https://assets.coingecko.com/coins/images/27008/standard/cbeth.png',
  xdai: 'https://gnosisscan.io/token/images/wrappedxdai_32.png'
} as const

/**
 * Token Logo Overrides
 */
export const TOKEN_LOGO_OVERRIDES: Record<NETWORK, { [address: Lowercase<string>]: string }> = {
  [NETWORK.mainnet]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    [POOL_TOKEN_ADDRESSES[NETWORK.mainnet].toLowerCase()]: tokenLogoUrls.pool,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': tokenLogoUrls.usdc,
    '0x6b175474e89094c44da98b954eedeac495271d0f': tokenLogoUrls.dai,
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': tokenLogoUrls.gusd,
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': tokenLogoUrls.weth,
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': tokenLogoUrls.wbtc,
    '0x5f98805a4e8be255a32880fdec7f6728c6568ba0': tokenLogoUrls.lusd,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8': tokenLogoUrls.eura,
    '0xb1f1ee126e9c96231cc3d3fad7c08b4cf873b1f1': tokenLogoUrls.bifi,
    '0xae78736cd615f374d3085123a210448e74fc6393': tokenLogoUrls.reth,
    '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': tokenLogoUrls.snx,
    '0xd533a949740bb3306d119cc777fa900ba034cd52': tokenLogoUrls.crv,
    '0xdac17f958d2ee523a2206206994597c13d831ec7': tokenLogoUrls.usdt,
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': tokenLogoUrls.uni,
    '0x5a98fcbea516cf06857215779fd812ca3bef1b32': tokenLogoUrls.ldo
  },
  [NETWORK.sepolia]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth
  },
  [NETWORK.bsc]: {},
  [NETWORK.bsc_testnet]: {},
  [NETWORK.polygon]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.polygon].toLowerCase()]: tokenLogoUrls.pool,
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': tokenLogoUrls.usdc,
    '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359': tokenLogoUrls.usdc,
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': tokenLogoUrls.dai,
    '0xc8a94a3d3d2dabc3c1caffffdca6a7543c3e3e65': tokenLogoUrls.gusd,
    '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': tokenLogoUrls.weth,
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6': tokenLogoUrls.wbtc,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0xe0b52e49357fd4daf2c15e02058dce6bc0057db4': tokenLogoUrls.eura
  },
  [NETWORK.mumbai]: {},
  [NETWORK.optimism]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    [POOL_TOKEN_ADDRESSES[NETWORK.optimism].toLowerCase()]: tokenLogoUrls.pool,
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': tokenLogoUrls.usdc,
    '0x0b2c639c533813f4aa9d7837caf62653d097ff85': tokenLogoUrls.usdc,
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': tokenLogoUrls.dai,
    '0x4200000000000000000000000000000000000006': tokenLogoUrls.weth,
    '0x68f180fcce6836688e9084f035309e29bf0a2095': tokenLogoUrls.wbtc,
    '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819': tokenLogoUrls.lusd,
    '0x4200000000000000000000000000000000000042': tokenLogoUrls.op,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0x9485aca5bbbe1667ad97c7fe7c4531a624c8b1ed': tokenLogoUrls.eura,
    '0x1f32b1c2345538c0c6f582fcb022739c4a194ebb': tokenLogoUrls.steth,
    '0xc55e93c62874d8100dbd2dfe307edc1036ad5434': tokenLogoUrls.mooBIFI,
    '0x9bcef72be871e61ed4fbbc7630889bee758eb81d': tokenLogoUrls.reth,
    '0x67cde7af920682a29fcfea1a179ef0f30f48df3e': tokenLogoUrls.reth,
    '0x8700daec35af8ff88c16bdf0418774cb3d7599b4': tokenLogoUrls.snx,
    '0x0994206dfe8de6ec6920ff4d779b0d950605fb53': tokenLogoUrls.crv
  },
  [NETWORK.optimism_sepolia]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    [POOL_TOKEN_ADDRESSES[NETWORK.optimism_sepolia].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.optimism_sepolia]]: tokenLogoUrls.usdc,
    '0xef38f21ec5477f6e3d4b7e9f0dea44a788c669b0': tokenLogoUrls.dai,
    '0x68f92539f64e486f2853bb2892933a21b54829e5': tokenLogoUrls.gusd,
    '0x4a61b6f54157840e80e0c47f1a628c0b3744a739': tokenLogoUrls.weth,
    '0x6c6a62b0861d8f2b946456ba9dcd0f3baec54147': tokenLogoUrls.wbtc
  },
  [NETWORK.avalanche]: {
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': tokenLogoUrls.wbtc
  },
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK.celo_testnet]: {},
  [NETWORK.arbitrum]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    [POOL_TOKEN_ADDRESSES[NETWORK.arbitrum].toLowerCase()]: tokenLogoUrls.pool,
    '0xaf88d065e77c8cc2239327c5edb3a432268e5831': tokenLogoUrls.usdc,
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': tokenLogoUrls.usdc,
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': tokenLogoUrls.weth,
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': tokenLogoUrls.usdt,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0xfa5ed56a203466cbbc2430a43c66b9d8723528e7': tokenLogoUrls.eura,
    '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978': tokenLogoUrls.crv
  },
  [NETWORK.arbitrum_sepolia]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    [POOL_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia]]: tokenLogoUrls.usdc,
    '0xfe045beefda06606fc5f441ccca2fe8c903e9725': tokenLogoUrls.dai,
    '0x060fad1bca90e5b1efca0d93febec96e638fd8a6': tokenLogoUrls.weth
  },
  [NETWORK.base]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    [POOL_TOKEN_ADDRESSES[NETWORK.base].toLowerCase()]: tokenLogoUrls.pool,
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': tokenLogoUrls.usdc,
    '0x50c5725949a6f0c72e6c4a641f24049a917db0cb': tokenLogoUrls.dai,
    '0x4200000000000000000000000000000000000006': tokenLogoUrls.weth,
    '0x368181499736d0c0cc614dbb145e2ec1ac86b8c6': tokenLogoUrls.lusd,
    '0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452': tokenLogoUrls.steth,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0xa61beb4a3d02decb01039e378237032b351125b4': tokenLogoUrls.eura,
    '0x621e87af48115122cd96209f820fe0445c2ea90e': tokenLogoUrls.crash,
    '0x4ed4e862860bed51a9570b96d89af5e1b0efefed': tokenLogoUrls.degen,
    '0xcb2861a1ec1d0392afb9e342d5aa539e4f75b633': tokenLogoUrls.dude,
    '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe': tokenLogoUrls.higher,
    '0xa88594d404727625a9437c3f886c7643872296ae': tokenLogoUrls.well,
    '0x940181a94a35a4569e4529a3cdfb74e38fd98631': tokenLogoUrls.aero,
    '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22': tokenLogoUrls.cbeth
  },
  [NETWORK.base_sepolia]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    [POOL_TOKEN_ADDRESSES[NETWORK.base_sepolia].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.base_sepolia]]: tokenLogoUrls.usdc,
    '0xe4b4a71923aecb4b8924bda8c31941a8ab50ff86': tokenLogoUrls.dai,
    '0x019aa44d02715e4042b1ba3b4d2fa9bcef33c002': tokenLogoUrls.weth
  },
  [NETWORK.scroll]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    '0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4': tokenLogoUrls.usdc,
    '0x5300000000000000000000000000000000000004': tokenLogoUrls.weth,
    '0xca77eb3fefe3725dc33bccb54edefc3d9f764f97': tokenLogoUrls.dai
  },
  [NETWORK.scroll_sepolia]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.eth,
    [POOL_TOKEN_ADDRESSES[NETWORK.scroll_sepolia].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.scroll_sepolia]]: tokenLogoUrls.usdc,
    '0xc024e95cf6bb2efc424c9035db4647a12d8dcac9': tokenLogoUrls.dai,
    '0x23dbacc4e588fadc2d3eed3d1eddb8daa57714ba': tokenLogoUrls.gusd,
    '0x6b0877bcb4720f094bc13187f5e16bdbf730693a': tokenLogoUrls.weth,
    '0xa15316214d52d907712d751987d4593972cf3b8b': tokenLogoUrls.wbtc
  },
  [NETWORK.gnosis]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.xdai,
    '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83': tokenLogoUrls.usdc,
    '0x2a22f9c3b484c3629090feed35f17ff8f88f76f0': tokenLogoUrls.usdc,
    '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1': tokenLogoUrls.weth,
    '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d': tokenLogoUrls.xdai
  },
  [NETWORK.gnosis_chiado]: {
    [DOLPHIN_ADDRESS]: tokenLogoUrls.dai,
    [POOL_TOKEN_ADDRESSES[NETWORK.gnosis_chiado].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.gnosis_chiado]]: tokenLogoUrls.usdc,
    '0xb2d0d7ad1d4b2915390dc7053b9421f735a723e7': tokenLogoUrls.dai,
    '0xbe9a62939f82e12f4a48912078a4420f1a5fc2e0': tokenLogoUrls.gusd,
    '0x6b629bb304017d3d985d140599d8e6fc9942b9a7': tokenLogoUrls.weth,
    '0x3e9c64afc24c551cc8e11f52fedecdacf7362559': tokenLogoUrls.wbtc
  }
}

/**
 * TX Gas Amount Estimates
 */
export const TX_GAS_ESTIMATES = {
  approve: 50_000n,
  deposit: 400_000n,
  depositWithPermit: 450_000n,
  depositWithZap: 1_000_000n,
  withdraw: 350_000n,
  withdrawWithZap: 900_000n,
  delegate: 120_000n
} as const
