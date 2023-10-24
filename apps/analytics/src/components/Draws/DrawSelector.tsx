import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useDrawIds } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { ReactNode, useEffect, useMemo } from 'react'
import { selectedDrawIdAtom } from 'src/atoms'

interface DrawSelectorProps {
  prizePool: PrizePool
  className?: string
}

export const DrawSelector = (props: DrawSelectorProps) => {
  const { prizePool, className } = props

  const { data: drawIds } = useDrawIds(prizePool)
  const firstDrawId = drawIds[0]
  const lastDrawId = !!drawIds.length ? drawIds[drawIds.length - 1] : undefined

  const [drawIdSelected, setDrawIdSelected] = useAtom(selectedDrawIdAtom)

  useEffect(() => {
    if (!!lastDrawId && !drawIdSelected) {
      setDrawIdSelected(lastDrawId)
    }
  }, [lastDrawId])

  const drawIdArray = useMemo(() => {
    return !!drawIdSelected ? getDrawIdsArray(drawIdSelected, drawIds) : Array(7).fill(0)
  }, [drawIdSelected, drawIds])

  if (!drawIdSelected || !firstDrawId || !lastDrawId) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <div className={classNames('flex gap-2 items-center text-xl text-pt-purple-500', className)}>
      <DrawId
        id={firstDrawId}
        content={<>&lt;&lt;</>}
        className={classNames({ 'opacity-0': drawIdSelected === firstDrawId })}
      />
      {drawIdArray.map((id) => (
        <DrawId key={`drawIdSelector-${id}`} id={id} />
      ))}
      <DrawId
        id={lastDrawId}
        content={<>&gt;&gt;</>}
        className={classNames({ 'opacity-0': drawIdSelected === lastDrawId })}
      />
    </div>
  )
}

interface DrawIdProps {
  id: number
  content?: ReactNode
  className?: string
}

const DrawId = (props: DrawIdProps) => {
  const { id, content, className } = props

  const [drawIdSelected, setDrawIdSelected] = useAtom(selectedDrawIdAtom)

  return (
    <span
      onClick={() => setDrawIdSelected(id)}
      className={classNames(
        'select-none',
        {
          'opacity-0': id === 0,
          'cursor-pointer': id !== 0,
          'font-semibold': drawIdSelected === id
        },
        className
      )}
    >
      {content ?? id}
    </span>
  )
}

const getDrawIdsArray = (currId: number, drawIds: number[]) => {
  if (drawIds.length <= 7) return drawIds

  const array: number[] = [
    currId - 3,
    currId - 2,
    currId - 1,
    currId,
    currId + 1,
    currId + 2,
    currId + 3
  ]

  while (array[0] < drawIds[0]) {
    array.shift()
    array.push(array[array.length - 1] + 1)
  }

  while (array[array.length - 1] > drawIds[drawIds.length - 1]) {
    array.unshift(array[0] - 1)
    array.pop()
  }

  return array
}
