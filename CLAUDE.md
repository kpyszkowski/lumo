# Lumo

See [agent-instructions/](agent-instructions/index.md) for full codebase context — monorepo structure, styling, TypeScript conventions, animations, Storybook, and Next.js patterns.

## Quick Reference

| Topic | File |
|-------|------|
| Monorepo, scripts, build | [agent-instructions/monorepo.md](agent-instructions/monorepo.md) |
| UI component authoring | `packages/ui/CLAUDE.md` (auto-loaded in that package) |
| Component examples & context patterns | [agent-instructions/ui-components.md](agent-instructions/ui-components.md) |
| Styling, theme tokens, Tailwind v4 | [agent-instructions/styling.md](agent-instructions/styling.md) |
| `@base-ui/react` patterns & gotchas | [agent-instructions/base-ui-patterns.md](agent-instructions/base-ui-patterns.md) |
| `motion/react` animations | [agent-instructions/animation.md](agent-instructions/animation.md) |
| TypeScript conventions | [agent-instructions/typescript.md](agent-instructions/typescript.md) |
| Storybook stories | [agent-instructions/storybook.md](agent-instructions/storybook.md) |
| Next.js app (apps/web) | [agent-instructions/nextjs.md](agent-instructions/nextjs.md) |
| Scraper & filter pipeline (`apps/scraper`) | [agent-instructions/scraper.md](agent-instructions/scraper.md) |

## Before Writing Any Code

1. Fetch live docs via the `context7` MCP server for `@base-ui/react`, `tailwind-variants`, or `motion/react`.
2. Use semantic theme tokens only — never raw colours. See [styling.md](agent-instructions/styling.md).
3. Named exports only — `export default` is never used.
