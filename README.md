# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@1.2.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" enhanced-img sveltekit-adapter="adapter:vercel" drizzle="database:sqlite+sqlite:libsql" better-auth="demo:password" mdsvex paraglide="languageTags:en, es+demo:yes" ai-tools="ide:claude-code,gemini,vscode+delivery:plugin+tools:mcp,svelte-code-writer,svelte-core-bestpractices,svelte-file-editor+mcpSetup:remote" experimental="features:async,remoteFunctions,forkPreloads" --install pnpm gyf-ministry
```

## Adding features

Add features to your project with `sv add`:

```sh
npx sv add
```

For example, to add Tailwind CSS:

```sh
npx sv add tailwindcss
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Under-construction deployments on Vercel

Without an external PostgreSQL `DATABASE_URL`, Vercel deployments use an in-memory
PGlite database initialized with the bundled schema and sample ministry/blog data.
This lets the unfinished site run without writing to Vercel's read-only application
filesystem. Local development still stores its database in `.local-pgdata`.

Demo data belongs to each function instance: edits, accounts, and submissions can
reset when an instance restarts and are not shared across instances or routes.
Do not use this mode for real registrations, messages, or other data you need to keep.

Before accepting real data, configure an external PostgreSQL `DATABASE_URL`, apply
the database migrations, configure production authentication secrets and the app
origin, and redeploy. The local/demo schema and seed are only applied to PGlite,
not to an external database.

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.
