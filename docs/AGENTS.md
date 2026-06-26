# Polyunion QCS Development Rules

## Project

Factory Quality Control System

Polyunion QCS

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus
- Tauri 2
- Fastify
- SQLite

## UI Style

- Netflix inspired
- Dark Theme
- Glassmorphism
- Large Cards
- Touch Friendly

## Coding Rules

- Use Composition API only
- Never use Options API
- Strong TypeScript typing
- Extract reusable composables
- Keep components under 300 lines
- Use Pinia for global state
- Element Plus components first
- Use Tailwind CSS for all styling (utility classes)
- No custom CSS unless Tailwind cannot achieve the desired effect

## Layout Rules

System runs on factory touchscreens.

Requirements:

- Minimum button height: 44px
- Large font sizes
- High contrast
- No hover-only interactions
- Must support gloves operation

## Architecture

src/

  api/

  components/

  composables/

  stores/

  views/

  router/

  layouts/

## When implementing features

Always:

1. Analyze requirements first
2. Design component structure
3. Design API interfaces
4. Then generate code

Do not directly generate large files without planning.