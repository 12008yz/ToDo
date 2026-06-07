import { useState } from 'react'
import { OnboardingPage } from './pages/OnboardingPage'
import { LoginPage } from './pages/LoginPage'
import './App.css'

type AppPage = 'onboarding' | 'login'

function App() {
  const [page, setPage] = useState<AppPage>('onboarding')

  return (
    <main className="app">
      {page === 'onboarding' ? (
        <OnboardingPage onStart={() => setPage('login')} />
      ) : (
        <LoginPage onRegistration={() => {}} />
      )}
    </main>
  )
}

export default App
