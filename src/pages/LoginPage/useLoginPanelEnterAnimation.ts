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
  element.style.visibility = ''
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
    if (!active) {
      setInteractive(false)
      if (panelRef.current) clearPanelMotion(panelRef.current)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (panelRef.current) clearPanelMotion(panelRef.current)
      setInteractive(true)
      return
    }

    const runId = ++runIdRef.current
    let delayTimer = 0
    let retryFrame = 0
    let started = false
    let cancelled = false
    let transitionListener: ((event: TransitionEvent) => void) | null = null

    const finish = (element: HTMLDivElement) => {
      if (cancelled || runId !== runIdRef.current) return
      setInteractive(true)
      requestAnimationFrame(() => {
        if (cancelled || runId !== runIdRef.current) return
        clearPanelMotion(element)
      })
    }

    const start = async () => {
      if (started || cancelled || runId !== runIdRef.current) return

      const element = panelRef.current
      if (!element) return

      started = true
      await waitTwoFrames()
      if (cancelled || runId !== runIdRef.current || !panelRef.current) return

      element.setAttribute('data-motion-active', 'true')
      element.style.willChange = 'opacity, transform'
      element.style.visibility = 'hidden'
      element.style.transition = 'none'
      element.style.webkitTransition = 'none'
      element.style.opacity = '0'
      setTransformY(element, LOGIN_PANEL_TRAVEL_PX)
      void element.offsetHeight

      delayTimer = window.setTimeout(() => {
        if (cancelled || runId !== runIdRef.current || !panelRef.current) return

        const el = panelRef.current
        el.style.visibility = 'visible'
        const transition = `opacity ${LOGIN_PANEL_DURATION_MS}ms ${ICON_TRANSITION_EASING}, transform ${LOGIN_PANEL_DURATION_MS}ms ${ICON_TRANSITION_EASING}`
        el.style.transition = transition
        el.style.webkitTransition = transition
        void el.offsetHeight

        el.style.opacity = '1'
        setTransformY(el, 0)

        transitionListener = (event: TransitionEvent) => {
          if (event.target !== el || event.propertyName !== 'transform') return
          el.removeEventListener('transitionend', transitionListener!)
          transitionListener = null
          finish(el)
        }
        el.addEventListener('transitionend', transitionListener)
      }, LOGIN_PANEL_DELAY_MS)
    }

    const tryStart = (attempt = 0) => {
      if (cancelled || runId !== runIdRef.current) return

      void start()

      if (!started && attempt < 20) {
        retryFrame = window.requestAnimationFrame(() => tryStart(attempt + 1))
      }
    }

    setInteractive(false)
    tryStart()

    return () => {
      cancelled = true
      window.cancelAnimationFrame(retryFrame)
      window.clearTimeout(delayTimer)
      const element = panelRef.current
      if (element && transitionListener) {
        element.removeEventListener('transitionend', transitionListener)
      }
      if (element) clearPanelMotion(element)
    }
  }, [active, panelRef])

  return interactive
}
