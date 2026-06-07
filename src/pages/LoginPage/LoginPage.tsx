import { WelcomeLayout } from '../../components/WelcomeLayout'
import { PrimaryButton } from '../../components/PrimaryButton'
import './LoginPage.css'

type LoginPageProps = {
  onRegistration?: () => void
}

export function LoginPage({ onRegistration }: LoginPageProps) {
  return (
    <WelcomeLayout variant="login">
      <div className="login__panel">
        <h1 className="login__title">Login</h1>

        <form
          id="login-form"
          className="login__fields"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            className="login__field login__field--email"
            type="email"
            name="email"
            autoComplete="email"
            aria-label="Email"
          />
          <input
            className="login__field login__field--password"
            type="password"
            name="password"
            autoComplete="current-password"
            aria-label="Password"
          />
        </form>

        <div className="login__cta">
          <PrimaryButton type="submit" form="login-form">
            Enter
          </PrimaryButton>
        </div>

        <button type="button" className="login__link" onClick={onRegistration}>
          Registration
        </button>
      </div>
    </WelcomeLayout>
  )
}
