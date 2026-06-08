import { PrimaryButton } from '../../components/PrimaryButton'
import './LoginPage.css'

type LoginPageProps = {
  showContent?: boolean
  prehidden?: boolean
  onRegistration?: () => void
}

export function LoginPage({
  showContent = true,
  prehidden = false,
  onRegistration,
}: LoginPageProps) {
  const visible = showContent && !prehidden

  return (
    <div
      className={[
        'login__panel',
        prehidden ? 'login__panel--prehidden' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!visible}
    >
      <h1 className="welcome__title">Login</h1>

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
          tabIndex={visible ? 0 : -1}
        />
        <input
          className="login__field"
          type="password"
          name="password"
          autoComplete="current-password"
          aria-label="Password"
          tabIndex={visible ? 0 : -1}
        />
      </form>

      <PrimaryButton type="submit" form="login-form" tabIndex={visible ? 0 : -1}>
        Enter
      </PrimaryButton>

      <button
        type="button"
        className="login__link"
        onClick={onRegistration}
        tabIndex={visible ? 0 : -1}
      >
        Registration
      </button>
    </div>
  )
}
