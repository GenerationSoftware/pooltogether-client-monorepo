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
  vaultFactory: 'https://factory.cabana.fi'
})

/**
 * Links
 */
export const LINKS = Object.freeze({
  ...DOMAINS,
  termsOfService: `${DOMAINS.protocolLandingPage}/terms`, // TODO: update to cabana ToS once available
  protocolDisclaimer: `${DOMAINS.protocolLandingPage}/protocol-disclaimer`, // TODO: update to cabana disclaimer once available
  ecosystem: `${DOMAINS.protocolLandingPage}/ecosystem`,
  discord: `${DOMAINS.protocolLandingPage}/discord`,
  toolDocs: `${DOMAINS.docs}/`, // TODO: update to tools section once available
  factoryDocs: `${DOMAINS.docs}/`, // TODO: update to factory docs page once available
  listDocs: `${DOMAINS.docs}/`, // TODO: update to list docs page once available
  faq: `${DOMAINS.protocolDocs}/welcome/faq`, // TODO: update to cabana docs FAQ page once available
  tutorials: `${DOMAINS.docs}/`, // TODO: update to tutorials section on docs once available
  audits: `${DOMAINS.protocolDocs}/security/audits`, // TODO: update to cabana docs audits page once available
  devDocs_v5: `${DOMAINS.protocolDevDocs}/protocol/next/introduction`,
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
  lens: `https://lenster.xyz/u/pooltogether`,
  mirror: `https://pooltogether.mirror.xyz/`,
  clientJs: `https://www.npmjs.com/package/@pooltogether/hyperstructure-client-js`,
  clientJs_v4: `https://www.npmjs.com/package/@pooltogether/v4-client-js`,
  reactHooks: `https://www.npmjs.com/package/@pooltogether/hyperstructure-react-hooks`
})
