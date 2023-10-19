import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useDrawIds, useLastAwardedDrawId } from '@generationsoftware/hyperstructure-react-hooks'
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

  const [drawIdSelected, setDrawIdSelected] = useAtom(selectedDrawIdAtom)

  const { data: lastDrawId } = useLastAwardedDrawId(prizePool)

  useEffect(() => {
    if (!!lastDrawId && !drawIdSelected) {
      setDrawIdSelected(lastDrawId)
    }
  }, [lastDrawId])

  const drawIdArray = useMemo(() => {
    return !!drawIdSelected && !!lastDrawId
      ? getDrawIdsArray(drawIdSelected, drawIds[0], lastDrawId)
      : Array(7).fill(0)
  }, [drawIds, lastDrawId, drawIdSelected])

  if (!drawIdSelected || !lastDrawId) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <div className={classNames('flex gap-2 items-center text-xl text-pt-purple-500', className)}>
      <DrawId
        id={drawIds[0]}
        content={<>&lt;&lt;</>}
        className={classNames({ 'opacity-0': drawIdSelected === drawIds[0] })}
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

const getDrawIdsArray = (currId: number, firstId: number, lastId: number) => {
  const array: number[] = []

  const padLeft =
    currId > firstId + 2
      ? currId < lastId - 2
        ? 3
        : currId < lastId - 1
        ? 4
        : currId < lastId
        ? 5
        : 6
      : currId - firstId

  const padRight =
    currId < lastId - 2
      ? currId > firstId + 2
        ? 3
        : currId > firstId + 1
        ? 4
        : currId > firstId
        ? 5
        : 6
      : lastId - currId

  for (let i = currId - padLeft; i <= currId + padRight; i++) {
    array.push(i)
  }

  return array
}
