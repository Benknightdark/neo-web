# Gemini Context for Neo-Web

This file documents the architecture, development workflow, and conventions for the `neo-web` project. It is intended to guide AI agents in understanding and working with the codebase.

## Project Overview

`neo-web` is a decoupled full-stack web application combining a **.NET 10.0 Web API** backend with a modern frontend built using **Vite 6** and **Vue 3**, deployed via **Azure Static Web Apps (SWA) CLI** in a Docker Compose environment.

* **Backend**: ASP.NET Core Web API (running on .NET 10.0). Acts purely as an API server.
* **Frontend**: A modular frontend architecture where pages/features are developed as independent modules (using Vue) and bundled into the `neo-frontend/deploy` directory.
* **Hosting & Proxy**: The frontend is served and requests to `/api` are proxied to the backend via Azure Static Web Apps (SWA) CLI.
* **Styling**: Tailwind CSS is used for styling.

## Directory Structure

```text
neo-web/
├── neo-web.sln                 # .NET Solution file
├── docker-compose.yml          # Production orchestration
├── neo-backend/                # ASP.NET Core Backend (Pure API)
│   ├── Controllers/            # API Controllers
│   ├── Program.cs              # API entry point & CORS configuration
│   ├── Dockerfile              # Backend build recipe
│   └── neo-backend.csproj      # Targets .NET 10.0
└── neo-frontend/               # Frontend Source
    ├── src/                    # Source modules
    │   ├── home/               # 'home' module (Vue entry / portal)
    │   ├── introduction/       # 'introduction' module
    │   └── privacy/            # 'privacy' module
    ├── deploy/                 # Compiled static assets (production output target)
    │   ├── staticwebapp.config.json # SWA routing rules (e.g. '/' redirect to '/home/')
    │   └── swa-cli.config.json # SWA CLI local emulator settings (local-deploy/container-deploy)
    ├── scripts/                # Custom build scripts
    │   └── build.js            # Build script outputting modules to deploy/
    ├── package.json            # Node dependencies and scripts
    ├── Dockerfile              # Frontend multi-stage build & SWA CLI runner
    └── vite.config.ts          # Base Vite configuration
```

## Development Workflow

### Prerequisites

* **.NET SDK**: 10.0 or higher.
* **Node.js**: v20.0.0 or higher.

### Local Development

1. **Backend**: Start the API server manually:
   ```bash
   cd neo-backend
   dotnet run
   ```
   * The API server runs at `http://localhost:5058` (CORS is configured to accept requests from frontend dev servers).
2. **Frontend**: Build frontend modules:
   ```bash
   cd neo-frontend
   npm run build
   ```
   * SWA Config: Start the SWA CLI emulator pointing to the compiled files and proxying to the local API:
   ```bash
   cd neo-frontend/deploy
   npx swa start local-deploy
   ```
   * Visit: `http://localhost:4280/` to test. SWA will automatically proxy `/api/*` to the backend on `localhost:5058`.

### Production Deployment (Docker Compose)

The entire solution is orchestrated via Docker Compose:
```bash
docker-compose up --build -d
```
* The frontend uses a multi-stage Dockerfile that runs `npm run build` internally and launches the SWA CLI on port `4280` (mapped to host port `8080`).
* API proxying is handled internally in the docker network via the SWA CLI `container-deploy` configuration pointing to `http://neo-backend:5000`.

## Key Files

* `docker-compose.yml`: Defines orchestration for backend and frontend services.
* `neo-backend/Program.cs`: Sets up Web API and CORS policy.
* `neo-frontend/Dockerfile`: Multi-stage Docker build running frontend compilation and SWA CLI.
* `neo-frontend/deploy/swa-cli.config.json`: **CRITICAL**. SWA CLI settings file containing `"container-deploy"` and `"local-deploy"` configurations. Do not delete.
* `neo-frontend/deploy/staticwebapp.config.json`: **CRITICAL**. Routing configuration setting redirection rules.
* `neo-frontend/scripts/build.js`: Handles frontend module compilation and copies artifacts to `deploy/`.

## Critical AI Agent Rules & Constraints (Agent Harness)

### 1. Front-End Type Verification (Feedback Sensor)

Before claiming a task is complete, you **MUST** run type-checking:
* Run `npm run typecheck` inside `neo-frontend/` to verify TypeScript and Vue SFC types.

### 2. Tailwind CSS 4 Styling Conventions

* **DO NOT** edit `tailwind.config.js` or `postcss.config.js` to modify the theme or add utilities. Tailwind 4 is configured in this project.
* Custom colors, fonts, or themes must be configured using standard CSS `@theme` directives inside `neo-frontend/src/base-style.css` or the module's `style.css`.

### 3. External Dependencies & Vue ESM Boundaries

* **DO NOT** bundle the core `vue` package into your frontend modules.
* The build template `scripts/vite-module-template.js` enforces `external: ['vue']` to share a single Vue instance at runtime.
* The Vue shared library `vue.esm-browser.min.js` is placed in `deploy/lib/vue3/` during build time.

### 4. Separated Frontend Routing & SWA CLI Redirection

* The frontend operates independently from the backend.
* Redirection of `/` (homepage) to `/home/` is handled by `staticwebapp.config.json` rules and a fallback jump script.
* Ensure any links between modules use root-relative paths (e.g. `/privacy/` or `/introduction/`).

### 5. Security & Sensitive Configurations Boundary (CRITICAL)

* **ABSOLUTELY FORBIDDEN**: You **MUST NOT** read or modify any `.env` files (e.g., `.env`, `.env.local`), `appsettings.json` (including `appsettings.Development.json`), or IDE/VS Code launch configs such as `launch.json` or `.vscode/launch.json`.
* If you need environment credentials, request them directly from the human developer.

### 6. Git Message

* All git messages must be in Taiwanese .
