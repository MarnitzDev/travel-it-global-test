# travel-it-global-test

GitHub Commit Explorer built with Vue 3, Vite, Pinia, and Vitest.

## Features

- Search for GitHub users and view their repositories
- Browse commits for each repository (with pagination)
- Favorite commits (persisted in local storage)
- View commit details (files changed, author, date, etc.)
- Responsive, modern UI with custom styling
- TypeScript, ESLint, and unit tests with Vitest


## Project Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. (Optional) Add a `.env` file for a GitHub API token:
   ```env
   VITE_GITHUB_TOKEN=your_github_token
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```
4. Build for production:
   ```sh
   npm run build
   ```

## Requirements

- Node.js ^20.19.0 or >=22.12.0 (recommended: Node.js 22)

## Setup

Run all unit tests:
```sh
npx vitest run
```

