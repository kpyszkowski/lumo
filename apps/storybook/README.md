# Lumo Design System

This repository contains Storybook application being a documentation for
product's design system.

General subjects such as colors, icons, typography are described in docs pages.
UI components have dedicated stories with iteractive controls, multiple variants
and Figma designs embedded.

> [!important]
>
> Figma integration is available in local enviromnments since it requires
> [Figma API token](https://developers.figma.com/docs/rest-api/authentication/#generate-a-personal-access-token).
> The token is short lived so it has to be manually rotated every 3 months. That
> is the Figma policy.

## Local development

Project setups with monorepo setup. It should be ready to go as you run `pnpm i`
at the monorepo root.

To run the Storybook application locally run:

```sh
pnpm dev
```

For Figma integration support add `.env` file following `.env.example` file.
