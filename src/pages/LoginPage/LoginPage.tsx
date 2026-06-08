import { PrimaryButton } from '../../components/PrimaryButton'
import { useLoginPanelEnterAnimation } from './useLoginPanelEnterAnimation'
import './LoginPage.css'

type LoginPageProps = {
  showContent?: boolean
  onRegistration?: () => void
}

export function LoginPage({ showContent = true, onRegistration }: LoginPageProps) {
  const { visible, interactive, onTransitionEnd } =
    useLoginPanelEnterAnimation(showContent)

  return (
    <div
      className={[
        'login__panel',
        visible ? 'login__panel--visible' : '',
        interactive ? 'login__panel--interactive' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!interactive}
      onTransitionEnd={onTransitionEnd}
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
          tabIndex={interactive ? 0 : -1}
        />
        <input
          className="login__field"
          type="password"
          name="password"
          autoComplete="current-password"
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
