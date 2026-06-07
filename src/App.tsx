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
        {isLogin ? (
          <LoginPage onRegistration={() => {}} />
        ) : (
          <OnboardingPage onStart={() => setPage('login')} />
        )}
      </WelcomeLayout>
    </main>
  )
}

export default App
