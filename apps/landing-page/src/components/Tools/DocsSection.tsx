import { LINKS } from '@shared/utilities'
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
      <Link href={LINKS.toolDocs} target='_blank' className='w-full max-w-sm'>
        <div className='flex flex-col gap-2 items-center px-4 py-10 bg-pt-purple-500 rounded-lg shadow-lg outline outline-2 outline-transparent hover:outline-pt-purple-200 md:px-20'>
          <Image src='/docsIcon-inverted.svg' alt='Docs' width={96} height={96} />
          <span className='text-3xl font-medium text-pt-purple-100 whitespace-nowrap'>
            Cabana Tools Docs
          </span>
        </div>
      </Link>
    </section>
  )
}
