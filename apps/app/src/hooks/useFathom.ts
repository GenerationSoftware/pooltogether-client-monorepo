import * as fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { APP_URL } from '@constants/config'

export const useFathom = () => {
  const router = useRouter()

  useEffect(() => {
    const fathomSiteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID
    const fathomSiteDomain = APP_URL.split('://')[1]

    const onRouteChangeComplete = () => {
      fathom.trackPageview()
    }

    if (!!fathomSiteId) {
      fathom.load(fathomSiteId, { includedDomains: [fathomSiteDomain] })

      router.events.on('routeChangeComplete', onRouteChangeComplete)

      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete)
      }
    }
  }, [])
}
