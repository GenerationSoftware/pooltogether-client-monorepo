import { LINKS, SocialIcon, SocialIconProps } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface FooterProps {
  className?: string
}

export const Footer = (props: FooterProps) => {
  const { className } = props

  return (
    <footer className={classNames('flex flex-col mt-auto pb-24 z-20 md:pb-12', className)}>
      <FooterWave />
      <div className='w-full flex flex-col gap-12 items-center justify-between px-16 bg-pt-purple-700 md:flex-row'>
        <div className='flex flex-col gap-12 px-4 md:flex-row md:px-0'>
          <MadeBy />
          <AuditsBy />
        </div>
        <div className='flex flex-col gap-12 items-center order-first md:flex-row md:gap-6 md:items-end md:order-none'>
          <SocialIcons />
          <Link href={LINKS.protocolLandingPage} target='_blank'>
            <PoweredByPT />
          </Link>
        </div>
      </div>
      <Link href='/terms' className='mx-auto mt-20 text-sm text-pt-purple-100 hover:underline'>
        Terms and Conditions
      </Link>
    </footer>
  )
}

const FooterWave = () => {
  const router = useRouter()

  return (
    <div
      className={classNames('w-full flex flex-col bg-pt-purple-600 isolate pointer-events-none', {
        'bg-pt-purple-700': router.pathname !== '/'
      })}
    >
      <Image
        src='/footerWave.svg'
        alt='Footer Wave'
        width={1440}
        height={260}
        priority={true}
        className='w-full drop-shadow-[0_-10px_10px_#8050E3] md:drop-shadow-[0_-20px_20px_#8050E3]'
      />
      <span className='w-full h-24 -mt-[1px] bg-pt-purple-700 z-10' />
    </div>
  )
}

const MadeBy = () => {
  return (
    <div className='flex flex-col gap-3'>
      <span className='text-center text-pt-purple-300 md:text-start'>Cabana made by</span>
      <a href='https://g9software.xyz' target='_blank' className='opacity-50'>
        <Image src='/generationLogo.svg' alt='Generation Software' width={261} height={38} />
      </a>
    </div>
  )
}

const AuditsBy = () => {
  return (
    <div className='flex flex-col gap-3'>
      <span className='text-center text-pt-purple-300 md:text-start'>PoolTogether audits by</span>
      <div className='flex flex-col gap-6 items-center opacity-50 md:flex-row'>
        {/* TODO: add link to c4 audit(s) */}
        <Link href={LINKS.audits} target='_blank'>
          <Image src='/c4Logo.svg' alt='Code Arena' width={257} height={46} />
        </Link>
        {/* TODO: add link to macro audit(s) */}
        <Link href={LINKS.audits} target='_blank'>
          <Image src='/macroLogo.svg' alt='Macro' width={191} height={40} />
        </Link>
      </div>
    </div>
  )
}

const SocialIcons = () => {
  return (
    <div className='flex gap-4 items-center order-last md:order-none'>
      <SimpleSocialIcon platform='twitter' href={LINKS.twitter} />
      <SimpleSocialIcon platform='discord' href={LINKS.discord} />
    </div>
  )
}

interface SimpleSocialIconProps extends SocialIconProps {
  href: string
}

const SimpleSocialIcon = (props: SimpleSocialIconProps) => {
  const { platform, href, className } = props

  return (
    <a
      href={href}
      target='_blank'
      className={classNames(
        'w-12 h-12 flex items-center justify-center rounded-full bg-pt-purple-600',
        'hover:bg-pt-purple-500',
        className
      )}
    >
      <SocialIcon platform={platform} className='w-6 h-auto text-pt-purple-100' />
    </a>
  )
}

const PoweredByPT = () => {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-center text-pt-purple-300 whitespace-nowrap md:text-start'>
        Powered by
      </span>
      <Image src='/ptLogo.svg' alt='PoolTogether' width={183} height={72} className='w-32 h-auto' />
    </div>
  )
}
