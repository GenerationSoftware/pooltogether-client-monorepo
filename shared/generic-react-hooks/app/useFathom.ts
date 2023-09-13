import { load } from 'fathom-client'
import { useEffect } from 'react'

type FathomEventId =
  | 'routeChangeStart'
  | 'beforeHistoryChange'
  | 'routeChangeComplete'
  | 'routeChangeError'
  | 'hashChangeStart'
  | 'hashChangeComplete'

/**
 * Optimally paired with a next.js Router
 * @param fathomSiteId ID from Fathom Analytics dashboard
 * @param sideDomains domains to include stats for
 * @param addRouteChangeListener router.events?.on
 * @param removeRouteChangeListener router.events?.off
 */
export const useFathom = (
  fathomSiteId: string,
  siteDomains: string[],
  addRouteChangeListener: (id: FathomEventId, method: () => void) => void,
  removeRouteChangeListener: (id: FathomEventId, method: () => void) => void
) => {
  useEffect(() => {
    if (fathomSiteId && !!addRouteChangeListener && !!removeRouteChangeListener) {
      load(fathomSiteId, {
        url: 'https://cdn.usefathom.com/script.js',
        includedDomains: siteDomains
      })
      const onRouteChangeComplete = () => {
        if (window['fathom']) {
          window['fathom'].trackPageview()
        }
      }
      addRouteChangeListener('routeChangeComplete', onRouteChangeComplete)
      return () => {
        removeRouteChangeListener('routeChangeComplete', onRouteChangeComplete)
      }
    }
  }, [])
}
