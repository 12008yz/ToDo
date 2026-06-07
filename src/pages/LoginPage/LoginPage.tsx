import { PrimaryButton } from '../../components/PrimaryButton'
import './LoginPage.css'

type LoginPageProps = {
  showContent?: boolean
  onRegistration?: () => void
}

export function LoginPage({ showContent = true, onRegistration }: LoginPageProps) {
  return (
    <div
      className={`login__panel${showContent ? ' login__panel--visible' : ''}`}
      aria-hidden={!showContent}
    >
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
          tabIndex={showContent ? 0 : -1}
        />
        <input
          className="login__field"
          type="password"
          name="password"
          autoComplete="current-password"
          aria-label="Password"
          tabIndex={showContent ? 0 : -1}
        />
      </form>

      <PrimaryButton type="submit" form="login-form">
        Enter
      </PrimaryButton>

      <button
        type="button"
        className="login__link"
        onClick={onRegistration}
        tabIndex={showContent ? 0 : -1}
      >
        Registration
      </button>
    </div>
  )
}
