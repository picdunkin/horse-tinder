# Horse Tinder

Horse Tinder is a Next.js 16 app with a clean-architecture layout for auth,
dating, matching, messaging, and video calls.

## Architecture

The codebase is split into five layers:

- `app/` and `components/`: framework-facing UI and thin server-function entrypoints.
- `src/interface-adapters/`: controllers and UI-safe view models.
- `src/application/`: repository and service contracts plus use cases.
- `src/entities/`: domain models, schemas, and domain errors.
- `src/infrastructure/`: Supabase and Stream implementations.

Dependency direction is enforced in `eslint.config.mjs` with restricted import
rules.

## Feature entrypoints

- `app/actions.ts`: profile, discovery, matches, messaging, and video-call actions.
- `app/(auth)/actions.ts`: sign-in, sign-up, sign-out, session lookup, and email confirmation.

The old `lib/actions/*`, `lib/supabase/*`, and client-side auth context were
removed as part of the migration.

## Tests

Unit tests live under `tests/unit/` and cover:

- entity preference helpers
- discovery feed filtering
- profile update validation
- mutual-like to match creation
- match-gated messaging and calling
- controller error mapping

Run them with:

```bash
npm test
```

If your environment uses Bun instead of npm, the same script is available via
the package manifest.
