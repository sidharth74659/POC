# Register Component Test Plan

## Overview
Implement a tenant registration component that allows users to create new tenants with proper validation, UI/UX consistency, and backend integration.

## Requirements Analysis

### API Requirements (from create-tenant.md)
- **Endpoint**: `POST /api/tenants`
- **Required Fields**:
  - `name`: Company name
  - `subdomain`: Unique subdomain (3-63 chars, lowercase, numbers, hyphens)
  - `adminEmail`: Valid email
  - `adminPassword`: Password (min 6 chars)

### UI/UX Requirements
- Consistent with login component design
- Form validation with real-time feedback
- Autofill suggestions where appropriate
- Error handling and success messages
- Responsive design

### Technical Requirements
- Use shared schemas for validation
- TypeScript interfaces from shared-schemas-zod
- Reactive forms with proper validation
- Integration with tenant service
- Error handling and loading states

## Implementation Plan

### Phase 1: Component Structure
- [ ] Create register component with reactive form
- [ ] Add form fields: company name, subdomain, admin email, admin password
- [ ] Implement validation using shared schemas
- [ ] Add loading states and error handling

### Phase 2: UI/UX Implementation
- [ ] Style component consistent with login
- [ ] Add form validation messages
- [ ] Implement subdomain availability check
- [ ] Add autofill suggestions for email domain
- [ ] Add password strength indicator

### Phase 3: Backend Integration
- [ ] Integrate with tenant service
- [ ] Handle API responses and errors
- [ ] Implement success flow (redirect to login)
- [ ] Test with actual backend API

### Phase 4: Testing
- [ ] Unit tests for component logic
- [ ] Integration tests with backend
- [ ] E2E tests with Playwright
- [ ] Edge case testing

## Test Cases

### Form Validation
- [ ] Required field validation
- [ ] Email format validation
- [ ] Subdomain format validation (lowercase, numbers, hyphens only)
- [ ] Password minimum length validation
- [ ] Subdomain availability check

### User Experience
- [ ] Form submission with valid data
- [ ] Error handling for invalid data
- [ ] Loading states during submission
- [ ] Success message and redirect
- [ ] Autofill suggestions work correctly

### Edge Cases
- [ ] Duplicate subdomain handling
- [ ] Network error handling
- [ ] Invalid email format
- [ ] Weak password handling
- [ ] Special characters in subdomain

### Backend Integration
- [ ] API call with correct payload
- [ ] Response handling (success/error)
- [ ] Error message display
- [ ] Success redirect flow

## Success Criteria
- [x] Form validates correctly using shared schemas
- [x] UI matches login component design
- [x] Backend integration works end-to-end
- [x] All test cases pass
- [x] No console errors
- [x] Responsive design works
- [x] Tenant-based routing implemented
- [x] Landing component redirects correctly
- [x] Autofill functionality works
- [x] Form submission works with backend API 