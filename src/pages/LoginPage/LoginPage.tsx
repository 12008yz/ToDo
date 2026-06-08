import type { PanelVisualState } from '../../components/AuthPanels'
import { PrimaryButton } from '../../components/PrimaryButton'
import './LoginPage.css'

type LoginPageProps = {
  showContent?: boolean
  panelState?: PanelVisualState
  exitActive?: boolean
  onRegistration?: () => void
}

export function LoginPage({
  showContent = true,
  panelState = 'visible',
  exitActive = false,
  onRegistration,
}: LoginPageProps) {
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
          placeholder="Email"
          aria-label="Email"
          tabIndex={interactive ? 0 : -1}
        />
        <input
          className="login__field"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          aria-label="Password"
          tabIndex={interactive ? 0 : -1}
        />
      </form>

      <PrimaryButton type="submit" form="login-form" tabIndex={interactive ? 0 : -1}>
        Enter
      </PrimaryButton>

      <button
        type="button"
        className="login__link"
        onClick={onRegistration}
        tabIndex={interactive ? 0 : -1}
      >
        Registration
      </button>
    </div>
  )
}
