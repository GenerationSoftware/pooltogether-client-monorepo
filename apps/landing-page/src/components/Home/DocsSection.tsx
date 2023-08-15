import { LINKS } from '@shared/ui'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

interface DocsSectionProps {
  className?: string
}

export const DocsSection = (props: DocsSectionProps) => {
  const { className } = props

  return (
    <section className={classNames('w-full flex flex-col gap-6 items-center', className)}>
      <span className='text-3xl font-bold'>Read The Docs</span>
      <Link href={LINKS.docs} target='_blank'>
        <div className='flex flex-col gap-2 items-center px-20 py-10 bg-pt-purple-300 rounded-lg shadow-lg outline outline-2 outline-transparent hover:outline-pt-purple-700'>
          <Image src='/docsIcon.svg' alt='Docs' width={96} height={96} />
          <span className='text-3xl font-bold text-pt-purple-600'>Cabana Docs</span>
        </div>
      </Link>
    </section>
  )
}
