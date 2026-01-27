import { RPC_URL } from '~/rpc/config'
import { RPCError } from '~/rpc/error'
import { rpcHandler } from '~/rpc/server'

const handleRequest = async (request: Request): Promise<Response> => {
  const { matched, response } = await rpcHandler.handle(request, {
    prefix: RPC_URL,
  })

  if (!matched) {
    const { message, status } = new RPCError('NOT_FOUND')
    return new Response(message, { status })
  }

  return response
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
