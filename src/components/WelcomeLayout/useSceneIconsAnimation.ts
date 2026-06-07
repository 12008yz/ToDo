import { useLayoutEffect, useRef } from 'react'
import {
  FLOAT_ITEM_COUNT,
  ICON_ITEM_DURATION_MS,
  ICON_ITEM_STAGGER_MS,
  ICON_TRAVEL_PX,
  type IconAnimationPhase,
  type IconTransition,
} from '../../constants/transitions'

type UseSceneIconsAnimationOptions = {
  iconTransition: IconTransition
  onAnimationComplete?: (phase: IconAnimationPhase) => void
}

const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getItemIndex(element: HTMLElement): number {
  return Number(element.dataset.itemIndex ?? 0)
}

function getTotalDurationMs(): number {
  return (FLOAT_ITEM_COUNT - 1) * ICON_ITEM_STAGGER_MS + ICON_ITEM_DURATION_MS
}

function getDelay(index: number, phase: IconAnimationPhase): number {
  if (phase === 'exit') {
    return index * ICON_ITEM_STAGGER_MS
  }

  return (FLOAT_ITEM_COUNT - 1 - index) * ICON_ITEM_STAGGER_MS
}

function buildStaggeredKeyframes(
  phase: IconAnimationPhase,
  index: number,
): Keyframe[] {
  const travel = ICON_TRAVEL_PX
  const total = getTotalDurationMs()
  const delay = getDelay(index, phase)
  const delayOffset = delay / total
  const endOffset = Math.min(1, (delay + ICON_ITEM_DURATION_MS) / total)

  if (phase === 'exit') {
    return [
      { transform: 'translate3d(0, 0, 0)', offset: 0 },
      { transform: 'translate3d(0, 0, 0)', offset: delayOffset },
      {
        transform: `translate3d(0, ${-travel}px, 0)`,
        offset: endOffset,
        easing: EASING,
      },
      { transform: `translate3d(0, ${-travel}px, 0)`, offset: 1 },
    ]
  }

  return [
    { transform: `translate3d(0, ${travel}px, 0)`, offset: 0 },
    { transform: `translate3d(0, ${travel}px, 0)`, offset: delayOffset },
    {
      transform: 'translate3d(0, 0, 0)',
      offset: endOffset,
      easing: EASING,
    },
    { transform: 'translate3d(0, 0, 0)', offset: 1 },
  ]
}

function setStartTransform(items: HTMLElement[], phase: IconAnimationPhase) {
  const travel = ICON_TRAVEL_PX

  for (const item of items) {
    item.style.transform =
      phase === 'exit'
        ? 'translate3d(0, 0, 0)'
        : `translate3d(0, ${travel}px, 0)`
  }
}

function clearInlineTransform(items: HTMLElement[]) {
  for (const item of items) {
    item.style.transform = ''
  }
}

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

export function useSceneIconsAnimation({
  iconTransition,
  onAnimationComplete,
}: UseSceneIconsAnimationOptions) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onAnimationComplete)

  onCompleteRef.current = onAnimationComplete

  useLayoutEffect(() => {
    const phase: IconAnimationPhase | null =
      iconTransition === 'exit-up'
        ? 'exit'
        : iconTransition === 'enter-from-bottom'
          ? 'enter'
          : null

    if (!phase || !sceneRef.current) return

    const items = Array.from(
      sceneRef.current.querySelectorAll<HTMLElement>('.welcome__scene-item'),
    ).sort((a, b) => getItemIndex(a) - getItemIndex(b))

    if (items.length === 0) return

    if (prefersReducedMotion()) {
      clearInlineTransform(items)
      onCompleteRef.current?.(phase)
      return
    }

    let cancelled = false
    let finishTimer = 0
    const animations: Animation[] = []

    const finish = () => {
      if (cancelled) return

      if (phase === 'enter') {
        clearInlineTransform(items)
      }

      onCompleteRef.current?.(phase)
    }

    setStartTransform(items, phase)

    void waitForNextFrame().then(() => {
      if (cancelled) return

      for (const item of items) {
        const index = getItemIndex(item)
        const animation = item.animate(buildStaggeredKeyframes(phase, index), {
          duration: getTotalDurationMs(),
          easing: 'linear',
          fill: 'forwards',
        })

        animations.push(animation)
      }

      finishTimer = window.setTimeout(finish, getTotalDurationMs() + 80)
    })

    return () => {
      cancelled = true
      window.clearTimeout(finishTimer)

      for (const animation of animations) {
        if (animation.playState !== 'finished') {
          animation.cancel()
        }
      }
    }
  }, [iconTransition])

  return sceneRef
}
