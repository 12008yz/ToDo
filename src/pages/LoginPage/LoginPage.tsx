import { PrimaryButton } from '../../components/PrimaryButton'
import './LoginPage.css'

type LoginPageProps = {
  onRegistration?: () => void
}

export function LoginPage({ onRegistration }: LoginPageProps) {
  return (
    <div className="login__panel">
      <h1 className="login__title">Login</h1>

      <form
        id="login-form"
        className="login__fields"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          className="login__field"
          type="email"
          name="email"
          autoComplete="email"
          aria-label="Email"
        />
        <input
          className="login__field"
          type="password"
          name="password"
          autoComplete="current-password"
          aria-label="Password"
        />
      </form>

      <PrimaryButton type="submit" form="login-form">
        Enter
      </PrimaryButton>

      <button type="button" className="login__link" onClick={onRegistration}>
        Registration
      </button>
    </div>
  )
}
