# Frontend Rules & Constraints (neo-frontend)

This file defines the Vue 3 / Vite 8 / TypeScript 6 frontend rules and conventions for AI agents.

## Technology Stack & Versions

* **Vite**: `^8.0.14` (Vite 8)
* **TypeScript**: `^6.0.3` (TS 6)
* **Vue**: `^3.5.34` (Composition API with `<script setup lang="ts">`)
* **Tailwind CSS**: `^4.3.0` (Tailwind 4 with `@tailwindcss/vite` plugin)
* **Testing**: `vitest` with `@vue/test-utils` and `happy-dom` DOM simulation.

## Key Architecture & Constraints

### 1. Modular "Island" Architecture
* Develop frontend pages as isolated modules under `src/<module_name>/`.
* Define an `index.ts` entry point for each module that mounts the Vue application onto `#root`.
* Package modules by running:
  * `npm run build` (builds all modules) or `npm run build <module_name>` (builds specific module).
  * The script `scripts/build.js` manages this packaging flow.

### 2. External Vue Core Constraint
* **DO NOT** bundle the core `vue` package into frontend modules.
* The build template `scripts/vite-module-template.js` enforces `external: ['vue']` to share a single Vue instance at runtime via the backend's Import Map.

### 3. Tailwind CSS 4 Styling
* **DO NOT** modify `tailwind.config.js` or `postcss.config.js`.
* Define custom colors, fonts, or themes via `@theme` directives inside `src/base-style.css` or the module's `style.css`.
  Example:
  ```css
  @theme {
    --color-primary: #1e40af;
  }
  ```

### 4. Mandatory Type & Test Sensors
* Verify TypeScript types and Vue SFC files by running: `npm run typecheck`
* Verify unit tests succeed by running: `npm run test`
* Place test files next to the Vue components they test (e.g., `Home.test.ts` next to `Home.vue`).

### 5. Security Boundaries (CRITICAL)
* **ABSOLUTELY FORBIDDEN**: Do not read or modify `.env` files, `appsettings*.json`, or IDE configuration files (`launch.json`, `.vscode/*`).
* Request environment credentials directly from the user.
