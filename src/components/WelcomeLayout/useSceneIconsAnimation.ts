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
  onAnimationComplete?: (phase: IconAnimationPhase) => void
}

const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

function getItemIndex(element: HTMLElement): number {
  return Number(element.dataset.itemIndex ?? 0)
}

function getSceneItems(scene: HTMLElement): HTMLElement[] {
  return Array.from(
    scene.querySelectorAll<HTMLElement>('.welcome__scene-item'),
  ).sort((a, b) => getItemIndex(a) - getItemIndex(b))
}

function getDelayMs(index: number, phase: IconAnimationPhase): number {
  if (phase === 'exit') {
    return index * ICON_ITEM_STAGGER_MS
  }

  return (FLOAT_ITEM_COUNT - 1 - index) * ICON_ITEM_STAGGER_MS
}

function forceReflow(items: HTMLElement[]) {
  if (items[0]) {
    void items[0].offsetHeight
  }
}

function clearMotionStyles(items: HTMLElement[]) {
  for (const item of items) {
    item.style.transition = 'none'
    item.style.transform = ''
  }

  forceReflow(items)

  for (const item of items) {
    item.style.transition = ''
  }
}

function runIconTransition(
  items: HTMLElement[],
  phase: IconAnimationPhase,
  runId: number,
  activeRunId: () => number,
): number[] {
  const travel = ICON_TRAVEL_PX
  const from =
    phase === 'exit'
      ? 'translate3d(0, 0, 0)'
      : `translate3d(0, ${travel}px, 0)`
  const to =
    phase === 'exit'
      ? `translate3d(0, ${-travel}px, 0)`
      : 'translate3d(0, 0, 0)'

  for (const item of items) {
    item.style.transition = 'none'
    item.style.transform = from
  }

  forceReflow(items)

  const startTimers: number[] = []

  for (const item of items) {
    const delayMs = getDelayMs(getItemIndex(item), phase)

    const timer = window.setTimeout(() => {
      if (runId !== activeRunId()) return

      item.style.transition = `transform ${ICON_ITEM_DURATION_MS}ms ${EASING}`
      item.style.transform = to
    }, delayMs)

    startTimers.push(timer)
  }

  return startTimers
}

export function useSceneIconsAnimation({
  iconTransition,
  onAnimationComplete,
}: UseSceneIconsAnimationOptions) {
  const sceneRef = useRef<HTMLDivElement>(null)
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

    const scene = sceneRef.current
    if (!phase || !scene) return

    const items = getSceneItems(scene)
    if (items.length === 0) return

    const runId = ++runIdRef.current
    let finishTimer = 0
    let frameId = 0
    let startTimers: number[] = []

    const finish = () => {
      if (runId !== runIdRef.current) return

      if (phase === 'enter') {
        clearMotionStyles(items)
      }

      onCompleteRef.current?.(phase)
    }

    const start = () => {
      if (runId !== runIdRef.current) return

      startTimers = runIconTransition(items, phase, runId, () => runIdRef.current)
      finishTimer = window.setTimeout(finish, ICON_TRANSITION_MS + 150)
    }

    frameId = requestAnimationFrame(start)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(finishTimer)
      for (const timer of startTimers) {
        window.clearTimeout(timer)
      }
    }
  }, [iconTransition])

  return sceneRef
}
