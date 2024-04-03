import { Accordion } from '@shared/ui'
import { LINKS } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode } from 'react'

interface FaqProps {
  className?: string
}

export const Faq = (props: FaqProps) => {
  const { className } = props

  const faqs: { question: string; answer: ReactNode }[] = [
    {
      question: 'Are there any fees?',
      answer: (
        <span>
          PoolTogether prize vaults take no fees. You can always withdraw underlying tokens 1:1.
          However, when swapping through a decentralized exchange like{' '}
          <FaqLink href='https://uniswap.org/'>Uniswap</FaqLink> or{' '}
          <FaqLink href='https://curve.fi/'>Curve</FaqLink> there may be small fees that go to users
          providing liquidity for those protocols.
        </span>
      )
    },
    {
      question: 'Can I trust these tokens?',
      answer: (
        <span>
          The tokens displayed here are prize vaults built using the ERC-4626 standard, and have
          been <FaqLink href={LINKS.audits}>thoroughly audited</FaqLink>. Their underlying yield
          sources and ERC-4626 wrappers have also had their respective audits.
        </span>
      )
    },
    {
      question: 'How does PoolTogether work?',
      answer: (
        <span>
          When users deposit into the system, the interest accumulates across all deposits and is
          then randomly distributed as prizes. The protocol turns your interest into fun rewards!
          You never lose your principal, and have a chance to win big. This all takes place
          autonomously and permissionlessly. Learn more at{' '}
          <FaqLink href={LINKS.protocolLandingPage}>pooltogether.com</FaqLink>
        </span>
      )
    },
    {
      question: 'Should I swap into these tokens or deposit myself?',
      answer: (
        <span>
          Swapping can be simpler and quicker since you can swap from any token you already hold in
          your wallet. However, if you are swapping in a large amount, the % slippage and fees from
          decentralized exchanges may make it less worthwhile! In that case, it might be better to
          deposit through the <FaqLink href={LINKS.app}>Cabana App</FaqLink>.
        </span>
      )
    }
  ]

  return (
    <div className={classNames('w-full flex flex-col gap-4 items-center', className)}>
      <span className='font-semibold text-5xl text-pt-purple-200'>FAQ</span>
      {faqs.map((faq, i) => (
        <Accordion
          key={`accordion-${i}`}
          items={[
            {
              id: `faq-${i}`,
              title: <span>{faq.question}</span>,
              content: faq.answer
            }
          ]}
          collapseAll={true}
          className='w-full !border-solid border-0 border-b-2 !border-pt-purple-200 rounded-none'
          titleClassName='w-full py-5 text-start text-xl text-pt-purple-50 bg-transparent'
          contentClassName='pt-0 pb-5 text-pt-purple-100 bg-transparent'
        />
      ))}
    </div>
  )
}

interface FaqLinkProps {
  href: string
  children: string
}

const FaqLink = (props: FaqLinkProps) => {
  const { href, children } = props

  return (
    <Link href={href} target='_blank' className='text-pt-purple-50'>
      {children}
    </Link>
  )
}
