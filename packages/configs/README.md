# @lumo/configs

Package with shareable configuration files for tooling used throughout the
codebase featuring:

- ESLint
- Prettier
- TypeScript
- Vitest

## Installation

```sh
pnpm add -D @lumo/configs eslint prettier typescript
```

Particular plugins and configs described below are listed as regular
dependencies so it's all embedded into the package. No need to install anything
manually for ease of use. Only core tools are peer dependencies for obvious
reasons.

## Overview

### Typescript

Example of Typescript configuration:

```jsonc
{
  "extends": "@lumo/configs/tsconfig/base.json",
  "compilerOptions": {
    // project specific overrides goes here
  },
  "include": ["src"], // important to include it, base configuration doesn't do it
  "exclude": ["node_modules", "dist"] // also important to exclude particular directories
}
```

Typescript is configured to used possibly latest flavour of ECMAScript.
There is a path alias defined which is applicable to every application/package
in the repository. The tilde (`~`) always points to the `src` directory.

> [!important]
>
> This rule assumes that each application/package has `src` directory.

> [!note]
>
> The choice of tilde (`~`) was inspired by Unix like operation systems where tilde
> points to user's root directory. Also it doesn't collide with at symbol (`@`)
> which is a prefix of organization scoped packages which might lead to
> confusions.

### ESLint

Example of ESLint configuration in package which uses React:

```ts
import baseConfig from '@lumo/configs/eslint/base.js'
import reactConfig from '@lumo/configs/eslint/react.js'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...baseConfig,
  ...reactConfig,
  {
    // Other rules
  },
])
```

ESLint aggregates configs and plugins recommended by creators of used tools so:

- `eslint-plugin-turbo`
- `@next/eslint-plugin-next`
- `eslint-plugin-storybook`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`

Also it's integrated with Prettier. ESLint respects it's rules and throws
proper warnings:

- `eslint-config-prettier`
- `eslint-plugin-prettier`

Particular plugins were used to enforce code style guide:

- `eslint-plugin-check-file`
  Enforces file naming convention: _kebab-case_ for `*.ts` and `*.tsx` files.
- `eslint-plugin-only-warn`
  Each ESLint error occurs as warning. It is Turborepo's default. Such rule
  forces us to give up the "warning is not error" mindset. The `lint` script
  will fail when there is at least one warning.
- `eslint-plugin-path-alias`
  Plugin resolves `paths` of `tsconfig.json` and lints imports accordingly to
  defined paths.

Finally there was a custom ESLint plugin prepared to enforce React components
props destructuring pattern.

#### Purpose

Prevent destructuring props in component parameters.
Ensures that all props are passed as a single object (props) and destructured inside the component body.

Require destructuring props as the first line in the component body.
Improves consistency and readability across all React components, including those using forwardRef.

#### Rules

1. `react-props/no-destructure-in-params`

   Disallows destructuring props in the function signature of React components.
   Works for function components and forwardRef.

   Example:

   ```ts
   // ❌ BAD
   const Input = forwardRef<HTMLInputElement, InputProps>(({ className }, ref) => { ... })
   
   // ✅ GOOD
   const Input = (props: InputProps) => {
     // ...
   }
   ```

2. `react-props/must-destructure-first`

   Requires that the first line of a component body destructures props.

   Example:

   ```ts
   // ❌ BAD
   const Button = (props: ButtonProps) => {
     console.log('debug')
     const { onClick } = props
   }
   
   // ✅ GOOD
   const Button = (props: ButtonProps) => {
     const { className, onClick } = props
     // rest of the component
   }
   ```

### Prettier

Prettier is fully managed by ESLint. There is no need to define Prettier config
per application/package. It is already baked into the ESLint base config.

Configuration contains a set of standard rules such as:

- 2 spaces of indentation
- no semi colons
- single quotes
- max one JSX attribute per line
etc.

Also there is Tailwind plugin configured. It sorts utility classes by [predefined
set of rules](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier).

### Vitest

TODO

## Contribution

Feel free to create issues and/or pull requests if you'd like to change or
improve anything. These configurations are here to make us more performant.
If you don't like or fight with something - just say ☺️
