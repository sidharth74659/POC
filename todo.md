# Storybook Integration TODO Checklist

Use this `todo.md` as a living checklist for your Angular Storybook integration. Check off each item as you complete it.

---
## Phase 1: Project Initialization

### Environment Compatibility
- [x] Verify Node.js version (`node -v` >= 14)
- [x] Verify npm version (`npm -v` >= 6)

### Install Dependencies
- [x] Install Storybook packages:
  ```bash
  npm install --save-dev @storybook/angular @storybook/cli @storybook/addon-essentials
  ```

### Configure NPM Scripts
- [x] Add scripts to `package.json`:
  ```json
  "storybook": "start-storybook -p 6006",
  "build-storybook": "build-storybook"
  ```

### Scaffold Storybook
- [x] Run initialization:
  ```bash
  npx storybook@latest init --type angular
  ```

### Commit Initial Changes
- [ ] Commit `package.json`, lockfile (`package-lock.json` or `yarn.lock`), and `.storybook/` directory

---
## Phase 2: Configuration & Core Setup

### Main Configuration
- [ ] Configure `.storybook/main.js`
- [ ] Add story matching pattern (`'../src/**/*.stories.@(ts|mdx)'`)
- [ ] Add addons: `@storybook/addon-essentials`, `@storybook/addon-a11y`, `@storybook/addon-viewport`

### Preview Setup
- [ ] Configure `.storybook/preview.js`
- [ ] Import global styles (e.g., `'../src/styles.css'`)
- [ ] Define parameters (actions matching `^on[A-Z].*`, expanded controls)

### Webpack Overrides (Optional)
- [ ] In `main.js`, add a `webpackFinal` function if needed for aliases/loaders

### Commit Config Changes
- [ ] Commit `.storybook/` updated files

---
## Phase 3: Story Authoring

### Build Atoms
- [ ] Create `ButtonComponent` story
- [ ] Create `InputComponent` story (test long labels, disabled states)
- [ ] Create `CardComponent` story (with optional props)

### Build Molecules
- [ ] Create `FormFieldComponent` story (validation states)
- [ ] Create `ModalComponent` story (open, close, confirm)

### Validate Stories
- [ ] Run `npm run storybook`
- [ ] Verify components render and interact correctly

---
## Phase 4: Documentation & Addons

### Write MDX Documentation
- [ ] Create `.stories.mdx` for at least one Molecule component (e.g., Card)
- [ ] Add usage notes, property tables, examples

### Accessibility Setup
- [ ] Install and configure `@storybook/addon-a11y`
- [ ] Fix warnings flagged in A11y tab

### Responsive Testing
- [ ] Install and configure `@storybook/addon-viewport`
- [ ] Add device previews for major breakpoints

---
## Phase 5: Visual Regression & CI/CD

### Chromatic Setup
- [ ] Install `chromatic`
- [ ] Add GitHub Action to automate Chromatic snapshot testing
- [ ] Configure `CHROMATIC_PROJECT_TOKEN` secret in GitHub repo

### Static Storybook Build
- [ ] Build Storybook (`npm run build-storybook`)
- [ ] Store build artifacts (`storybook-static/`)

---
## Phase 6: Hosting & Versioning

### GitHub Pages Deployment
- [ ] Add `gh-pages` deploy GitHub Action
- [ ] Set `folder: storybook-static` and target `gh-pages` branch

### (Optional) Deploy via Netlify/Vercel
- [ ] Connect GitHub repository
- [ ] Configure publish directory as `storybook-static`
- [ ] Set build command `npm run build-storybook`

### Version Tagging
- [ ] Create Git tags for major releases
- [ ] Push tags and document changes in Storybook

### Update README
- [ ] Document how to run and view Storybook
- [ ] Link to hosted Storybook site
- [ ] Add a status badge if hosted

---
## Phase 7: Maintenance & Cleanup

### Maintenance Routines
- [ ] Plan quarterly Storybook reviews
- [ ] Remove unused or deprecated component stories
- [ ] Update docs as new components are added

### Continuous Improvements
- [ ] Adopt Storybook new versions yearly
- [ ] Migrate old `.stories.ts` to `.stories.mdx` when appropriate
- [ ] Enhance stories with interaction testing (`play` function)

_Last updated: April 28, 2025_
