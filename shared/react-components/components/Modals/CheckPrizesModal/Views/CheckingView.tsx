interface CheckingViewProps {}

export const CheckingView = (props: CheckingViewProps) => {
  const {} = props

  return (
    <div className='flex flex-col gap-12 items-center mb-6'>
      <span className='text-xl font-medium text-pt-purple-100'>Checking the blockchain...</span>
      <img
        src='/checkingPrizesSpinner.gif'
        alt='Checking Prizes Animation'
        className='w-72 h-auto'
      />
    </div>
  )
}
