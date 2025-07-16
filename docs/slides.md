---
title: Angular NPM Package Demo
subtitle: Build, Publish, and Consume a Custom Library
---

# 🚀 Project Overview

- Minimal Angular workspace with:
  - Main app
  - `form-components-lib` library
- Goal: Reusable form components, local npm packaging, style overrides, and clear documentation.

---

# 1️⃣ Workspace Setup

## Create Angular Workspace
```bash
npx @angular/cli new form-demo-workspace --create-application=true --style=scss
```

## Generate Library
```bash
ng generate library form-components-lib --style=scss
```

---

# 2️⃣ Library: Components & Styles

## Add Form Components
- `form-input`, `form-textarea`, `form-select`, `form-submit`

```bash
ng generate component form-input --project=form-components-lib
# Repeat for other components
```

## Shared & Global Styles
- Create `_form-control.scss` for shared styles
- Use global SCSS variables in `projects/form-components-lib/src/lib/_variables.scss`

---

# 3️⃣ Interfaces & Config

## Define Interfaces
- Start in the app, then move to the library for reuse

```ts
// form-interfaces.interface.ts
export interface IFormFieldConfig { ... }
export interface IFormOutputData { ... }
```

---

# 4️⃣ Build, Pack, and Install

Note:
- You can setup the following as a script in your `package.json` to build the library, pack it, and install it in the app.
- This step is to test locally before publishing to npm.

## Build the Library
```bash
nvm use 20.19.0
npm run build form-components-lib
```

## Pack for Local Install
```bash
cd dist/form-components-lib
npm pack
cd ../..
```

## Install in App (Local)
```bash
npm install ./dist/form-components-lib/form-components-lib-0.0.1.tgz
```

---

# 4️⃣➕ Publish & Install from npm Registry

If you want to publish your library to npm, you can do the following:

## Prepare for npm Publish
- Update `name` in `projects/form-components-lib/package.json` to a unique value (e.g. `@your-scope/form-components-lib` or `form-components-lib-demo`)
- Bump the `version` field for each publish
- Ensure you have a meaningful `README.md` in the package root
- (Optional) Add keywords, author, repository fields

## Login & Publish
```bash
cd dist/form-components-lib
npm login   # Only needed once per user
npm publish --access public
```

## Install from npm
```bash
npm install <your-package-name>@<version>
# Example:
npm install form-components-lib-demo@0.0.2
```

---

# 5️⃣ App Integration

## Import & Use Components
```ts
import { DynamicFormComponent } from 'form-components-lib';
```

## Pass Config & Listen for Submit
```html
<dynamic-form [config]="formConfig" (formSubmit)="onSubmit($event)"></dynamic-form>
```

---

# 6️⃣ Theming & Style Overrides

## Global Theme
- Define variables in `_variables.scss`
- Import in `styles.scss` and library components

## Override Example
```scss
// src/styles.scss
@use 'projects/form-components-lib/src/lib/_variables.scss' as *;
@use './dark-theme.scss' as *;
```

---

# 7️⃣ Practical Tips

## #️⃣ Local Registry (Optional)
- Use `npm pack` for simple local installs
- For a full registry:
```bash
npx verdaccio
npm set registry http://localhost:4873
```

## ⚙️ Copying assets(like icons) or styles
- assets(like icons) or styles that are not part of the library but needed can be copied to the library before building and publishing to npm
- Use a script or manual copy if needed (like in `package.json` for a set of icons, stylesheets, etc.)
- Example:
```bash
cp src/assets/icons projects/form-components-lib/src/lib/assets/icons
```

## 🎨 Style Organization
- Use shared SCSS for consistency
- Component SCSS for unique tweaks

---

# 8️⃣ Test & Run

## Start the App
```bash
nvm use 20.19.0
npm run start
```

## Verify
- Form renders with package components
- Theming and overrides work
- Submission displays data

---

# ✅ Summary
- Modular, reusable Angular library
- Local npm packaging and consumption
- Clean style architecture
- Fully replicable workflow

---

# 🙌 Q&A / Resources
- [Slidev Guide](https://sli.dev/guide/syntax.html)
- [Angular Libraries](https://angular.io/guide/creating-libraries) 