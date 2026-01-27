import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { RPC_URL } from '~/rpc/config'
import type { RPCClient } from '~/rpc/contract'

declare global {
  var $rpcClient: RPCClient | undefined
}

const link = new RPCLink({
  url: () => {
    if (typeof window === 'undefined') {
      throw new Error('RPCLink is not allowed on the server side.')
    }

    return new URL(RPC_URL, window.location.origin)
  },
  headers: async () => {
    if (typeof window !== 'undefined') {
      return {}
    }

    const { headers } = await import('next/headers')
    return await headers()
  },
})

/**
 * RPC Client instance
 * @dev Fallback to client-side client if server-side client is not available.
 */
export const rpcClient: RPCClient =
  globalThis.$rpcClient ?? createORPCClient(link)

/**
 * Tanstack Query utils for RPC client
 * @dev That's the go-to way to consume RPC in React components
 */
export const rpc = createTanstackQueryUtils(rpcClient)
