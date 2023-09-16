import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { selectedDrawIdAtom } from 'src/atoms'
import { useRngTxs } from '@hooks/useRngTxs'

interface DrawSelectorProps {
  prizePool: PrizePool
  className?: string
}

export const DrawSelector = (props: DrawSelectorProps) => {
  const { prizePool, className } = props

  const [drawIdSelected, setDrawIdSelected] = useAtom(selectedDrawIdAtom)

  const { data: rngTxs } = useRngTxs(prizePool)
  const drawIds = rngTxs?.filter((txs) => !!txs.relay).map((txs) => txs.rng.drawId) ?? []

  useEffect(() => {
    if (drawIds.length > 0 && !drawIdSelected) {
      setDrawIdSelected(drawIds[drawIds.length - 1])
    }
  }, [drawIds])

  const firstDrawId = drawIds[0]
  const lastDrawId = drawIds[drawIds.length - 1]

  const clickableClassName = 'cursor-pointer select-none'

  if (!drawIdSelected) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <div className={classNames('flex gap-2 items-center text-xl text-pt-purple-500', className)}>
      <span
        onClick={() => setDrawIdSelected(drawIdSelected - 1)}
        className={classNames(clickableClassName, { hidden: drawIdSelected === firstDrawId })}
      >
        &lt;&lt;
      </span>
      {drawIds
        .filter((id) => id >= drawIdSelected - 4 && id <= drawIdSelected + 4)
        .map((id) => (
          <span
            key={`drawIdSelector-${id}`}
            onClick={() => setDrawIdSelected(id)}
            className={classNames(clickableClassName, { 'font-semibold': drawIdSelected === id })}
          >
            {id}
          </span>
        ))}
      <span
        onClick={() => setDrawIdSelected(drawIdSelected + 1)}
        className={classNames(clickableClassName, { hidden: drawIdSelected === lastDrawId })}
      >
        &gt;&gt;
      </span>
    </div>
  )
}
