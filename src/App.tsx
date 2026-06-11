import { useCallback, useState } from 'react'
import { WelcomeLayout } from './components/WelcomeLayout'
import { OnboardingPage } from './pages/OnboardingPage'
import { HomePage } from './pages/HomePage'
import { AuthPanels } from './components/AuthPanels'
import type { IconAnimationPhase, IconTransition } from './constants/transitions'
import './App.css'

type AppPage = 'onboarding' | 'login' | 'home'
type TransitionPhase = 'idle' | 'exiting' | 'entering-icons'

function App() {
  const [page, setPage] = useState<AppPage>('onboarding')
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle')

  const isLogin = page === 'login'
  const isTransitioning = transitionPhase !== 'idle'

  const handleStart = () => {
    if (isTransitioning) return
    setTransitionPhase('exiting')
  }

  const handleIconsAnimationComplete = useCallback((phase: IconAnimationPhase) => {
    if (phase === 'exit') {
      setPage('login')
      setTransitionPhase('entering-icons')
      return
    }

    setTransitionPhase('idle')
  }, [])

  const iconTransition: IconTransition =
    transitionPhase === 'exiting'
      ? 'exit-up'
      : transitionPhase === 'entering-icons'
        ? 'enter-from-bottom'
        : 'idle'

  const contentHidden = transitionPhase === 'exiting'

  const showLoginContent =
    isLogin &&
    (transitionPhase === 'entering-icons' || transitionPhase === 'idle')

  const contentEntering = isLogin && transitionPhase === 'entering-icons'

  const handleMockLogin = useCallback(() => {
    setPage('home')
    setTransitionPhase('idle')
  }, [])

  if (page === 'home') {
    return (
      <main className="app">
        <HomePage />
      </main>
    )
  }

  return (
    <main className="app">
      <WelcomeLayout
        variant={isLogin ? 'login' : 'default'}
        iconTransition={iconTransition}
        contentHidden={contentHidden}
        contentEntering={contentEntering}
        onIconsAnimationComplete={handleIconsAnimationComplete}
      >
        <div className="welcome__page-stack">
          {!isLogin ? (
            <OnboardingPage onStart={handleStart} disabled={isTransitioning} />
          ) : null}
          <AuthPanels
            prehidden={!isLogin}
            showContent={showLoginContent}
            onEnter={handleMockLogin}
          />
        </div>
      </WelcomeLayout>
    </main>
  )
}

export default App
