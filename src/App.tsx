import { useState } from 'react'
import { WelcomeLayout } from './components/WelcomeLayout'
import { OnboardingPage } from './pages/OnboardingPage'
import { LoginPage } from './pages/LoginPage'
import './App.css'

type AppPage = 'onboarding' | 'login'

function App() {
  const [page, setPage] = useState<AppPage>('onboarding')
  const isLogin = page === 'login'

  return (
    <main className="app">
      <WelcomeLayout variant={isLogin ? 'login' : 'default'}>
        <div className="welcome__screens">
          <div
            className={`welcome__screen${!isLogin ? ' welcome__screen--active' : ''}`}
            aria-hidden={isLogin}
          >
            <OnboardingPage onStart={() => setPage('login')} />
          </div>
          <div
            className={`welcome__screen${isLogin ? ' welcome__screen--active' : ''}`}
            aria-hidden={!isLogin}
          >
            <LoginPage onRegistration={() => {}} />
          </div>
        </div>
      </WelcomeLayout>
    </main>
  )
}

export default App
