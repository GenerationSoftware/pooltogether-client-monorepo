import { MODAL_KEYS, useIsModalOpen, useIsTestnets } from '@shared/generic-react-hooks'
import { SocialIcon } from '@shared/ui'
import { LINKS } from '@shared/utilities'
import classNames from 'classnames'
import { Footer as FlowbiteFooter } from 'flowbite-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useSettingsModalView } from '@hooks/useSettingsModalView'

interface FooterItem {
  title: string
  content: FooterItemContentProps[]
  className?: string
  titleClassName?: string
  itemClassName?: string
}

export const Footer = () => {
  const router = useRouter()

  const t_settings = useTranslations('Settings')
  const t_footer = useTranslations('Footer')

  const { isTestnets, setIsTestnets } = useIsTestnets()

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)
  const { setView: setSettingsModalView } = useSettingsModalView()

  const { setIsModalOpen: setIsCaptchaModalOpen } = useIsModalOpen(MODAL_KEYS.captcha)

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  const footerItems: FooterItem[] = [
    {
      title: t_footer('titles.getHelp'),
      content: [
        { content: t_footer('userDocs'), href: LINKS.docs },
        { content: t_footer('devDocs'), href: LINKS.protocolDevDocs }
      ]
    },
    {
      title: t_footer('titles.ecosystem'),
      content: [
        { content: t_footer('extensions'), href: LINKS.ecosystem },
        { content: t_footer('governance'), href: LINKS.governance },
        { content: t_footer('security'), href: LINKS.audits }
      ]
    },
    {
      title: t_footer('titles.community'),
      content: [
        {
          content: 'Twitter',
          href: LINKS.twitter,
          icon: <SocialIcon platform='twitter' className='w-6 h-auto shrink-0' />
        },
        {
          content: 'Discord',
          onClick: () => setIsCaptchaModalOpen(true),
          icon: <SocialIcon platform='discord' className='w-6 h-auto shrink-0' />
        },
        {
          content: 'GitHub',
          href: LINKS.github,
          icon: <SocialIcon platform='github' className='w-6 h-auto shrink-0' />
        },
        {
          content: 'Medium',
          href: LINKS.medium,
          icon: <SocialIcon platform='medium' className='w-6 h-auto shrink-0' />
        }
      ]
    },
    {
      title: t_footer('titles.settings'),
      content: [
        {
          content: t_settings('changeCurrency'),
          onClick: () => {
            setSettingsModalView('currency')
            setIsSettingsModalOpen(true)
          }
        },
        {
          content: t_settings('changeLanguage'),
          onClick: () => {
            setSettingsModalView('language')
            setIsSettingsModalOpen(true)
          }
        }
      ]
    }
  ]

  if (isBrowser) {
    footerItems[footerItems.length - 1].content.push({
      content: isTestnets ? t_footer('disableTestnets') : t_footer('enableTestnets'),
      onClick: () => {
        setIsTestnets(!isTestnets)
        router.reload()
      }
    })
  }

  return (
    <FlowbiteFooter
      theme={{
        root: {
          base: 'w-full flex flex-col gap-20 items-center px-12 pt-12 pb-24 shadow z-40 md:px-16 md:pb-12'
        }
      }}
      className='bg-pt-purple-600'
    >
      <div className='w-full max-w-6xl flex justify-between gap-16 text-sm flex-wrap md:text-base'>
        {footerItems.map((item) => {
          return (
            <div
              key={`ft-${item.title.toLowerCase().replaceAll(' ', '-')}`}
              className={classNames('w-24 grow', item.className)}
            >
              <FlowbiteFooter.Title
                theme={{ base: 'mb-6' }}
                title={item.title}
                className={classNames('text-pt-teal-dark', item.titleClassName)}
              />
              <FlowbiteFooter.LinkGroup theme={{ base: 'flex flex-col gap-6 text-pt-purple-100' }}>
                {item.content.map((content, i) => {
                  return (
                    <FooterItemContent
                      key={`ft-item-${item.title.toLowerCase().replaceAll(' ', '-')}-${i}`}
                      {...content}
                      className={item.itemClassName}
                    />
                  )
                })}
              </FlowbiteFooter.LinkGroup>
            </div>
          )
        })}
      </div>
      <div className='flex flex-col gap-1 items-center text-center text-sm text-pt-purple-100'>
        <a href={LINKS.termsOfService} target='_blank' className='hover:underline'>
          {t_footer('termsAndConditions')}
        </a>
        <a href={LINKS.privacyPolicy} target='_blank' className='hover:underline'>
          {t_footer('privacyPolicy')}
        </a>
      </div>
    </FlowbiteFooter>
  )
}

interface FooterItemContentProps {
  content: ReactNode
  href?: string
  icon?: JSX.Element
  onClick?: () => void
  disabled?: boolean
}

const FooterItemContent = (props: FooterItemContentProps & { className?: string }) => {
  const { content, href, icon, onClick, disabled, className } = props

  const baseClassName = 'flex items-center gap-2 whitespace-nowrap'

  if (disabled) {
    return (
      <span className={classNames(baseClassName, 'text-pt-purple-300', className)}>
        {icon}
        {content}
      </span>
    )
  }

  if (!!href) {
    return (
      <FlowbiteFooter.Link theme={{ base: '' }} href={href} className={classNames(className)}>
        <span className={classNames(baseClassName)}>
          {icon}
          {content}
        </span>
      </FlowbiteFooter.Link>
    )
  }

  return (
    <span
      className={classNames(
        baseClassName,
        { 'cursor-pointer hover:underline': onClick !== undefined },
        className
      )}
      onClick={onClick}
    >
      {icon}
      {content}
    </span>
  )
}
