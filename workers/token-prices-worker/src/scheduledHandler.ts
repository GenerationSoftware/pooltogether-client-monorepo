import { updateTokenPrices } from './updateTokenPrices'

export const handleScheduled = async (event: ScheduledEvent): Promise<boolean> => {
  try {
    await updateTokenPrices(event)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
