import { WelcomeLayout } from '../../components/WelcomeLayout'
import { PrimaryButton } from '../../components/PrimaryButton'

type OnboardingPageProps = {
  onStart?: () => void
}

export function OnboardingPage({ onStart }: OnboardingPageProps) {
  return (
    <WelcomeLayout>
      <h1 className="welcome__title">Task Sync</h1>
      <p className="welcome__description">
        <span className="welcome__description-line">
          This productive tool is designed to help
        </span>
        <span className="welcome__description-line">
          you better manage your task
        </span>
        <span className="welcome__description-line">
          project-wise conveniently!
        </span>
      </p>

      <PrimaryButton onClick={onStart}>Let&apos;s Start</PrimaryButton>
    </WelcomeLayout>
  )
}
