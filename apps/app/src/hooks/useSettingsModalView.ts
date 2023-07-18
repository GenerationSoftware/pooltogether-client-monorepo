import { SettingsModalView } from '@shared/react-components'
import { atom, useAtom } from 'jotai'

const settingsModalView = atom<SettingsModalView>('menu')

/**
 * Returns the current view of the settings modal as well as a method to update it
 * @returns
 */
export const useSettingsModalView = () => {
  const [view, setView] = useAtom(settingsModalView)

  return { view, setView }
}
