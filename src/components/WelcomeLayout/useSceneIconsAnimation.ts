import { useLayoutEffect, useRef } from 'react'
import {
  FLOAT_ITEM_COUNT,
  ICON_ITEM_DURATION_MS,
  ICON_ITEM_STAGGER_MS,
  ICON_TRANSITION_MS,
  ICON_TRAVEL_PX,
  type IconAnimationPhase,
  type IconTransition,
} from '../../constants/transitions'

type UseSceneIconsAnimationOptions = {
  iconTransition: IconTransition
  sceneItemsRef: React.RefObject<(HTMLDivElement | null)[]>
  onAnimationComplete?: (phase: IconAnimationPhase) => void
}

type ItemAnimation = {
  cancel: () => void
}

function getItems(ref: React.RefObject<(HTMLDivElement | null)[]>): HTMLDivElement[] {
  return (ref.current ?? []).filter((item): item is HTMLDivElement => item != null)
}

function getDelayMs(index: number, phase: IconAnimationPhase): number {
  if (phase === 'exit') {
    return index * ICON_ITEM_STAGGER_MS
  }

  return (FLOAT_ITEM_COUNT - 1 - index) * ICON_ITEM_STAGGER_MS
}

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3
}

function setOffsetY(element: HTMLElement, y: number) {
  const transform = `translate3d(0, ${y}px, 0)`
  element.style.setProperty('transform', transform, 'important')
  element.style.setProperty('-webkit-transform', transform, 'important')
}

function clearOffsetY(element: HTMLElement) {
  element.style.removeProperty('transform')
  element.style.removeProperty('-webkit-transform')
  element.removeAttribute('data-motion-active')
}

function animateItemY(
  element: HTMLDivElement,
  index: number,
  phase: IconAnimationPhase,
  runId: number,
  getRunId: () => number,
): ItemAnimation {
  const travel = ICON_TRAVEL_PX
  const fromY = phase === 'exit' ? 0 : travel
  const toY = phase === 'exit' ? -travel : 0
  const delayMs = getDelayMs(index, phase)

  let delayTimer = 0
  let frameId = 0
  let cancelled = false

  const cancel = () => {
    cancelled = true
    window.clearTimeout(delayTimer)
    window.cancelAnimationFrame(frameId)
  }

  element.setAttribute('data-motion-active', 'true')
  setOffsetY(element, fromY)

  delayTimer = window.setTimeout(() => {
    if (cancelled || runId !== getRunId()) return

    const startTime = performance.now()

    const tick = (now: number) => {
      if (cancelled || runId !== getRunId()) return

      const progress = Math.min(1, (now - startTime) / ICON_ITEM_DURATION_MS)
      const y = fromY + (toY - fromY) * easeOutCubic(progress)
      setOffsetY(element, y)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)
  }, delayMs)

  return { cancel }
}

export function useSceneIconsAnimation({
  iconTransition,
  sceneItemsRef,
  onAnimationComplete,
}: UseSceneIconsAnimationOptions) {
  const onCompleteRef = useRef(onAnimationComplete)
  const runIdRef = useRef(0)

  onCompleteRef.current = onAnimationComplete

  useLayoutEffect(() => {
    const phase: IconAnimationPhase | null =
      iconTransition === 'exit-up'
        ? 'exit'
        : iconTransition === 'enter-from-bottom'
          ? 'enter'
          : null

    if (!phase) return

    const runId = ++runIdRef.current
    let finishTimer = 0
    let itemAnimations: ItemAnimation[] = []

    const items = getItems(sceneItemsRef)
    if (items.length === 0) return

    itemAnimations = items.map((item, index) =>
      animateItemY(item, index, phase, runId, () => runIdRef.current),
    )

    finishTimer = window.setTimeout(() => {
      if (runId !== runIdRef.current) return

      if (phase === 'enter') {
        for (const item of getItems(sceneItemsRef)) {
          clearOffsetY(item)
        }
      }

      onCompleteRef.current?.(phase)
    }, ICON_TRANSITION_MS + 100)

    return () => {
      window.clearTimeout(finishTimer)
      for (const animation of itemAnimations) {
        animation.cancel()
      }
    }
  }, [iconTransition, sceneItemsRef])

  return null
}
