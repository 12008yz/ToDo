import { useCallback, useEffect, useRef, useState } from 'react'
import { getContentTransitionDurationMs } from '../../constants/transitions'
import { LoginPage } from '../../pages/LoginPage'
import { RegistrationPage } from '../../pages/RegistrationPage'
import { useContentEnterAnimation } from '../WelcomeLayout/useContentEnterAnimation'
import './AuthPanels.css'

export type AuthPanel = 'login' | 'registration'

export type PanelVisualState = 'visible' | 'inactive' | 'exiting'

type SwitchPhase = 'idle' | 'exiting' | 'entering'

type AuthPanelsProps = {
  showContent: boolean
  prehidden: boolean
}

function getPanelState(
  panel: AuthPanel,
  activePanel: AuthPanel,
  switchPhase: SwitchPhase,
): PanelVisualState {
  if (switchPhase === 'exiting') {
    return panel === activePanel ? 'exiting' : 'inactive'
  }

  return panel === activePanel ? 'visible' : 'inactive'
}

export function AuthPanels({ showContent, prehidden }: AuthPanelsProps) {
  const [activePanel, setActivePanel] = useState<AuthPanel>('login')
  const [switchPhase, setSwitchPhase] = useState<SwitchPhase>('idle')
  const [pendingPanel, setPendingPanel] = useState<AuthPanel | null>(null)
  const [exitActive, setExitActive] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enterPending = useContentEnterAnimation(
    wrapperRef,
    switchPhase === 'entering',
  )

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const finishEntering = useCallback(() => {
    setSwitchPhase('idle')
  }, [])

  const switchPanel = useCallback(
    (to: AuthPanel) => {
      if (switchPhase !== 'idle' || activePanel === to || prehidden || !showContent) {
        return
      }

      setPendingPanel(to)
      setSwitchPhase('exiting')
    },
    [activePanel, prehidden, showContent, switchPhase],
  )

  useEffect(() => {
    if (switchPhase !== 'exiting' || !pendingPanel) {
      setExitActive(false)
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? 0 : getContentTransitionDurationMs()

    setExitActive(false)

    let outerFrame = 0
    let innerFrame = 0

    outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => {
        setExitActive(true)
      })
    })

    timerRef.current = setTimeout(() => {
      setActivePanel(pendingPanel)
      setPendingPanel(null)
      setExitActive(false)
      setSwitchPhase('entering')
    }, duration)

    return () => {
      window.cancelAnimationFrame(outerFrame)
      window.cancelAnimationFrame(innerFrame)
      clearTimer()
    }
  }, [clearTimer, pendingPanel, switchPhase])

  useEffect(() => {
    if (switchPhase !== 'entering' || enterPending) return

    const element = wrapperRef.current
    if (!element) {
      finishEntering()
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      finishEntering()
      return
    }

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== element || event.propertyName !== 'opacity') return
      finishEntering()
    }

    element.addEventListener('transitionend', onTransitionEnd)
    timerRef.current = setTimeout(finishEntering, getContentTransitionDurationMs() + 50)

    return () => {
      element.removeEventListener('transitionend', onTransitionEnd)
      clearTimer()
    }
  }, [clearTimer, enterPending, finishEntering, switchPhase])

  useEffect(() => {
    if (!prehidden) return

    clearTimer()
    setActivePanel('login')
    setPendingPanel(null)
    setExitActive(false)
    setSwitchPhase('idle')
  }, [clearTimer, prehidden])

  useEffect(() => clearTimer, [clearTimer])

  const wrapperClassName = [
    'auth-panels',
    prehidden ? 'auth-panels--prehidden' : '',
    enterPending ? 'auth-panels--enter-pending' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      <LoginPage
        showContent={showContent}
        panelState={getPanelState('login', activePanel, switchPhase)}
        exitActive={exitActive}
        onRegistration={() => switchPanel('registration')}
      />
      <RegistrationPage
        showContent={showContent}
        panelState={getPanelState('registration', activePanel, switchPhase)}
        exitActive={exitActive}
        onLogin={() => switchPanel('login')}
      />
    </div>
  )
}
