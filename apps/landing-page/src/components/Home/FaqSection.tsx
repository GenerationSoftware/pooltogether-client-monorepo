import { Accordion, LINKS } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

interface FaqSectionProps {
  className?: string
}

export const FaqSection = (props: FaqSectionProps) => {
  const { className } = props

  const faqs: { question: string; answer: ReactNode }[] = [
    {
      question: 'What is PoolTogether?',
      answer: (
        <span>
          PoolTogether is an open source protocol that promotes financial security by making it fun
          to save. Users deposit into the protocol, yield accrues on all deposits, and is randomly
          awarded as prizes to the users. The protocol turns your interest into fun prizes! You
          never lose your principal, and have a chance to win big. Learn more at{' '}
          <FaqLink href={LINKS.protocolLandingPage}>pooltogether.com</FaqLink>
        </span>
      )
    },
    {
      question: 'What is Cabana?',
      answer: (
        <span>
          Cabana is a series of open source tools for interacting with PoolTogether V5.{' '}
          <FaqLink href={LINKS.app}>app.cabana.fi</FaqLink> allows users to deposit and withdraw
          from the protocol. <FaqLink href={LINKS.vaultFactory}>factory.cabana.fi</FaqLink> allows
          users to deploy their own prize vaults using any ERC-4626 compatible yield source.{' '}
          <FaqLink href={LINKS.vaultListCreator}>lists.cabana.fi</FaqLink> makes it easy for users
          to create their own lists of prize vaults that can be accessed via the main app.
        </span>
      )
    }
  ]

  return (
    <section className={classNames('w-full flex flex-col gap-1 items-center', className)}>
      <span className='text-xl font-bold md:text-3xl'>Frequently Asked Questions</span>
      <Accordion
        items={faqs.map((faq, i) => ({
          id: `faq-${i}`,
          title: <span className='text-pt-purple-50'>{faq.question}</span>,
          content: faq.answer
        }))}
        className='w-full'
        titleClassName='w-full !justify-center mt-11 text-xl !font-bold text-pt-purple-300 bg-transparent'
        contentClassName='text-center text-xl text-pt-purple-100 bg-transparent'
      />
    </section>
  )
}

interface FaqLinkProps {
  href: string
  children: string
}

const FaqLink = (props: FaqLinkProps) => {
  const { href, children } = props

  return (
    <a href={href} target='_blank' className='text-pt-purple-50'>
      {children}
    </a>
  )
}
