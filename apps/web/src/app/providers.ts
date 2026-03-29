import { ThemeProvider } from 'next-themes'
import { NextIntlClientProvider } from 'next-intl'
import {
  type ComponentProps,
  type ComponentType,
  createElement,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import { RPCProvider } from '~/rpc/provider'

type Providers<P extends readonly ComponentType[]> = {
  [K in keyof P]: {
    provider: P[K]
    props?: ComponentProps<P[K]>
  }
}

/**
 * Compose multiple providers around children
 *
 * @param children Children node
 * @param providers Array of providers with optional props
 *
 * @returns Composed providers wrapping the children
 */
const composeProviders = <P extends readonly ComponentType[]>(
  children: ReactNode,
  providers: Providers<P>,
) => {
  return (
    providers as { provider: ComponentType; props?: unknown }[]
  ).reduceRight(
    (acc: ReactNode, { provider, props }) =>
      createElement(provider as ComponentType, props ?? {}, acc),
    children,
  )
}

export function Providers(props: PropsWithChildren) {
  const { children } = props

  return composeProviders(children, [
    {
      provider: ThemeProvider,
      props: {
        attribute: 'data-theme',
      },
    },
    {
      provider: NextIntlClientProvider as ComponentType,
    },
    {
      provider: RPCProvider,
    },
  ])
}
