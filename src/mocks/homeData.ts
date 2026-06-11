import type { TaskPriority } from '../types/task'

export const MOCK_USER = {
  name: 'Livia Vaccaro',
} as const

export function getUserInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed[0]!.toUpperCase() : '?'
}

export const MOCK_STATS = {
  total: 6,
  completed: 4,
  today: 15,
  week: 29,
} as const

export type TodayTask = {
  id: string
  title: string
  time: string
  priority: TaskPriority
}

export const MOCK_TODAY_TASKS_BADGE = 4

export const MOCK_TODAY_TASKS: TodayTask[] = [
  { id: '1', title: 'Market Research', time: '10:00 AM', priority: 'medium' },
  { id: '2', title: 'Competitive Analysis', time: '12:00 PM', priority: 'high' },
  { id: '3', title: 'Create Low-fidelity Wireframe', time: '07:00 PM', priority: 'low' },
]
