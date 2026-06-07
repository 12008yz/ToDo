export const ICON_ITEM_DURATION_MS = 820
export const ICON_ITEM_STAGGER_MS = 110
export const FLOAT_ITEM_COUNT = 12
export const ICON_TRAVEL_PX = 600

export const ICON_TRANSITION_MS =
  (FLOAT_ITEM_COUNT - 1) * ICON_ITEM_STAGGER_MS + ICON_ITEM_DURATION_MS

export type IconTransition = 'idle' | 'exit-up' | 'enter-from-bottom'

export type IconAnimationPhase = 'exit' | 'enter'
