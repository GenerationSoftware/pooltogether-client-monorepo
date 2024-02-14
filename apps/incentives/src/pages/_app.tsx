import type { AppProps } from 'next/app'
import { AppContainer } from '@components/AppContainer'
import '../styles/globals.css'

export default function MyApp(props: AppProps) {
  return <AppContainer {...props} />
}
