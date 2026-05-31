# Макет Figma — task-sync

| | |
|--|--|
| **Файл** | `design/task-sync.fig` |
| **Открыть** | Figma Desktop → File → Open → выбрать `task-sync.fig` |

## Для вёрстки в React

Файл `.fig` — только для Figma. Для разработки удобно экспортировать:

- **PNG/WebP** — скриншоты экранов → `design/screens/`
- **SVG** — иконки → `public/navbar/`, `public/loginAndRegister/` (имена в kebab-case)
- **Токены** — цвета, шрифты, отступы (Inspect / Dev Mode в Figma)

## Git

Размер файла ~4–5 МБ — можно коммитить в репозиторий. Чтобы не пушить на GitHub, добавьте в `.gitignore`:

```
design/*.fig
```
