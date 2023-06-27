import { atom, useAtom } from 'jotai'

const modalOpenStatesAtom = atom<{ [key: string]: boolean }>({})

/**
 * Returns the open state of any modal as well as a method to toggle it
 * @returns
 */
export const useIsModalOpen = (key: string) => {
  const [modalOpenStates, setModalOpenStates] = useAtom(modalOpenStatesAtom)

  const isModalOpen = !!modalOpenStates[key]

  const setIsModalOpen = (val: boolean) => {
    setModalOpenStates({ ...modalOpenStates, [key]: val })
  }

  return { isModalOpen, setIsModalOpen }
}
