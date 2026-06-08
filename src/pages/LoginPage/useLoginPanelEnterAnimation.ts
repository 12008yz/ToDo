import { useEffect, useRef, useState, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { getContentTransitionDurationMs } from '../../constants/transitions'

/** Safari/iOS often skips transitions from exactly 0 — use near-transparent start. */
const OPACITY_HIDDEN = 0.01

function clearPanelMotion(element: HTMLElement) {
  element.style.transition = ''
  element.style.webkitTransition = ''
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

function runOpacityFadeIn(
  element: HTMLDivElement,
  durationMs: number,
): { cancel: () => void; finished: Promise<void> } {
  let cancelled = false
  let animation: Animation | null = null
  let transitionListener: ((event: TransitionEvent) => void) | null = null
  let fallbackTimer = 0
  let settle: (() => void) | null = null

  const finished = new Promise<void>((resolve) => {
    let settled = false

    const done = () => {
      if (settled) return
      settled = true
      resolve()
    }

    settle = done

    void (async () => {
      element.setAttribute('data-motion-active', 'true')
      element.style.willChange = 'opacity'
      element.style.visibility = 'hidden'
      element.style.opacity = String(OPACITY_HIDDEN)
      void element.offsetHeight

      await waitTwoFrames()
      if (cancelled) {
        done()
        return
      }

      element.style.visibility = 'visible'
      void element.offsetHeight

      if (typeof element.animate === 'function') {
        animation = element.animate(
          [{ opacity: OPACITY_HIDDEN }, { opacity: 1 }],
          {
            duration: durationMs,
            easing: 'ease',
            fill: 'forwards',
          },
        )

        try {
          await animation.finished
        } catch {
          // Animation.cancel()
        }

        if (cancelled) {
          done()
          return
        }

        element.style.opacity = '1'
        animation.cancel()
        animation = null
        done()
        return
      }

      const transition = `opacity ${durationMs}ms ease`
      element.style.transition = transition
      element.style.webkitTransition = transition
      void element.offsetHeight
      element.style.opacity = '1'

      transitionListener = (event: TransitionEvent) => {
        if (event.target !== element || event.propertyName !== 'opacity') return
        element.removeEventListener('transitionend', transitionListener!)
        transitionListener = null
        window.clearTimeout(fallbackTimer)
        done()
      }

      element.addEventListener('transitionend', transitionListener)
      fallbackTimer = window.setTimeout(done, durationMs + 50)
    })()
  })

  return {
    cancel: () => {
      cancelled = true
      animation?.cancel()
      if (transitionListener) {
        element.removeEventListener('transitionend', transitionListener)
      }
      window.clearTimeout(fallbackTimer)
      settle?.()
    },
    finished,
  }
}

export function useLoginPanelEnterAnimation(
  panelRef: RefObject<HTMLDivElement | null>,
  active: boolean,
): boolean {
  const [interactive, setInteractive] = useState(false)
  const runIdRef = useRef(0)

  useEffect(() => {
    const elementAtStart = panelRef.current

    if (!active) {
      const frame = window.requestAnimationFrame(() => {
        setInteractive(false)
        if (elementAtStart) clearPanelMotion(elementAtStart)
      })
      return () => window.cancelAnimationFrame(frame)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frame = window.requestAnimationFrame(() => {
        if (elementAtStart) clearPanelMotion(elementAtStart)
        setInteractive(true)
      })
      return () => window.cancelAnimationFrame(frame)
    }

    const runId = ++runIdRef.current
    let retryFrame = 0
    let started = false
    let cancelled = false
    let motion: { cancel: () => void } | null = null

    const finish = (element: HTMLDivElement) => {
      if (cancelled || runId !== runIdRef.current) return
      flushSync(() => {
        setInteractive(true)
      })
      clearPanelMotion(element)
    }

    const start = async () => {
      if (started || cancelled || runId !== runIdRef.current) return

      const element = panelRef.current
      if (!element) return

      started = true
      await waitTwoFrames()
      if (cancelled || runId !== runIdRef.current || !panelRef.current) return

      const durationMs = getContentTransitionDurationMs()
      const run = runOpacityFadeIn(panelRef.current, durationMs)
      motion = run

      await run.finished
      if (!cancelled && panelRef.current) {
        finish(panelRef.current)
      }
    }

    const tryStart = (attempt = 0) => {
      if (cancelled || runId !== runIdRef.current) return

      void start()

      if (!started && attempt < 20) {
        retryFrame = window.requestAnimationFrame(() => tryStart(attempt + 1))
      }
    }

    const resetFrame = window.requestAnimationFrame(() => setInteractive(false))
    tryStart()

    return () => {
      cancelled = true
      window.cancelAnimationFrame(resetFrame)
      window.cancelAnimationFrame(retryFrame)
      motion?.cancel()
      if (elementAtStart) clearPanelMotion(elementAtStart)
    }
  }, [active, panelRef])

  return active ? interactive : false
}
