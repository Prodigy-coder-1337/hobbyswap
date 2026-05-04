# Local Verification Guide

Use this when a verification report says:

> `git diff --check passed, and JSON assets parse correctly. I could not run npm run check or npm run build because this workspace has no npm, yarn, pnpm, or node_modules available locally. No deploy was run.`

That message means the code diff and JSON files look valid, but the project could not run TypeScript or Vite because the local JavaScript toolchain is missing.

## What To Fix

1. Install a real Node.js toolchain that includes `node` and `npm`.

   Recommended options:

   - `nvm`: install Node LTS, then run `nvm use --lts`.
   - Homebrew on macOS: run `brew install node`.
   - Official installer: download Node.js LTS from `nodejs.org`.

2. Confirm the commands exist.

   ```bash
   node -v
   npm -v
   ```

3. Install the locked dependencies.

   ```bash
   npm ci
   ```

   Use `npm ci` instead of `npm install` when `package-lock.json` is already committed. It recreates `node_modules` exactly from the lockfile.

4. Run the project checks.

   ```bash
   npm run check
   npm run build
   ```

5. If both pass, run the app locally.

   ```bash
   npm run dev
   ```

## Common Causes

- `node` exists but `npm` does not. This can happen when using an embedded runtime from an editor or desktop app. Install Node LTS normally so `npm` is on your shell `PATH`.
- `node_modules` is missing. Run `npm ci`.
- The shell cannot find the newly installed tools. Close and reopen the terminal, then rerun `node -v` and `npm -v`.
- `npm ci` fails because the lockfile is stale. Run `npm install`, commit the updated `package-lock.json`, then rerun `npm run check` and `npm run build`.

## Vercel Safety Note

This repo is live on Vercel, so do not deploy just because local checks pass. Treat deployment as a separate action:

```bash
npm run check
npm run build
```

Then deploy through the normal Vercel/GitHub flow only when the update is ready to ship.
