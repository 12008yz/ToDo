export interface User {
  id: string
  name: string
  email: string
}

export interface PomodoroSettings {
  workoutInterval: number
  breakInterval: number
  intervalCount: number
}
