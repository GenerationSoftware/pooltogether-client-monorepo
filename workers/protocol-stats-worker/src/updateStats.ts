import { updateHandler } from './updateHandler'
import { getV3Stats } from './v3'
import { getV4Stats } from './v4'
import { getV5Stats } from './v5'

export const updateStats = async (event: FetchEvent | ScheduledEvent) => {
  try {
    const v3 = await getV3Stats()
    const v4 = await getV4Stats()
    const v5 = await getV5Stats()

    return updateHandler(event, v3, v4, v5)
  } catch (e) {
    console.error(e)
    return undefined
  }
}
