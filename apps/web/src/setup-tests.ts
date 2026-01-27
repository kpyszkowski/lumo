/* eslint-disable @typescript-eslint/no-require-imports */
import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { afterAll, beforeAll, vi } from 'vitest'

const { client, dbInstance } = vi.hoisted(() => {
  // Dynamically import PGlite to avoid hoisting issues
  const { PGlite } = require('@electric-sql/pglite')
  const { drizzle } = require('drizzle-orm/pglite')
  const schema = import('~/db/schema').then((module) => module)

  const client = new PGlite()
  const dbInstance = drizzle(client, { schema })

  return { client, dbInstance }
})

vi.mock('~/db/db', async () => ({ db: () => dbInstance, client }))

import { db } from '~/db/db'

beforeAll(async () => {
  await migrate(db(), { migrationsFolder: 'migrations' })
})

afterAll(async () => {
  await db().execute(sql`drop schema if exists public cascade`)
  await db().execute(sql`create schema public`)
  await db().execute(sql`drop schema if exists drizzle cascade`)
  client.close()
})
