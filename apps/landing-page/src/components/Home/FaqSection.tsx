import { Accordion } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

// TODO: write all faqs
const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: 'What is PoolTogether?',
    answer:
      'PoolTogether is an open source protocol that promotes financial security by making it fun to save. Users deposit into the protocol, yield accrues on all deposits, and is randomly awarded as prizes to the users. The protocol turns your interest into fun prizes! You never lose your principal, and have a chance to win big.'
  },
  { question: 'What is Cabana?', answer: '...' }
]

interface FaqSectionProps {
  className?: string
}

export const FaqSection = (props: FaqSectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-1 items-center', className)}>
      <span className='text-3xl font-bold'>Frequently Asked Questions</span>
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
