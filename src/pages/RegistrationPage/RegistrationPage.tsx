import type { PanelVisualState } from '../../components/AuthPanels'
import { PrimaryButton } from '../../components/PrimaryButton'
import '../LoginPage/LoginPage.css'

type RegistrationPageProps = {
  showContent?: boolean
  panelState?: PanelVisualState
  exitActive?: boolean
  onLogin?: () => void
}

export function RegistrationPage({
  showContent = true,
  panelState = 'visible',
  exitActive = false,
  onLogin,
}: RegistrationPageProps) {
  const interactive = showContent && panelState === 'visible'

  const panelClassName = [
    'login__panel',
    panelState === 'inactive' ? 'login__panel--inactive' : '',
    panelState === 'exiting' ? 'login__panel--exiting' : '',
    panelState === 'exiting' && exitActive ? 'login__panel--exit-active' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={panelClassName} aria-hidden={!interactive}>
      <h1 className="welcome__title">Registration</h1>

      <form
        id="registration-form"
        className="login__fields"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          className="login__field"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          tabIndex={interactive ? 0 : -1}
        />
        <input
          className="login__field"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          aria-label="Password"
          tabIndex={interactive ? 0 : -1}
        />
      </form>

      <PrimaryButton type="submit" form="registration-form" tabIndex={interactive ? 0 : -1}>
        Enter
      </PrimaryButton>

      <button
        type="button"
        className="login__link"
        onClick={onLogin}
        tabIndex={interactive ? 0 : -1}
      >
        Login
      </button>
    </div>
  )
}
