import { useTranslations } from 'next-intl'

export const VaultsHeader = () => {
  const t = useTranslations('Vaults')

  return (
    <div className='text-[1.75rem] font-grotesk font-bold md:text-4xl lg:text-5xl'>
      {t.rich('depositAndWin', {
        highlight: (chunks) => <span className='text-pt-teal'>{chunks}</span>
      })}
    </div>
  )
}
