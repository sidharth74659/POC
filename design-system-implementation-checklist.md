## 📝 **Design System Implementation Checklist**

### 1. **Colors & Tokens**
- ~~Define color tokens for all primary, secondary, and neutral colors.~~
- ~~Create SCSS variables/mixins for easy reuse.~~

### 2. **Typography**
- ~~Import and configure the **Kanit** font.~~
- ~~Define SCSS font-size, weight, and utility classes for all specified sizes/weights.~~

### 3. **Spacing, Border, and Utility Tokens**
- [ ] Define spacing, border-radius, and shadow tokens/utilities in SCSS.

---

### 4. **UI Components**

#### **Atoms**
- ~~**Button**~~
  - ~~Properties: variant, size, disabled, icon~~
  - ~~Events: onClick~~
- ~~**Input**~~
  - ~~Properties: label, placeholder, value, disabled, error~~
  - ~~Events: onChange, onFocus, onBlur~~
- ~~**TextArea**~~
  - ~~Properties: label, placeholder, value, disabled, error, rows~~
  - ~~Events: onChange, onFocus, onBlur~~
- ~~**Checkbox**~~
  - ~~Properties: label, checked, disabled, error~~
  - ~~Events: onChange~~
- ~~**Radio**~~
  - ~~Properties: label, checked, disabled, error, name, value~~
  - ~~Events: onChange~~
- ~~**Dropdown/Select**~~
  - ~~Properties: label, options, value, disabled, error~~
  - ~~Events: onChange~~
- ~~**Label**~~
  - ~~Properties: text, variant, size~~
- ~~**Icon**~~
  - ~~Properties: name, size, color~~

#### **Molecules**
- [ ] **Card**
  - Props: `title`, `subtitle`, `content`, `actions`
- [ ] **FormField**
  - Props: `label`, `hint`, `error`, `required`
- [ ] **Alert**
  - Props: `type` (success, warning, error, info), `message`
- [ ] **Modal**
  - Props: `title`, `visible`, `actions`
  - Events: `close`, `confirm`
- [ ] **Sidebar Navigation**
  - Props: `items`, `activeItem`
  - Events: `select`
- [ ] **Topbar/Header**
  - Props: `title`, `actions`, `userMenu`
- [ ] **Tabs**
  - Props: `tabs`, `activeTab`
  - Events: `tabChange`
- [ ] **Badge**
  - Props: `text`, `color`, `size`

#### **Organisms**
- [ ] **Form**
  - Props: `fields`, `onSubmit`
  - Events: `submit`
- [ ] **List**
  - Props: `items`, `itemTemplate`
- [ ] **Table**
  - Props: `columns`, `data`, `sortable`
  - Events: `sort`, `rowClick`

---

### 5. **Utilities**
- [ ] **Loader/Spinner**
- [ ] **Divider**
- [ ] **Tooltip**
- [ ] **Avatar**

---

### 6. **Testing**
- [ ] Unit tests for each component (props, events, rendering)
- [ ] Accessibility tests (ARIA, keyboard nav)
- [ ] Visual regression (optional, via Storybook)

---

### 7. **Documentation & Demo**
- ~~Storybook stories for each component~~
- [ ] Demo page for visual testing

---

## **Next Steps**

1. **Start with Color & Typography Tokens** (foundation for all components). ~~(done)~~
2. **Implement the Button Atom** (most used, sets pattern for others). ~~(done)~~
3. **Implement the Input Atom** (done)
4. **Implement the TextArea Atom** (done)
5. **Implement the Checkbox Atom** (done)
6. **Implement the Radio Atom** (done)
7. **Implement the Dropdown/Select Atom** (done)
8. **Implement the Label Atom** (done)
9. **Implement the Icon Atom** (done)
10. **After each component, update this checklist and strike it off.**
