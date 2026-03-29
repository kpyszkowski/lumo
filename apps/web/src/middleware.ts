import createMiddleware from 'next-intl/middleware'
import { routing } from '~/lib/internationalization/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
