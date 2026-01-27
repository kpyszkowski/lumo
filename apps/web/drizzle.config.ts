import { defineConfig } from 'drizzle-kit'

const url = process.env.DATABASE_URL

if (!url) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

export default defineConfig({
  schema: 'src/db/schema.ts',
  out: 'migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
})
