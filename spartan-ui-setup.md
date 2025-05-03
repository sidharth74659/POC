# Spartan UI Setup and Troubleshooting

## Issue
The Spartan UI components (specifically the accordion) aren't rendering properly in the application.

## Root Causes

1. Tailwind CSS configuration is not properly including the Spartan UI preset
2. Icon packages are not properly configured
3. The Angular application is not configured to use Tailwind properly

## Solutions Applied

### 1. Fix Tailwind CSS Configuration

- Uncommented the Spartan UI preset import in `src/styles.scss`:
  ```scss
  @import '@angular/cdk/overlay-prebuilt.css';
  @import '@spartan-ng/brain/hlm-tailwind-preset';
  ```

- Updated Angular configuration in `angular.json` to properly process Tailwind:
  ```json
  "options": {
    "stylePreprocessorOptions": {
      "includePaths": ["node_modules"]
    },
    "tailwindConfig": "./tailwind.config.js"
  }
  ```

### 2. Fix Icon Package Configuration

- Added icon configuration to app.config.ts:
  ```typescript
  import { provideIcons } from '@ng-icons/core';
  import { lucideChevronDown } from '@ng-icons/lucide';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideIcons({ lucideChevronDown })
    ]
  };
  ```

## Project Structure Notes

This project uses a monorepo structure with local libraries:
- Spartan UI components are located in `libs/ui/*-helm/` folders
- Path mappings in `tsconfig.json` make these accessible via import statements like `@spartan-ng/ui-accordion-helm`

## Running the Application

After applying these fixes, run the application with:

```bash
ng serve
```

The accordion component should now render properly with the correct styling and icons.

## Additional Resources

- [Spartan UI Documentation](https://spartan.ng/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Angular Documentation](https://angular.dev/) 