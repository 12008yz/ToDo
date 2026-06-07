import { useEffect, useState } from 'react'
import { WelcomeLayout, type IconTransition } from './components/WelcomeLayout'
import { OnboardingPage } from './pages/OnboardingPage'
import { LoginPage } from './pages/LoginPage'
import { ICON_TRANSITION_MS } from './constants/transitions'
import './App.css'

type AppPage = 'onboarding' | 'login'
type TransitionPhase = 'idle' | 'exiting' | 'pre-enter' | 'entering-icons'

function App() {
  const [page, setPage] = useState<AppPage>('onboarding')
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle')

  const isLogin = page === 'login'
  const isTransitioning = transitionPhase !== 'idle'

  const handleStart = () => {
    if (isTransitioning) return
    setTransitionPhase('exiting')
  }

  useEffect(() => {
    if (transitionPhase === 'exiting') {
      const timer = window.setTimeout(() => {
        setPage('login')
        setTransitionPhase('pre-enter')
      }, ICON_TRANSITION_MS)
      return () => window.clearTimeout(timer)
    }

    if (transitionPhase === 'pre-enter') {
      let raf2 = 0
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setTransitionPhase('entering-icons')
        })
      })
      return () => {
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
      }
    }

    if (transitionPhase === 'entering-icons') {
      const timer = window.setTimeout(() => {
        setTransitionPhase('idle')
      }, ICON_TRANSITION_MS)
      return () => window.clearTimeout(timer)
    }
  }, [transitionPhase])

  const iconTransition: IconTransition =
    transitionPhase === 'exiting'
      ? 'exit-up'
      : transitionPhase === 'pre-enter'
        ? 'pre-enter'
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
