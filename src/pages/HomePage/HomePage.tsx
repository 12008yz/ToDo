import {
  getUserInitial,
  MOCK_STATS,
  MOCK_TODAY_TASKS,
  MOCK_USER,
  type TodayTask,
} from '../../mocks/homeData'
import type { TaskPriority } from '../../types/task'
import './HomePage.css'

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  medium: 'Medium',
  high: 'High',
  low: 'Low',
}

function NotificationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
        fill="#24252C"
      />
    </svg>
  )
}

function TimeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.83" fill="#AB94FF" />
      <path
        d="M7 3.5V7L9.5 8.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M7 14H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 7V21" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TaskCard({ task }: { task: TodayTask }) {
  return (
    <article className={`home__task-card home__task-card--${task.priority}`}>
      <h3 className="home__task-title">{task.title}</h3>
      <div className="home__task-meta">
        <TimeIcon />
        <span className="home__task-time">{task.time}</span>
      </div>
      <span className={`home__task-priority home__task-priority--${task.priority}`}>
        {PRIORITY_LABELS[task.priority]}
      </span>
      <span className={`home__task-indicator home__task-indicator--${task.priority}`} />
    </article>
  )
}

export function HomePage() {
  return (
    <div className="home">
      <div className="home__blobs" aria-hidden="true">
        <span className="home__blob home__blob--green" />
        <span className="home__blob home__blob--purple-left" />
        <span className="home__blob home__blob--purple-right" />
        <span className="home__blob home__blob--yellow" />
        <span className="home__blob home__blob--blue" />
        <span className="home__blob home__blob--orange" />
      </div>

      <div className="home__scroll">
        <header className="home__header">
          <div className="home__profile">
            <span className="home__avatar" aria-hidden="true">
              {getUserInitial(MOCK_USER.name)}
            </span>
            <div className="home__greeting">
              <span className="home__hello">Hello!</span>
              <span className="home__name">{MOCK_USER.name}</span>
            </div>
          </div>
          <div className="home__notification" aria-hidden="true">
            <NotificationIcon />
            <span className="home__notification-dot" />
          </div>
        </header>

        <section className="home__section" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="home__section-title">
            Statistics
          </h2>
          <div className="home__stats-grid">
            <div className="home__stat-card home__stat-card--light">
              <span className="home__stat-label">Total</span>
              <span className="home__stat-value">{MOCK_STATS.total}</span>
            </div>
            <div className="home__stat-card home__stat-card--primary">
              <span className="home__stat-label">Completed tasks</span>
              <span className="home__stat-value">{MOCK_STATS.completed}</span>
            </div>
            <div className="home__stat-card home__stat-card--primary">
              <span className="home__stat-label">Today tasks</span>
              <span className="home__stat-value">{MOCK_STATS.today}</span>
            </div>
            <div className="home__stat-card home__stat-card--light">
              <span className="home__stat-label">Week tasks</span>
              <span className="home__stat-value">{MOCK_STATS.week}</span>
            </div>
          </div>
        </section>

        <section className="home__section" aria-labelledby="tasks-heading">
          <div className="home__tasks-heading">
            <h2 id="tasks-heading" className="home__section-title">
              Today&apos;s Tasks
            </h2>
            <span className="home__tasks-count">{MOCK_TODAY_TASKS.length}</span>
          </div>
          <div className="home__tasks-list">
            {MOCK_TODAY_TASKS.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      </div>

      <nav className="home__navbar" aria-label="Main navigation">
        <div className="home__navbar-bar">
          <button type="button" className="home__nav-item home__nav-item--active" aria-label="Home">
            <img src="/navbar/Home.svg" width={24} height={24} alt="" />
          </button>
          <button type="button" className="home__nav-item" aria-label="Calendar">
            <img src="/navbar/calendar.svg" width={24} height={24} alt="" />
          </button>
          <span className="home__nav-spacer" />
          <button type="button" className="home__nav-item" aria-label="Documents">
            <img src="/navbar/todo-list.svg" width={24} height={24} alt="" />
          </button>
          <button type="button" className="home__nav-item" aria-label="Profile">
            <img src="/navbar/profile-2user.svg" width={24} height={24} alt="" />
          </button>
        </div>
        <button type="button" className="home__nav-add" aria-label="Add task">
          <AddIcon />
        </button>
      </nav>
    </div>
  )
}
