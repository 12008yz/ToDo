import type { CSSProperties, ReactNode } from 'react'
import './WelcomeLayout.css'

const ILLUSTRATIONS = {
  female: '/loginAndRegister/female-sitting-with-laptop.png',
  vase: '/loginAndRegister/vase-tulips-glasses-pencil.png',
  stopwatch: '/loginAndRegister/blue-stopwatch-pink-arrow.png',
  notifications: '/loginAndRegister/multicolored-smartphone-notifications.png',
  pieChart: '/loginAndRegister/pie-chart.png',
  coffee: '/loginAndRegister/pink-coffee-cup-close-up.png',
  calendar: '/loginAndRegister/blue-desk-calendar.png',
} as const

export type IconTransition = 'idle' | 'exit-up' | 'enter-from-bottom'

type WelcomeLayoutProps = {
  children: ReactNode
  variant?: 'default' | 'login'
  iconTransition?: IconTransition
  contentHidden?: boolean
}

function itemStyle(index: number): CSSProperties {
  return { '--item-index': index } as CSSProperties
}

export function WelcomeLayout({
  children,
  variant = 'default',
  iconTransition = 'idle',
  contentHidden = false,
}: WelcomeLayoutProps) {
  const sceneClassName = [
    'welcome__scene',
    iconTransition === 'exit-up' ? 'welcome__scene--icons-exit' : '',
    iconTransition === 'enter-from-bottom' ? 'welcome__scene--icons-enter' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const contentClassName = [
    'welcome__content',
    contentHidden ? 'welcome__content--hidden' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`welcome${variant === 'login' ? ' welcome--login' : ''}`}>
      <svg className="welcome__svg-defs" aria-hidden="true" width="0" height="0">
        <defs>
          <clipPath id="welcome-button-shape" clipPathUnits="objectBoundingBox">
            <path d="M 0 0.2692 A 0.0423 0.2692 0 0 1 0.0423 0.0769 Q 0.5 0 0.9577 0.0769 A 0.0423 0.2692 0 0 1 1 0.2692 L 1 0.7308 A 0.0423 0.2692 0 0 1 0.9577 0.9231 Q 0.5 1 0.0423 0.9231 A 0.0423 0.2692 0 0 1 0 0.7308 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="welcome__blobs" aria-hidden="true">
        <span className="welcome__blob welcome__blob--green" />
        <span className="welcome__blob welcome__blob--yellow-top" />
        <span className="welcome__blob welcome__blob--blue-right" />
        <span className="welcome__blob welcome__blob--cyan" />
        <span className="welcome__blob welcome__blob--yellow-bottom" />
      </div>

      <div className="welcome__hero">
        <div className={sceneClassName} aria-hidden="true">
          <img
            className="welcome__illustration welcome__scene-item welcome__illustration--stopwatch"
            style={itemStyle(0)}
            src={ILLUSTRATIONS.stopwatch}
            width={40}
            height={50}
            decoding="async"
            alt=""
          />
          <span
            className="welcome__dot welcome__dot--8 welcome__dot--blue welcome__scene-item"
            style={itemStyle(1)}
          />
          <span
            className="welcome__dot welcome__dot--4 welcome__dot--purple welcome__scene-item"
            style={itemStyle(2)}
          />
          <img
            className="welcome__illustration welcome__scene-item welcome__illustration--calendar"
            style={itemStyle(3)}
            src={ILLUSTRATIONS.calendar}
            width={31}
            height={28}
            decoding="async"
            alt=""
          />
          <img
            className="welcome__illustration welcome__scene-item welcome__illustration--pie"
            style={itemStyle(4)}
            src={ILLUSTRATIONS.pieChart}
            width={26}
            height={26}
            decoding="async"
            alt=""
          />
          <img
            className="welcome__illustration welcome__scene-item welcome__illustration--notifications"
            style={itemStyle(5)}
            src={ILLUSTRATIONS.notifications}
            width={62}
            height={42}
            decoding="async"
            alt=""
          />
          <img
            className="welcome__illustration welcome__illustration--female"
            src={ILLUSTRATIONS.female}
            width={159}
            height={184}
            decoding="async"
            fetchPriority="high"
            alt=""
          />
          <img
            className="welcome__illustration welcome__scene-item welcome__illustration--vase"
            style={itemStyle(6)}
            src={ILLUSTRATIONS.vase}
            width={36}
            height={52}
            decoding="async"
            alt=""
          />
          <img
            className="welcome__illustration welcome__scene-item welcome__illustration--coffee"
            style={itemStyle(7)}
            src={ILLUSTRATIONS.coffee}
            width={18}
            height={22}
            decoding="async"
            alt=""
          />
          <span
            className="welcome__dot welcome__dot--4 welcome__dot--green welcome__scene-item"
            style={itemStyle(8)}
          />
          <span
            className="welcome__dot welcome__dot--8 welcome__dot--yellow welcome__scene-item"
            style={itemStyle(9)}
          />
          <span
            className="welcome__dot welcome__dot--8 welcome__dot--pink welcome__scene-item"
            style={itemStyle(10)}
          />
          <span
            className="welcome__dot welcome__dot--4 welcome__dot--sky welcome__scene-item"
            style={itemStyle(11)}
          />
        </div>
      </div>

      <div className={contentClassName}>{children}</div>
    </div>
  )
}
