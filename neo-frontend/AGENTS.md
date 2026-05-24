# Frontend Rules & Constraints (neo-frontend)

This folder contains the modern Vue 3 + Vite 8 + TypeScript 6 frontend workspace. As an AI coding agent, you must strictly follow these rules when developing in this directory.

## Technology Stack & Versions

- **Vite**: `^8.0.14` (Vite 8)
- **TypeScript**: `^6.0.3` (TS 6)
- **Vue**: `^3.5.34` (Vue 3.5 Composition API with `<script setup lang="ts">`)
- **Tailwind CSS**: `^4.3.0` (Tailwind 4 with `@tailwindcss/vite` plugin)
- **Test Pipeline**: `vitest` with `@vue/test-utils` and `happy-dom` DOM simulation environment.

## Key Architecture & Constraints

### 1. Modular "Island" Architecture
- Frontend pages are developed as isolated modules under `src/<module_name>/`.
- Each module **MUST** have an `index.ts` entry point that creates and mounts a Vue application onto `#root`.
- Modules are compiled and packaged into the backend's static directory by running:
  - `npm run build` (builds all modules) or `npm run build <module_name>` (builds specific module).
  - The script `scripts/build.js` manages this packaging flow.

### 2. External Vue Core Constraint
- **DO NOT** bundle the core `vue` package into your frontend modules.
- The build template `scripts/vite-module-template.js` enforces `external: ['vue']` to ensure all modules share a single Vue instance provided via the backend's Import Map at runtime.

### 3. Tailwind CSS 4 Styling Rules
- **DO NOT** edit `tailwind.config.js` or `postcss.config.js` to modify the theme or add utilities. Tailwind 4 is configured in this project.
- Custom colors, fonts, or themes must be configured using standard CSS `@theme` directives inside `src/base-style.css` or the module's `style.css`.
  Example:
  ```css
  @theme {
    --color-primary: #1e40af;
  }
  ```

### 4. Mandatory Type & Test Sensors
Before claiming a task is complete, you **MUST** run the validation pipeline:
- **Typecheck**: Run `npm run typecheck` to verify TypeScript type definitions and Vue SFC files.
- **Unit Tests**: Run `npm run test` to verify Vitest tests succeed. Write spec files alongside Vue components (e.g., `Home.test.ts` next to `Home.vue`).

### 5. Security & Sensitive Configurations Boundary (CRITICAL)
- **ABSOLUTELY FORBIDDEN**: You **MUST NOT** read or modify any `.env` files (e.g., `.env`, `.env.local`), `appsettings.json` (including `appsettings.Development.json`), or IDE/VS Code launch configs such as `launch.json` or `.vscode/launch.json`.
- These configuration files contain secrets, server URLs, database strings, and startup variables, and are strictly restricted from AI agent access. If you need any credentials, environment parameters, or database connections to fulfill a task, you **MUST** request them directly from the human developer.
