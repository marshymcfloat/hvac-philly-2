# Template 1

Reusable Vue 3 marketing-site template based on the `frontend-base` repository contract. The template keeps its own visual design while sharing the standard runtime, routing, environment, and deployment infrastructure.

## Requirements

- Node.js 24.15.0 (`.nvmrc`)
- npm 11.6 or newer

## Development

```bash
npm ci
npm run dev
```

The site runs at `http://localhost:3000`. Copy `.env.example` to `.env` when API or deployment configuration is needed.

## Production

```bash
npm run build
npm run preview
```

Production output is written to `dist/`.

## Deployment

Pushes to `main` deploy through `.github/workflows/deploy-bunny.yml`. Configure these GitHub Actions secrets:

- `VITE_API_URL`
- `VITE_WEBSITE_HANDLE`
- `VITE_PUBLIC_API_KEY`
- `BUNNY_ACCESS_KEY`
- `BUNNY_STORAGE_ZONE`
- `BUNNY_PULL_ZONE`

## Structure

- `src/App.vue` and `src/style.css`: template-specific UI
- `src/pages/` and `src/layouts/`: route composition
- `src/router/`: public routes and central-admin redirects
- `src/utils/`: deployment recovery and shared utilities
- `src/siteConfig.js`: per-site feature defaults
- `public/`: fixed-URL static assets

Operators use `admin.anhelm.com`; this repository does not contain an admin application.
