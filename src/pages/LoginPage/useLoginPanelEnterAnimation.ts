import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  ICON_TRANSITION_EASING,
  LOGIN_PANEL_DELAY_MS,
  LOGIN_PANEL_DURATION_MS,
  LOGIN_PANEL_TRAVEL_PX,
} from '../../constants/transitions'

function setTransformY(element: HTMLElement, y: number) {
  const value = `translate3d(0, ${y}px, 0.01px)`
  element.style.transform = value
  element.style.webkitTransform = value
}

function clearPanelMotion(element: HTMLElement) {
  element.style.transition = ''
  element.style.webkitTransition = ''
  element.style.transform = ''
  element.style.webkitTransform = ''
  element.style.opacity = ''
  element.style.willChange = ''
  element.removeAttribute('data-motion-active')
}

function waitTwoFrames(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

export function useLoginPanelEnterAnimation(
  panelRef: RefObject<HTMLDivElement | null>,
  active: boolean,
): boolean {
  const [interactive, setInteractive] = useState(false)
  const runIdRef = useRef(0)

  useEffect(() => {
    const panel = panelRef.current

    if (!active || !panel) {
      setInteractive(false)
      if (panel) clearPanelMotion(panel)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearPanelMotion(panel)
      setInteractive(true)
      return
    }

    const runId = ++runIdRef.current
    let delayTimer = 0
    let finishTimer = 0
    let cancelled = false

    const finish = () => {
      if (cancelled || runId !== runIdRef.current || !panelRef.current) return
      clearPanelMotion(panelRef.current)
      setInteractive(true)
    }

    const start = async () => {
      await waitTwoFrames()
      if (cancelled || runId !== runIdRef.current || !panelRef.current) return

      const element = panelRef.current
      element.setAttribute('data-motion-active', 'true')
      element.style.willChange = 'transform'
      element.style.transition = 'none'
      element.style.webkitTransition = 'none'
      element.style.opacity = '0'
      setTransformY(element, LOGIN_PANEL_TRAVEL_PX)
      void element.offsetHeight

      delayTimer = window.setTimeout(() => {
        if (cancelled || runId !== runIdRef.current || !panelRef.current) return

        const element = panelRef.current
        element.style.opacity = '1'
        const transition = `transform ${LOGIN_PANEL_DURATION_MS}ms ${ICON_TRANSITION_EASING}`
        element.style.transition = transition
        element.style.webkitTransition = transition
        setTransformY(element, 0)

        finishTimer = window.setTimeout(finish, LOGIN_PANEL_DURATION_MS + 80)
      }, LOGIN_PANEL_DELAY_MS)
    }

    setInteractive(false)
    void start()

    return () => {
      cancelled = true
      window.clearTimeout(delayTimer)
      window.clearTimeout(finishTimer)
      if (panelRef.current) clearPanelMotion(panelRef.current)
    }
  }, [active, panelRef])

  return interactive
}
