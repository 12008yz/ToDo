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

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getItemIndex(element: HTMLElement): number {
  return Number(element.dataset.itemIndex ?? 0)
}

function buildKeyframes(
  element: HTMLElement,
  phase: IconAnimationPhase,
): Keyframe[] {
  const isCalendar = element.classList.contains('welcome__illustration--calendar')
  const travel = ICON_TRAVEL_PX

  if (phase === 'exit') {
    return isCalendar
      ? [
          { transform: 'rotate(12.86deg) translate3d(0, 0, 0)' },
          { transform: `rotate(12.86deg) translate3d(0, ${-travel}px, 0)` },
        ]
      : [
          { transform: 'translate3d(0, 0, 0)' },
          { transform: `translate3d(0, ${-travel}px, 0)` },
        ]
  }

  return isCalendar
    ? [
        { transform: `rotate(12.86deg) translate3d(0, ${travel}px, 0)` },
        { transform: 'rotate(12.86deg) translate3d(0, 0, 0)' },
      ]
    : [
        { transform: `translate3d(0, ${travel}px, 0)` },
        { transform: 'translate3d(0, 0, 0)' },
      ]
}

function getDelay(index: number, phase: IconAnimationPhase): number {
  if (phase === 'exit') {
    return index * ICON_ITEM_STAGGER_MS
  }

  return (FLOAT_ITEM_COUNT - 1 - index) * ICON_ITEM_STAGGER_MS
}

function clearInlineTransform(items: HTMLElement[]) {
  for (const item of items) {
    item.style.transform = ''
  }
}

export function useSceneIconsAnimation({
  iconTransition,
  onAnimationComplete,
}: UseSceneIconsAnimationOptions) {
  const sceneRef = useRef<HTMLDivElement>(null)

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
    )

    if (items.length === 0) return

    if (prefersReducedMotion()) {
      clearInlineTransform(items)
      onAnimationComplete?.(phase)
      return
    }

    const animations = items.map((item) => {
      const index = getItemIndex(item)
      return item.animate(buildKeyframes(item, phase), {
        duration: ICON_ITEM_DURATION_MS,
        delay: getDelay(index, phase),
        easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
        fill: 'both',
      })
    })

    let cancelled = false

    void Promise.all(animations.map((animation) => animation.finished))
      .then(() => {
        if (cancelled) return

        if (phase === 'enter') {
          clearInlineTransform(items)
        }

        onAnimationComplete?.(phase)
      })
      .catch(() => {
        if (!cancelled) {
          clearInlineTransform(items)
          onAnimationComplete?.(phase)
        }
      })

    return () => {
      cancelled = true
      for (const animation of animations) {
        if (animation.playState !== 'finished') {
          animation.cancel()
        }
      }
    }
  }, [iconTransition, onAnimationComplete])

  return sceneRef
}
