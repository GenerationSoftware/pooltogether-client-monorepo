import classNames from 'classnames'
import { ReactNode } from 'react'

interface FaqSectionProps {
  className?: string
}

export const FaqSection = (props: FaqSectionProps) => {
  const { className } = props

  const faqs: { question: string; answer: ReactNode }[] = [
    {
      question: 'Why should I migrate to PoolTogether V5?',
      answer: (
        <span>
          If you are still using versions 3 or 4 of the PoolTogether protocol, version 5 can offer
          you more possibilities for assets to deposit, chance to win bigger prizes, more networks
          to deposit in, a better experience swapping between prize assets, prizes being
          automatically sent to your wallet, and more.
        </span>
      )
    },
    {
      question: 'Can I still win prizes on V3 or V4?',
      answer: (
        <span>
          Both V3 and V4 prize pools have not had active draws for some time, and some of it's
          leftover yield has been directed to grow prizes in V5. This means any prizes being awarded
          in older versions is very unlikely if not impossible.
        </span>
      )
    },
    {
      question: 'What happens if I forget my unclaimed rewards?',
      answer: (
        <span>
          Some rewards can be retrieved by whomever deployed them after a long time (usually many
          months), meaning you won't be able to claim them after such time. We will display any
          claimable rewards for PoolTogether V3 or V4 above!
        </span>
      )
    }
  ]

  return (
    <section className={classNames('w-full flex flex-col gap-10 items-center', className)}>
      <span className='text-xl font-averta font-bold md:text-3xl'>Frequently Asked Questions</span>
      <div className='flex flex-col gap-10'>
        {faqs.map((faq, i) => (
          <div key={`faq-${i}`} className='w-full flex flex-col gap-3 md:items-center'>
            <span className='font-averta font-bold text-xl'>{faq.question}</span>
            <span className='text-pt-purple-100 md:max-w-[75%] md:text-center'>{faq.answer}</span>
          </div>
        ))}
      </div>
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
    <a href={href} target='_blank' className='text-pt-purple-50 underline'>
      {children}
    </a>
  )
}
