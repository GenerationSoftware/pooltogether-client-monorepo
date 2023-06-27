/**
 * Domains
 */
export const DOMAINS = Object.freeze({
  app: 'https://mvp-pt-app.netlify.app',
  landingPage: 'https://mvp-pt-landing-page.netlify.app',
  app_v4: 'https://app.pooltogether.com',
  landingPage_v4: 'https://pooltogether.com',
  docs: 'https://docs.pooltogether.com',
  docs_v4: 'https://docs.pooltogether.com',
  devDocs: 'https://dev.pooltogether.com',
  devDocs_v4: 'https://dev.pooltogether.com',
  governance: 'https://gov.pooltogether.com',
  poolExplorer: 'https://poolexplorer.win',
  tools: 'https://tools.pooltogether.com',
  notion: 'https://pooltogetherdao.notion.site'
})

/**
 * Links
 */
export const LINKS = Object.freeze({
  ...DOMAINS,
  termsOfService: `${DOMAINS.app}/terms`,
  protocolDisclaimer: `${DOMAINS.app}/protocol-disclaimer`,
  ecosystem: `${DOMAINS.landingPage}/ecosystem`,
  brandKit: `${DOMAINS.landingPage_v4}/brand-assets`, // TODO: link to specific assets instead of one page
  gettingStarted: `${DOMAINS.docs}/welcome/getting-started`,
  faq: `${DOMAINS.docs}/welcome/faq`,
  guides: `${DOMAINS.docs}/pooltogether/guides`,
  audits: `${DOMAINS.docs}/security/audits`,
  depositDelegator: `${DOMAINS.tools}/delegate`,
  prizeTierController: `${DOMAINS.tools}/prize-tier-controller`,
  communityCalendar: `${DOMAINS.notion}/Community-Calendar-4ce3024241dd464db96215e6729a78e0`,
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
