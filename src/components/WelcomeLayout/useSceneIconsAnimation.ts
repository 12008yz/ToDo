import { useEffect, useRef, type RefObject } from 'react'
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
  sceneItemsRef: RefObject<(HTMLDivElement | null)[]>
  onAnimationComplete?: (phase: IconAnimationPhase) => void
}

type ItemAnimation = {
  cancel: () => void
}

const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

function getItems(ref: RefObject<(HTMLDivElement | null)[]>): HTMLDivElement[] {
  return (ref.current ?? []).filter((item): item is HTMLDivElement => item != null)
}

function getDelayMs(index: number, phase: IconAnimationPhase): number {
  if (phase === 'exit') {
    return index * ICON_ITEM_STAGGER_MS
  }

  return (FLOAT_ITEM_COUNT - 1 - index) * ICON_ITEM_STAGGER_MS
}

function setTransform(element: HTMLElement, y: number) {
  const value = `translate3d(0, ${y}px, 0)`
  element.style.transform = value
  element.style.webkitTransform = value
}

function clearMotionStyles(element: HTMLElement) {
  element.style.transition = ''
  element.style.transform = ''
  element.style.webkitTransform = ''
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
  let cancelled = false

  const cancel = () => {
    cancelled = true
    window.clearTimeout(delayTimer)
  }

  element.setAttribute('data-motion-active', 'true')
  element.style.transition = 'none'
  setTransform(element, fromY)
  void element.offsetHeight

  delayTimer = window.setTimeout(() => {
    if (cancelled || runId !== getRunId()) return

    element.style.transition = `transform ${ICON_ITEM_DURATION_MS}ms ${EASING}`
    element.style.webkitTransition = `-webkit-transform ${ICON_ITEM_DURATION_MS}ms ${EASING}`
    setTransform(element, toY)
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

  useEffect(() => {
    const phase: IconAnimationPhase | null =
      iconTransition === 'exit-up'
        ? 'exit'
        : iconTransition === 'enter-from-bottom'
          ? 'enter'
          : null

    if (!phase) return

    const runId = ++runIdRef.current
    let finishTimer = 0
    let retryFrame = 0
    let itemAnimations: ItemAnimation[] = []
    let started = false

    const finish = () => {
      if (runId !== runIdRef.current) return

      if (phase === 'enter') {
        for (const item of getItems(sceneItemsRef)) {
          clearMotionStyles(item)
        }
      }

      onCompleteRef.current?.(phase)
    }

    const start = () => {
      if (started || runId !== runIdRef.current) return

      const items = getItems(sceneItemsRef)
      if (items.length < FLOAT_ITEM_COUNT) return

      started = true
      itemAnimations = items.map((item, index) =>
        animateItemY(item, index, phase, runId, () => runIdRef.current),
      )
      finishTimer = window.setTimeout(finish, ICON_TRANSITION_MS + 100)
    }

    const tryStart = (attempt = 0) => {
      if (runId !== runIdRef.current) return

      start()

      if (!started && attempt < 20) {
        retryFrame = window.requestAnimationFrame(() => tryStart(attempt + 1))
      } else if (!started) {
        finish()
      }
    }

    tryStart()

    return () => {
      window.cancelAnimationFrame(retryFrame)
      window.clearTimeout(finishTimer)
      for (const animation of itemAnimations) {
        animation.cancel()
      }
    }
  }, [iconTransition, sceneItemsRef])

  return null
}
