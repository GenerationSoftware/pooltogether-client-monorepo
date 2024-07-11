import { atom, useAtom } from 'jotai'
import { SettingsModalView } from '@components/Modals/SettingsModal'

const settingsModalView = atom<SettingsModalView>('menu')

/**
 * Returns the current view of the settings modal as well as a method to update it
 * @returns
 */
export const useSettingsModalView = () => {
  const [view, setView] = useAtom(settingsModalView)

  return { view, setView }
}
