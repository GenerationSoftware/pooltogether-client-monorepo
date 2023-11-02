/**
 * Domains
 */
export const DOMAINS = Object.freeze({
  app: 'https://app.cabana.fi',
  app_v4: 'https://app.pooltogether.com',
  landingPage: 'https://cabana.fi',
  protocolLandingPage: 'https://pooltogether.com',
  docs: 'https://docs.cabana.fi',
  protocolDocs: 'https://docs.pooltogether.com',
  protocolDevDocs: 'https://dev.pooltogether.com',
  governance: 'https://gov.pooltogether.com',
  poolExplorer: 'https://poolexplorer.win',
  tools_v4: 'https://tools.pooltogether.com',
  notion: 'https://pooltogetherdao.notion.site',
  vaultListCreator: 'https://lists.cabana.fi',
  vaultFactory: 'https://factory.cabana.fi',
  analytics: 'https://analytics.cabana.fi',
  swaps: 'https://swap.cabana.fi'
})

/**
 * Links
 */
export const LINKS = Object.freeze({
  ...DOMAINS,
  termsOfService: `${DOMAINS.landingPage}/terms`,
  ecosystem: `${DOMAINS.protocolLandingPage}/ecosystem`,
  discord: `${DOMAINS.protocolLandingPage}/discord`,
  appDocs: `${DOMAINS.docs}/#the-cabana-app`,
  toolDocs: `${DOMAINS.docs}/#cabana-tools`,
  protocolBasicsDocs: `${DOMAINS.docs}/protocol/the-basics`,
  prizePowerDocs: `${DOMAINS.docs}/cabana-app/prize-power`,
  factoryDocs: `${DOMAINS.docs}/cabana-tools/cabana-factory`,
  listDocs: `${DOMAINS.docs}/cabana-tools/cabana-lists`,
  analyticsDocs: `${DOMAINS.docs}/cabana-tools/cabanalytics`,
  swapDocs: `${DOMAINS.docs}/cabana-tools/cabana-swaps`,
  appGuides: `${DOMAINS.docs}/cabana-app/guides`,
  toolGuides: `${DOMAINS.docs}/cabana-tools/guides`,
  protocolFaqs: `${DOMAINS.docs}/protocol/faqs`,
  appFaqs: `${DOMAINS.docs}/cabana-app/faqs`,
  toolFaqs: `${DOMAINS.docs}/cabana-tools/faqs`,
  risks: `${DOMAINS.protocolDocs}/security/risks`,
  audits: `${DOMAINS.protocolDocs}/security/audits`,
  devDocs_v4: `${DOMAINS.protocolDevDocs}/protocol/V4/introduction`,
  depositDelegator: `${DOMAINS.tools_v4}/delegate`,
  prizeTierController: `${DOMAINS.tools_v4}/prize-tier-controller`,
  communityCalendar: `${DOMAINS.notion}/Community-Calendar-4ce3024241dd464db96215e6729a78e0`,
  brandKit: `https://www.figma.com/community/file/1212805243917604494`,
  twitter: `https://twitter.com/PoolTogether_`,
  github: `https://github.com/pooltogether`,
  medium: `https://medium.com/pooltogether`,
  tally: `https://www.tally.xyz/gov/pooltogether`,
  treasury: `https://info.pooltogether.com/treasury`,
  dune_v4: `https://dune.com/sarfang/PoolTogetherV4`,
  prizeCalc: `https://prizecalc.com`,
  grants: `https://poolgrants.org`,
  hey: `https://hey.xyz/u/pooltogether`,
  mirror: `https://pooltogether.mirror.xyz/`,
  warpcast: `https://warpcast.com/~/channel/pool-together`,
  clientJs: `https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js`,
  clientJs_v4: `https://www.npmjs.com/package/@pooltogether/v4-client-js`,
  reactHooks: `https://www.npmjs.com/package/@generationsoftware/hyperstructure-react-hooks`
})
