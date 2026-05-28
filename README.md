# ToDo — React приложение

Мобильное веб-приложение: задачи, календарь, Pomodoro, time blocking, авторизация (JWT в cookies).

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте в браузере адрес из терминала (обычно http://localhost:5173).

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с HMR (Vite) |
| `npm run build` | Сборка для production |
| `npm run preview` | Просмотр production-сборки |
| `npm run lint` | ESLint |

## Документация

- [docs/TECHNICAL_SPECIFICATION.md](docs/TECHNICAL_SPECIFICATION.md) — страницы, блоки UI, бэкенд (JWT, Pomodoro)

## Структура `src/`

```
components/   # UI-компоненты
types/        # Task, User, PomodoroSettings
App.tsx       # Корневой компонент (временная заглушка)
```

## Проверка перед коммитом

```bash
npm run lint
npm run build
```
