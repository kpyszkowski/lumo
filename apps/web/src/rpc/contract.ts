import { type ContractRouterClient, oc } from '@orpc/contract'
import { implement } from '@orpc/server'
import type { router } from '~/rpc/router'

/**
 * Alias for contract builder.
 * @see https://orpc.unnoq.com/docs/contract-first/define-contract
 */
export const contract = oc

/**
 * Alias for contract implementer.
 * @see https://orpc.unnoq.com/docs/contract-first/implement-contract
 */
export const implementContract = implement

export type RPCClient = ContractRouterClient<typeof router>
