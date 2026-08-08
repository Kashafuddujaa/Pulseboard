// Vercel serverless entry point. The Express app itself (app.ts) is a valid
// Node request handler, so this just re-exports it — local dev still runs
// through src/index.ts (app.listen), untouched by this file.
export { app as default } from '../src/app.js'
