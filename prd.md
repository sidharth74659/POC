- https://www.polipo.io/blog/how-to-use-shadcn-with-storybook-full-guide

---

**Objective:** Develop a React application using TypeScript and Shadcn UI to create a "Document-Centric Issue Tracking System". The application will use mock data for its backend, focusing on efficient data generation (e.g., using loops). The UI should be clean, intuitive, and draw simplified inspiration from JIRA's user experience.

**Core Problem to Solve (for context, not direct implementation of _all_ aspects):** The application addresses the lack of centralized, live-updated documentation for application "tiles," enabling better onboarding and developer testing by integrating documentation directly into an issue-tracking workflow.

**Key Technologies:**

- React (with Hooks)
- TypeScript
- Shadcn UI (using `npx shadcn-ui@latest init` setup)
- `lucide-react` for icons
- `react-router-dom` for navigation
- `react-markdown` for rendering Markdown content
- Mock data (generate efficiently within a `mockData.ts` file)

**Data Models (for `mockData.ts`):**
Generate sample data for ~2-3 projects, each with ~3-5 tiles, and each tile having ~1-2 issues. Use loops where possible to generate repetitive data.

1.  **`Project`**:

    - `id: string`
    - `name: string`
    - `purpose: string`
    - `tileCount: number` (derived or stored)

2.  **`Tile`**:

    - `id: string`
    - `projectId: string`
    - `name: string`
    - `mainDocumentContent: string` (Markdown content; serves as the canonical PRD/TDD)
    - `templateData: {`
      - `intent: string`
      - `scenario: string`
      - `flow: string` (Markdown)
      - `apis: Array<{ method: 'GET' | 'POST', path: string, payloadExample?: string }>`
      - `sharedComponents: string` (Markdown description)
      - `testCases: Array<{ id: string, text: string, checked: boolean }>`
      - `}`

3.  **`Issue` (Represents a Forked Document/Task):**

    - `id: string`
    - `tileId: string`
    - `issueNumber: string` (e.g., "ISSUE-101")
    - `title: string`
    - `assignee: 'Developer' | 'Tester' | 'Unassigned'`
    - `priority: 'High' | 'Medium' | 'Low'`
    - `status: 'Open' | 'Development In Progress' | 'Testing In Progress' | 'Closed'`
    - `estimation?: string` (e.g., "2 days")
    - `forkedDocumentContent: string` (Markdown content representing the modified version of `Tile.mainDocumentContent`. **Embed diff markers directly in this mock data for visual styling**: use `++added text++` for additions, `--removed text--` for removals, and `~~modified text~~` for changes.)
    - `tags?: string[]` (e.g., ["v1.2", "bugfix", "android-apk-link"])
    - `createdAt: Date`

4.  **`SubTask`**:
    - `id: string`
    - `issueId: string`
    - `description: string`
    - `status: 'Open' | 'Closed'`

**Application Structure and UI:**

**1. Global Layout:**
_ A simple `Header` component displaying the application name (e.g., "DocuTrack") and a navigation link to "Projects".
_ Main content area below the header.

**2. Pages & Navigation (`react-router-dom`):**

- **`Path: /` (Projects List Page)**

  - Display a list of `Project` items using Shadcn `Card` components.
  - Each card should show: Project `name`, `purpose`, and `tileCount`.
  - Clicking a project card navigates to `/projects/:projectId`.

- **`Path: /projects/:projectId` (Project Detail Page)**

  - **Layout:** Master-detail view.
  - **Left Pane (Tile List):**
    - Use Shadcn `ScrollArea` to list all `Tile` names belonging to the current project.
    - Selecting a tile updates the Right Pane.
  - **Right Pane (Tile Detail View):**
    - Displays the selected `Tile`'s details.
    - **Canonical Document Section:**
      - Render `Tile.mainDocumentContent` using `react-markdown`.
      - Display `Tile.templateData` fields (Intent, Scenario, Flow, APIs, Shared Components) in clearly structured sections.
      - **Test Cases:** Display `Tile.templateData.testCases` as a checklist (e.g., using Shadcn `Checkbox` within an `Accordion` or collapsible section). Each test case item should be stylable as a checklist item.
    - **"Create New Issue/Fork" Button:**
      - Opens a Modal (use Shadcn `Dialog`) or navigates to a form page.
      - **Form:**
        - Pre-fill a `Textarea` with the `Tile.mainDocumentContent`. The user is expected to edit this. For this mock, assume the _output_ of this editing process results in a string with `++add++`, `--remove--`, `~~modify~~` markers.
        - Input fields for new `Issue`: `title`, `assignee` (Shadcn `Select`), `priority` (Shadcn `Select`). Status defaults to 'Open'.
        - On submit, create a new `Issue` object with the entered data and the modified markdown, then add it to the mock data.
    - **Associated Issues/Forks List:**
      - Below the document, list `Issue` items linked to this `Tile`.
      - Use a Shadcn `Table` or styled list. Columns: `Issue Number`, `Title`, `Status` (use Shadcn `Badge`), `Assignee`.
      - Each row links to `/projects/:projectId/tiles/:tileId/issues/:issueId`.

- **`Path: /projects/:projectId/tiles/:tileId/issues/:issueId` (Issue Detail Page)**
  - Display `Issue` metadata: `issueNumber`, `title`, `assignee`, `priority`, `status` (use Shadcn `Badge` for status and priority), `estimation`, `tags` (as Badges).
  - **Forked Document View:**
    - Render `Issue.forkedDocumentContent` using `react-markdown`.
    - **Visual Diffs:** Style the text based on the embedded markers:
      - `++added text++`: Green background/text.
      - `--removed text--`: Red background/text with strikethrough.
      - `~~modified text~~`: Orange background/text.
  - **Issue Actions:**
    - **Change Status:** Shadcn `Select` to change `Issue.status`.
    - **"Merge to Main" Button:**
      - Visible only if `Issue.status` is 'Closed'.
      - **Action (Simulated):** On click, update the parent `Tile.mainDocumentContent` with the `Issue.forkedDocumentContent`. For simplicity, you can choose to either keep the diff markers or strip them (e.g., replace `++text++` with `text`). Overwriting is fine.
  - **Sub-Tasks Section:**
    - Use Shadcn `Card` or a section.
    - Display a list of `SubTask` items for this `Issue`. Each item shows `description` and a `Checkbox` to toggle `status`.
    - Input field and "Add Sub-task" `Button` to create new sub-tasks.

**State Management:**

- Use React `useState`, `useReducer`, and `Context` for managing the mock data state and sharing it across components. Avoid prop drilling excessively where Context is more appropriate.
- All data modifications (creating issues, changing status, adding sub-tasks, merging) should update the in-memory mock data.

**Styling and UI Components:**

- Utilize Shadcn UI components extensively (e.g., `Button`, `Card`, `Table`, `Select`, `Dialog`, `Input`, `Textarea`, `Checkbox`, `Badge`, `Accordion`, `ScrollArea`).
- Aim for a clean, professional, and user-friendly interface.
- Use `lucide-react` icons where appropriate (e.g., for buttons, status indicators).

**Token Efficiency Considerations for Development:**

- **Mock Data:** Generate mock data in `mockData.ts` using loops and concise structures.
- **Component Structure:** Create reusable components in a `components/` directory. Place page components in a `pages/` directory.
- **Focus:** Prioritize the described UI, navigation, and core CRUD operations on the mock data.
- **Exclusions (for this iteration):** Real diffing algorithms, AI features, full authentication, real-time collaboration, complex merge conflict resolution UI, attachments, advanced notifications, granular permissions.

**Deliverable:**
A functional React application as described above, with navigable pages and interactable UI elements operating on mock data. The codebase should be well-organized and use TypeScript.

Please generate the necessary files (`App.tsx`, `components/`, `pages/`, `mockData.ts`, `types.ts` etc.) to build this application.
