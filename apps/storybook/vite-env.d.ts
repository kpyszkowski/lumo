/// <reference types="vite/client" />
/// <reference types="@vitest/browser-playwright" />

interface ImportMetaEnv {
  readonly STORYBOOK_FIGMA_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
