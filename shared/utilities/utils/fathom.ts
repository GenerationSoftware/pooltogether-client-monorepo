import 'fathom-client'

export enum FathomEvent {
  'deposit' = 'WNUT5OFV',
  'withdrawal' = '1HZEITIR'
}

export const logEvent = (event: FathomEvent, value: number = 1) => {
  if (window['fathom'] && !!process.env.NEXT_PUBLIC_FATHOM_SITE_ID) {
    try {
      window['fathom'].trackGoal(event, value)
    } catch (e) {}
  }
}
