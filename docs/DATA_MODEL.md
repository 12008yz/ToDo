# Модель данных (фронтенд)

Соответствует [TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md). Типы: `src/types/`.

| Сущность | Файл | Поля из ТС |
|----------|------|------------|
| Задача | `task.ts` | название, приоритет (High/Medium/Low), completed, время создания |
| Пользователь | `user.ts` | name, email (+ password только в формах) |
| Pomodoro | `user.ts` → `PomodoroSettings` | workoutInterval, breakInterval, intervalCount (секунды с бэка) |

При появлении API-контракта обновить типы по ответам бэкенда.
