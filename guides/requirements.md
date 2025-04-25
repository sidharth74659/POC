Analyze the provided UI and create a **dynamic debugging UI** for theme and style management across an application. The UI should include the following parts:

### 1. **Theme Controls Panel (Left Section)**
- **Toggle Theme Button**: Light/Dark mode switcher.
- **Dynamic Sliders**:
  - Control **contrast**, **hue**, **hue shift**, **main chroma**, and **accent chroma**.
- **Color Token Viewer**:
  - Display current CSS variables like surface backgrounds, hover/active states, and text/button colors.
  - Live update values based on slider movement.

✅ *Purpose*: Quickly fine-tune theme colors and contrasts for debugging and designing.

---

### 2. **Component Previews Panel (Middle Section)**
- **Button Components**:
  - Preview **Primary**, **Secondary**, **Tertiary** buttons across different backgrounds (app-level and card-level).
- **Text Components**:
  - Preview headings, body text, and links in various themes.
- **Cards and Lists**:
  - Visualize UI components like lists, cards, and notices with dynamic styling.

✅ *Purpose*: See how different components respond to the color and theme changes live.

---

### 3. **Extended Application Styling (Right Section)**
- **Real-Time Responsive Layout Testing**:
  - Shrink/expand to see responsiveness at different breakpoints (mobile/tablet/desktop).
- **Font Styling & Hierarchy**:
  - Allow font family, weight, and size adjustments.
- **Surface Hierarchy Controls**:
  - Adjust elevation (shadows, borders, layering).

✅ *Purpose*: Debug layout, responsiveness, and typography dynamically without rebuilding or redeploying.

---

### 4. **Future Extensions**
- **Export Configurations**: Button to export current theme settings as a JSON or CSS file.
- **Multiple Theme Profiles**: Save/load theme presets.
- **Accessibility Checks**: Show contrast ratio indicators automatically.
- **Branch-wise Styling**: Support switching between different application feature branches to test styling independently.
