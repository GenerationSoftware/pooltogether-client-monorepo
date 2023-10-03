import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Custom404Page() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [])

  return null
}
