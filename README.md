I'll help you implement the tasks from the todo.md file while following all the specified rules and best practices. Let's start by examining the current state of the project and the tasks to be completed.

First, let me check the todo.md file to understand what needs to be done:


Read file: todo.md
Let me also check the current state of the project structure:



Ran tool
Let's start with Phase 1: Project Initialization. First, let's verify the Node.js and npm versions:



```bash
node -v && npm -v
```
Great! The Node.js and npm versions meet our requirements. Let's update the todo.md file to mark this task as complete:



```markdown:todo.md
## Phase 1: Project Initialization

### Environment Compatibility
- [x] Verify Node.js version (`node -v` >= 14)
- [x] Verify npm version (`npm -v` >= 6)

// ... existing code ...
```
Now, let's install the required Storybook dependencies:



```bash
npm install --save-dev @storybook/angular @storybook/cli @storybook/addon-essentials
```
Let's update the todo.md file to mark the dependencies installation as complete:




```markdown:todo.md
### Install Dependencies
- [x] Install Storybook packages:
  ```bash
  npm install --save-dev @storybook/angular @storybook/cli @storybook/addon-essentials
  ```

// ... existing code ...
```
Now, let's add the required scripts to package.json. First, let me check the current package.json:




Read file: package.json
Let's add the Storybook scripts to package.json:




```json:package.json
{
  "name": "storybook-ui-library",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook"
  },
// ... existing code ...
```
Let's update the todo.md file to mark the scripts addition as complete:





```markdown:todo.md
### Configure NPM Scripts
- [x] Add scripts to `package.json`:
  ```json
  "storybook": "start-storybook -p 6006",
  "build-storybook": "build-storybook"
  ```

// ... existing code ...
```
Now, let's initialize Storybook by running the initialization command:




```bash
npx storybook@latest init --type angular
```
Let's update the todo.md file to mark the Storybook initialization as complete:






```markdown:todo.md
### Scaffold Storybook
- [x] Run initialization:
  ```bash
  npx storybook@latest init --type angular
  ```

// ... existing code ...
```
Now, let's commit the initial changes. First, let's check what files have been modified:



```bash
git status
```
Let's add and commit all the changes:






```bash
git add . && git commit -m "feat: initialize Storybook with Angular support"
```
Let's update the todo.md file to mark the initial commit as complete:








```markdown:todo.md
### Commit Initial Changes
- [x] Commit `package.json`, lockfile (`package-lock.json` or `yarn.lock`), and `.storybook/` directory

// ... existing code ...
```
Now that we've completed Phase 1, let's move on to Phase 2: Configuration & Core Setup. First, let's check the current state of the `.storybook/main.ts` file:








Read file: .storybook/main.ts
Let's update the main.ts file to include the required addons and story matching pattern:









```typescript:.storybook/main.ts
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport"
  ],
  "framework": {
    "name": "@storybook/angular",
    "options": {}
  }
};
export default config;
```
Let's update the todo.md file to mark the main configuration as complete:













```markdown:todo.md
### Main Configuration
- [x] Configure `.storybook/main.js`
- [x] Add story matching pattern (`'../src/**/*.stories.@(ts|mdx)'`)
- [x] Add addons: `@storybook/addon-essentials`, `@storybook/addon-a11y`, `@storybook/addon-viewport`

// ... existing code ...
```
Now, let's check the current state of the `.storybook/preview.ts` file:
















Read file: .storybook/preview.ts
Let's update the preview.ts file to import global styles and define parameters:

















```typescript:.storybook/preview.ts
import type { Preview } from '@storybook/angular'
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
import '../src/styles.css';

setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
  },
};

export default preview;
```
Let's update the todo.md file to mark the preview setup as complete:





















```markdown:todo.md
### Preview Setup
- [x] Configure `.storybook/preview.js`
- [x] Import global styles (e.g., `'../src/styles.css'`)
- [x] Define parameters (actions matching `^on[A-Z].*`, expanded controls)

// ... existing code ...
```
Let's commit these configuration changes:























```bash
git add . && git commit -m "feat: configure Storybook with addons and preview settings"
```
Let's update the todo.md file to mark the config changes commit as complete:






























```markdown:todo.md
### Commit Config Changes
- [x] Commit `.storybook/` updated files

// ... existing code ...
```
Now that we've completed Phase 2, let's move on to Phase 3: Story Authoring. First, let's check the current state of the project structure to see where we should create our components:

































Ran tool
Let's create a new directory for our UI components:






































```bash
mkdir -p src/app/components/atoms src/app/components/molecules
```
Now, let's create the ButtonComponent. First, let's create the component file:














































```typescript:src/app/components/atoms/button/button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="'btn ' + variant"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      {{ label }}
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .primary {
      background-color: #3b82f6;
      color: white;
      border: none;
    }

    .primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .secondary {
      background-color: #e5e7eb;
      color: #1f2937;
      border: none;
    }

    .secondary:hover:not(:disabled) {
      background-color: #d1d5db;
    }
  `]
})
export class ButtonComponent {
  @Input() label = 'Button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
```
Now, let's create the story file for the ButtonComponent:






















































```typescript:src/app/components/atoms/button/button.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Atoms/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};
```


-by-step guide to integrate Storybook into an existing Angular project, covering prerequisites, installation, configuration, story authoring, addon setup, visual regression testing, CI/CD integration, hosting, and maintenance of your UI library ([blog.logrocket.com](mdc:https:/blog.logrocket.com/storybook-js-adoption-guide/?utm_source=chatgpt.com)).

## Prerequisites

- **Angular CLI project** (v12 or higher) set up and running; Storybook's Angular support leverages the Ivy pipeline introduced in Angular 9, with tighter CLI integration in Angular 12+ ([storybook.js.org](mdc:https:/storybook.js.org/blog/storybook-for-angular-12/?utm_source=chatgpt.com)).
- **Node.js** (LTS version, e.g., v14 or above) and **npm** (or **Yarn**) installed to manage dependencies ([storybook.js.org](mdc:https:/storybook.js.org/docs/get-started/frameworks/angular?utm_source=chatgpt.com)).
- Basic familiarity with TypeScript, Angular modules, and component-driven development.

## 1. Installation

### 1.1 Initialize Storybook

Run the Storybook init command in your project root to scaffold configuration files automatically:

```bash
npx storybook@latest init --type angular
```

This installs required dependencies, generates a `.storybook` folder, and updates your `package.json` with helper scripts ([angular.love](mdc:https:/angular.love/angular-storybook/?utm_source=chatgpt.com)).

### 1.2 Verify Dependencies

Ensure the following packages (minimum) are listed in `devDependencies`:

- `@storybook/angular`
- `@storybook/cli`
- `@storybook/addon-essentials`

These provide core framework support and common addons ([storybook.js.org](mdc:https:/storybook.js.org/docs/get-started/frameworks/angular?utm_source=chatgpt.com)).

## 2. Configuration

### 2.1 Configure Framework & Addons in `.storybook/main.js`

Adjust your main configuration to specify the Angular framework and addons:

```js
module.exports = {
  framework: "@storybook/angular",
  stories: ["../src/**/*.stories.@(ts|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport",
  ],
};
```

This ensures Storybook picks up Angular components, generates controls, and enables accessibility and responsive testing addons ([blog.logrocket.com](mdc:https:/blog.logrocket.com/use-storybook-framework-api/?utm_source=chatgpt.com)).

### 2.2 TypeScript & Webpack Overrides

If your project uses custom Webpack or TypeScript paths, extend `main.js`:

```js
// .storybook/main.js
module.exports = {
  // ...
  webpackFinal: async (config) => {
    // merge Angular CLI aliases or custom loaders
    return config;
  },
};
```

Use this hook to align Storybook's build with your Angular CLI setup ([storybook.js.org](mdc:https:/storybook.js.org/docs/get-started/frameworks/angular?utm_source=chatgpt.com)).

## 3. Writing Stories

### 3.1 Story Format (CSF)

Adopt the Component Story Format v3 with named exports:

```ts
// src/app/button/button.stories.ts
import { Meta, Story } from "@storybook/angular";
import { ButtonComponent } from "./button.component";

export default {
  title: "Atoms/Button",
  component: ButtonComponent,
  argTypes: { click: { action: "clicked" } },
} as Meta<ButtonComponent>;

export const Primary: Story<ButtonComponent> = (args) => ({ props: args });
Primary.args = { label: "Primary Button" };
```

This pattern cleanly separates metadata and story definitions ([storybook.js.org](mdc:https:/storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started/?utm_source=chatgpt.com)).

### 3.2 Organizing Stories

- Place `.stories.ts` files alongside their corresponding component directory (e.g., `src/app/button/button.stories.ts`) for cohesion and discoverability ([medium.com](mdc:https:/medium.com/knowledgelens/storybook-for-angular-87b22c585694?utm_source=chatgpt.com)).
- Mirror your design system structure under `src/app` in the Storybook sidebar (Atoms → Molecules → Organisms).

### 3.3 Documenting with MDX

For richer docs, create `.stories.mdx` files:

```mdx
import { Meta, Story, Props } from "@storybook/addon-docs";
import { CardComponent } from "./card.component";

<Meta title="Molecules/Card" component={CardComponent} />

# Card Component

<Props of={CardComponent} />

<Story name="Default">
  <card-component title="Hello" description="World" />
</Story>
```

MDX lets you embed Markdown, live previews, and auto-generated prop tables in one place ([medium.com](mdc:https:/medium.com/knowledgelens/storybook-for-angular-87b22c585694?utm_source=chatgpt.com)).

## 4. Addons & Testing

- **Controls & Actions**: Enable dynamic prop editing and event logging out of the box via `@storybook/addon-essentials` ([storybook.js.org](mdc:https:/storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started/?utm_source=chatgpt.com)).
- **Accessibility**: Use `@storybook/addon-a11y` to highlight ARIA issues in your stories ([storybook.js.org](mdc:https:/storybook.js.org/docs/get-started/frameworks/angular?utm_source=chatgpt.com)).
- **Viewport**: Preview different screen sizes with `@storybook/addon-viewport` ([storybook.js.org](mdc:https:/storybook.js.org/docs/get-started/frameworks/angular?utm_source=chatgpt.com)).
- **Visual Regression (Chromatic)**: Integrate Chromatic for automated UI snapshot testing and review workflows by adding the Chromatic GitHub Action and setting the `CHROMATIC_PROJECT_TOKEN` secret in your repo ([thinktecture.com](mdc:https:/www.thinktecture.com/en/angular/angular-component-visual-testing-with-storybook-and-chromatic/?utm_source=chatgpt.com)).

## 5. CI/CD Integration

Set up a pipeline step (e.g., GitHub Actions) to:

1. Install dependencies (`npm ci`).
2. Run `npm run build-storybook` to generate static assets.
3. Deploy to a Storybook hosting service (GitHub Pages, Netlify, or Chromatic) ([chromatic.com](mdc:https:/www.chromatic.com/?utm_source=chatgpt.com)).

Example GitHub Action snippet:

```yaml
- uses: actions/checkout@v3
- uses: actions/setup-node@v3
  with:
    node-version: 16
- run: npm ci
- run: npm run build-storybook
- uses: JamesIves/github-pages-deploy-action@v4
  with:
    folder: storybook-static
```

## 6. Publishing & Hosting

- **Build**: `npm run build-storybook` outputs to `storybook-static` by default ([storybook.js.org](mdc:https:/storybook.js.org/docs/get-started/frameworks/angular?utm_source=chatgpt.com)).
- **Host**: Deploy `storybook-static` to your preferred static site host:
  - **GitHub Pages** via `gh-pages` or a GitHub Action.
  - **Netlify/Vercel** by connecting your repository to automatically publish on merges to `main` ([github.com](mdc:https:/github.com/chromaui/intro-storybook-angular-template?utm_source=chatgpt.com)).
  - **Chromatic** for integrated review and versioned hosting.

## 7. Best Practices & Maintenance

- **Version Alignment**: Tag Storybook with your UI library SemVer, so consumers know which version they're viewing ([alfredo-perez.dev](mdc:https:/alfredo-perez.dev/storybook-setup-tips-for-your-angular-application?utm_source=chatgpt.com)).
- **Keep Stories Focused**: One story per use case or state; avoid monolithic page-level stories in your core library ([blog.logrocket.com](mdc:https:/blog.logrocket.com/storybook-js-adoption-guide/?utm_source=chatgpt.com)).
- **Automate Visual Tests**: Fail CI on unexpected UI diffs via Chromatic or Percy.
- **Accessibility First**: Fix critical a11y warnings before merging stories.
- **Documentation MDX**: Use `.stories.mdx` for design guidelines, code snippets, and `PropsTable` embeds.
- **Periodic Cleanup**: Remove deprecated stories when components are retired or refactored.

---

# StorybookUiLibrary

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
