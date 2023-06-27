import { load } from 'fathom-client'
import { useEffect } from 'react'

/**
 * Optimally paired with a next.js Router
 * @param fathomSiteId ID from Fathom Analytics dashboard
 * @param addRouteChangeListener router.events?.on
 * @param removeRouteChangeListener router.events?.off
 */
export const useFathom = (
  fathomSiteId: string,
  siteDomains: string[],
  addRouteChangeListener: (id: string, method: () => void) => void,
  removeRouteChangeListener: (id: string, method: () => void) => void
) => {
  useEffect(() => {
    if (fathomSiteId && !!addRouteChangeListener && !!removeRouteChangeListener) {
      load(fathomSiteId, {
        url: 'https://goose.pooltogether.com/script.js',
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
