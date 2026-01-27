import { neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { cache } from 'react'
import { WebSocket } from 'ws'
import * as schema from '~/db/schema'
import env from '~/env'

/**
 * Database client instance
 * @dev Uses WebSocket client in development for better local experience
 * @dev Cached using React's `cache` to avoid multiple instances in server components
 * @see https://opennext.js.org/cloudflare/howtos/db#drizzle-orm
 * @see https://neon.com/guides/drizzle-local-vercel
 * @returns Drizzle database client
 */
export const db = cache(() => {
  const isRemoteDatabase = env.DATABASE_URL.includes('neon.tech')

  if (isRemoteDatabase) {
    neonConfig.webSocketConstructor = WebSocket
    neonConfig.poolQueryViaFetch = true
  } else {
    neonConfig.wsProxy = (host) => `${host}:5433/v1`
    neonConfig.useSecureWebSocket = false
    neonConfig.pipelineTLS = false
    neonConfig.pipelineConnect = false
  }

  const client = new Pool({ connectionString: env.DATABASE_URL })

  return drizzle({ client, schema })
})
