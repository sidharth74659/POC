# Smart Scheduler POC Implementation Checklist

## ✅ Backend

### Data Models & Schema 
- [x] Create JSON schema for Resources table following the provided SQL schema
- [x] Create JSON schema for Operations table following the provided SQL schema
- [x] Create sample/mock data for Resources
- [x] Create sample/mock data for Operations with relationships to Resources

### API Endpoints
- [x] Implement GET /resources endpoint with filter support
  - [x] Support filtering by skillSet, role, name
  - [x] Implement pagination (page, size parameters)
  - [x] Return standardized response envelope: `{ Response: items[], Success: boolean, ErrorMessage: string }`
- [x] Implement GET /operations endpoint
  - [x] Support filtering by resourceId (required), equipment, startDate, endDate
  - [x] Return standardized response with totalCount: `{ Response: { items[], totalCount }, Success, ErrorMessage }`
- [x] Implement POST /ai/chat endpoint
  - [x] Process request with userId, resourceContext, question
  - [x] Fetch contextual data from operations based on resourceContext
  - [x] Combine context and question for AI processing
  - [x] Return standardized response with answer and followUps: `{ Response: { answer, followUps[] }, Success, ErrorMessage }`

### Error Handling
- [x] Implement standardized error handling for all endpoints
- [x] Create fallback responses for common error scenarios
  - [x] No matching operations scenario
  - [x] AI service unavailability
  - [x] Invalid request parameters

## 🎨 Frontend

### Core Setup
- [x] Configure Angular project with standalone components
- [x] Set up SCSS styling infrastructure
- [x] Configure routing for main views

### Services
- [x] Create ResourceService for interacting with /resources API
  - [x] Implement methods for fetching and filtering resources
  - [x] Add error handling and retry logic
- [x] Create OperationService for interacting with /operations API
  - [x] Implement methods for fetching operations with filters
  - [x] Add response transformation and error handling
- [x] Create ChatService for AI interactions
  - [x] Implement method to post questions to /ai/chat
  - [x] Track and calculate response times
  - [x] Manage chat message state with BehaviorSubject
  - [x] Create method to clear chat history

### Components - Scheduler Module
- [x] Create SchedulerComponent (container)
  - [x] Implement OnPush change detection
  - [x] Set up filter controls and state management
- [x] Create FilterComponent
  - [x] Implement equipment type filter
  - [x] Implement date range picker
  - [x] Implement resource name filter
  - [x] Create keyword search across notes
  - [x] Add debounce for search inputs
- [x] Create SchedulerTableComponent
  - [x] Design table with required columns (Resource, Skillset, Time Slot, Operation, Equipment, Availability, Ask AI)
  - [x] Implement horizontal scroll or column chooser
  - [x] Create row click handler for AI chat
  - [x] Add OnPush change detection strategy
  - [x] Implement empty state handling

### Components - Chat Module
- [x] Create ChatComponent
  - [x] Implement slide-out sidebar functionality
  - [x] Use OnPush change detection
  - [x] Add input for resourceContext
  - [x] Add outputs for close and error events
  - [x] Create question input with send functionality
- [x] Create ChatMessageComponent
  - [x] Support different message types (user, AI, error)
  - [x] Display response time for AI messages
  - [x] Apply appropriate color-coding
- [x] Create FollowUpComponent
  - [x] Render follow-up suggestion pills
  - [x] Handle pill click events
  - [x] Implement animated entry for pills
- [x] Create TypingIndicatorComponent
  - [x] Design typing animation
  - [x] Show/hide based on API call status

### Micro-interactions
- [x] Implement smooth open/close transitions for chat sidebar (~200ms)
- [x] Add typing indicator animation during AI calls
- [x] Create animated entry for follow-up pills
- [x] Set up color-coding for different message types
- [x] Implement response-time display

### State Management 
- [x] Set up BehaviorSubject streams for chat messages
- [x] Create state management for filter selections
- [x] Implement state for table data

### Error Handling
- [x] Create error display component
- [x] Implement graceful handling for API errors
- [x] Add user-friendly messages for common error scenarios
- [x] Handle AI service unavailability

### MCP Integration - Backend Tasks
- [ ] Set up MCP service layer according to spec
  - [ ] Create MCP wrapper for external AI provider (OpenAI GPT-4)
  - [ ] Implement context retrieval from operations data
  - [ ] Create prompt templates for resource scheduling questions
  - [ ] Add error handling specific to AI provider
- [ ] Implement backend `/ai/chat` endpoint
  - [ ] Process JSON requests containing `userId`, `resourceContext`, and `question`
  - [ ] Call MCP service with proper context and formatting
  - [ ] Structure response with standardized envelope and fields
  - [ ] Implement proper error handling for AI timeouts or failures

### Testing
- [ ] Create unit tests for all services
  - [ ] Test HTTP interactions
  - [ ] Verify response transformations
  - [ ] Test error handling
- [ ] Create unit tests for all components
  - [ ] Test input/output bindings
  - [ ] Verify component rendering
  - [ ] Test user interactions
- [ ] Implement test cases for the defined QA scenarios:
  - [ ] Assigned Operations scenario
  - [ ] Availability scenario
  - [ ] Equipment Conflicts scenario
  - [ ] No Data scenario
  - [ ] AI Fallback scenario

### Performance Optimization
- [x] Implement OnPush change detection for all appropriate components
- [x] Add debounce for filter inputs
- [x] Disable rapid-fire requests in chat
- [x] Optimize rendering for large data sets

### Accessibility
- [ ] Ensure proper keyboard navigation
- [ ] Implement appropriate ARIA attributes
- [ ] Verify color contrast for all UI elements
- [ ] Test with screen readers

## 📋 Project Management
- [x] Set up initial project structure
- [x] Configure linting and code formatting
- [x] Create component/service stubs
- [ ] Implement CI/CD for testing (if applicable for POC)
- [x] Document API interactions and state management approach
- [ ] Create user documentation for the POC 