import { headers } from 'next/headers'
import 'server-only'
import { createRouterClient, onError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin } from '@orpc/server/plugins'
import { router } from '~/rpc/router'

globalThis.$rpcClient = createRouterClient(router, {
  context: async () => ({
    headers: await headers(),
  }),
})

export const rpcHandler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})
