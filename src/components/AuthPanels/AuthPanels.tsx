import { useCallback, useEffect, useRef, useState } from 'react'
import { AUTH_PANEL_CROSSFADE_MS } from '../../constants/transitions'
import { LoginPage } from '../../pages/LoginPage'
import { RegistrationPage } from '../../pages/RegistrationPage'
import './AuthPanels.css'

export type AuthPanel = 'login' | 'registration'

export type PanelVisualState = 'visible' | 'inactive' | 'fade-out' | 'fade-in'

type AuthPanelsProps = {
  showContent: boolean
  prehidden: boolean
}

function getPanelState(
  panel: AuthPanel,
  active: AuthPanel,
  transition: { from: AuthPanel; to: AuthPanel } | null,
): PanelVisualState {
  if (!transition) {
    return active === panel ? 'visible' : 'inactive'
  }

  if (panel === transition.from) return 'fade-out'
  if (panel === transition.to) return 'fade-in'
  return 'inactive'
}

export function AuthPanels({ showContent, prehidden }: AuthPanelsProps) {
  const [activePanel, setActivePanel] = useState<AuthPanel>('login')
  const [transition, setTransition] = useState<{
    from: AuthPanel
    to: AuthPanel
  } | null>(null)
  const [fadeActive, setFadeActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const switchPanel = useCallback(
    (to: AuthPanel) => {
      if (transition || activePanel === to || prehidden || !showContent) return
      setFadeActive(false)
      setTransition({ from: activePanel, to })
    },
    [activePanel, prehidden, showContent, transition],
  )

  useEffect(() => {
    if (!transition) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? 0 : AUTH_PANEL_CROSSFADE_MS

    const enterFrame = window.requestAnimationFrame(() => {
      setFadeActive(true)
    })

    timerRef.current = setTimeout(() => {
      setActivePanel(transition.to)
      setTransition(null)
      setFadeActive(false)
    }, duration)

    return () => {
      window.cancelAnimationFrame(enterFrame)
      clearTimer()
    }
  }, [clearTimer, transition])

  useEffect(() => {
    if (!prehidden) return
    clearTimer()
    setActivePanel('login')
    setTransition(null)
    setFadeActive(false)
  }, [clearTimer, prehidden])

  useEffect(() => clearTimer, [clearTimer])

  const wrapperClassName = [
    'auth-panels',
    prehidden ? 'auth-panels--prehidden' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClassName}>
      <LoginPage
        showContent={showContent}
        panelState={getPanelState('login', activePanel, transition)}
        fadeActive={fadeActive}
        onRegistration={() => switchPanel('registration')}
      />
      <RegistrationPage
        showContent={showContent}
        panelState={getPanelState('registration', activePanel, transition)}
        fadeActive={fadeActive}
        onLogin={() => switchPanel('login')}
      />
    </div>
  )
}
