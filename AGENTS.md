<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Local Verification Preference

For this repository, do not default to `next build` for routine verification.
Prefer:

- `./node_modules/.bin/eslint .`
- `./node_modules/.bin/tsc --noEmit`

Only run a production build when explicitly requested.
