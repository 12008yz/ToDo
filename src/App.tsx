import { useCallback, useState } from 'react'
import { WelcomeLayout } from './components/WelcomeLayout'
import { OnboardingPage } from './pages/OnboardingPage'
import { LoginPage } from './pages/LoginPage'
import type { IconAnimationPhase, IconTransition } from './constants/transitions'
import './App.css'

type AppPage = 'onboarding' | 'login'
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

  return (
    <main className="app">
      <WelcomeLayout
        variant={isLogin ? 'login' : 'default'}
        iconTransition={iconTransition}
        contentHidden={contentHidden}
        onIconsAnimationComplete={handleIconsAnimationComplete}
      >
        {isLogin ? (
          <LoginPage showContent={showLoginContent} onRegistration={() => {}} />
        ) : (
          <OnboardingPage onStart={handleStart} disabled={isTransitioning} />
        )}
      </WelcomeLayout>
    </main>
  )
}

export default App
