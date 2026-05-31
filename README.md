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
- [design/task-sync.fig](design/task-sync.fig) — макет Figma (экспорты экранов → `design/screens/`)

## Структура проекта

```
public/              # Статика (navbar/, loginAndRegister/, favicon.svg)
src/
  types/             # Task, User, PomodoroSettings (в user.ts)
  App.tsx            # Корневой компонент (заглушка)
  App.css, index.css
design/              # Макет Figma (см. design/README.md)
docs/                # Техническое задание
```

Папку `src/components/` можно добавить по мере вёрстки экранов.

## Проверка перед коммитом

```bash
npm run lint
npm run build
```
