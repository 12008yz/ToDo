import { useCallback, useEffect, useRef, useState, type TransitionEvent } from 'react'
import { CONTENT_TRANSITION_DURATION_MS } from '../../constants/transitions'

export function useLoginPanelEnterAnimation(active: boolean): {
  visible: boolean
  interactive: boolean
  onTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void
} {
  const [visible, setVisible] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const runIdRef = useRef(0)

  useEffect(() => {
    const runId = ++runIdRef.current
    let frame = 0
    let finishTimer = 0

    const reset = () => {
      if (runId !== runIdRef.current) return
      setVisible(false)
      setInteractive(false)
    }

    if (!active) {
      frame = window.requestAnimationFrame(reset)
      return () => window.cancelAnimationFrame(frame)
    }

    const start = () => {
      if (runId !== runIdRef.current) return
      setVisible(true)

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInteractive(true)
        return
      }

      finishTimer = window.setTimeout(() => {
        if (runId !== runIdRef.current) return
        setInteractive(true)
      }, CONTENT_TRANSITION_DURATION_MS)
    }

    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(start)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(finishTimer)
    }
  }, [active])

  const onTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'opacity' || event.target !== event.currentTarget) return
    setInteractive(true)
  }, [])

  return {
    visible: active && visible,
    interactive: active && interactive,
    onTransitionEnd,
  }
}
