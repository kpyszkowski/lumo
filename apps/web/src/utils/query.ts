import type { UseMutationResult } from '@tanstack/react-query'

type RenameMutationFunctions<
  TData,
  TError,
  TVariables,
  TContext,
  TName extends string,
> = Omit<
  UseMutationResult<TData, TError, TVariables, TContext>,
  'mutate' | 'mutateAsync'
> & {
  [K in TName]: UseMutationResult<TData, TError, TVariables, TContext>['mutate']
} & {
  [K in `${TName}Async`]: UseMutationResult<
    TData,
    TError,
    TVariables,
    TContext
  >['mutateAsync']
}

/**
 * Renames mutate and mutateAsync to custom names.
 *
 * @param mutation Mutation object from useMutation.
 * @param name Target base name for mutate functions (e.g. "calculate").
 *
 * @returns Mutation object with renamed methods.
 *
 * @example
 * const addMutation = useMutation(...);
 * const renamed = renameMutate(addMutation, 'doIt');
 * renamed.doIt(...); // calls mutate
 * renamed.doItAsync(...); // calls mutateAsync
 */
export const renameMutate = <
  TData,
  TError,
  TVariables,
  TContext,
  TName extends string,
>(
  mutation: UseMutationResult<TData, TError, TVariables, TContext>,
  name: TName,
) => {
  const { mutate, mutateAsync, ...rest } = mutation

  const result = {
    ...rest,
    [name]: mutate,
    [`${name}Async`]: mutateAsync,
  }

  return result as RenameMutationFunctions<
    TData,
    TError,
    TVariables,
    TContext,
    TName
  >
}

/**
 * Creates a function to rename mutate and mutateAsync to a custom name.
 * @param name Target base name for mutate functions (e.g. "calculate").
 * @returns Function that takes a mutation and returns it with renamed methods.
 * @example
 * const renameToDoIt = createRenameMutate('doIt');
 */
export const createRenameMutate = <TName extends string>(name: TName) => {
  return <TData, TError, TVariables, TContext>(
    mutation: UseMutationResult<TData, TError, TVariables, TContext>,
  ) => renameMutate(mutation, name)
}
