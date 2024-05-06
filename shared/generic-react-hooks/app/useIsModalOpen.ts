import { atom, useAtom } from 'jotai'

const modalOpenStatesAtom = atom<{ [key: string]: boolean }>({})

/**
 * Returns the open state of any modal as well as a method to toggle it
 * @param key a modal-specific identifier
 * @param options optional settings
 * @returns
 */
export const useIsModalOpen = (
  key: string,
  options?: { onOpen?: () => void; onClose?: () => void }
) => {
  const [modalOpenStates, setModalOpenStates] = useAtom(modalOpenStatesAtom)

  const isModalOpen = !!modalOpenStates[key]

  const setIsModalOpen = (val: boolean) => {
    val ? options?.onOpen?.() : options?.onClose?.()
    setModalOpenStates({ ...modalOpenStates, [key]: val })
  }

  return { isModalOpen, setIsModalOpen }
}
