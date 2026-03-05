# Lumo UI library

## How to use

1. Add the package to consumer application:

   ```sh
   cd apps/<consumer-app>
   pnpm add @lumo/ui
   ```

   > [!note]
   >
   > It is assumed that your app has Tailwind already configured

2. Add theme and register sources in your stylesheet

   Library doesn't bundle CSS itself. It should be handled by consumer
   application.

   ```css
   @import 'tailwindcss';
   @import '@lumo/ui/theme';
   @source "../node_modules/@lumo/ui";
   ```
