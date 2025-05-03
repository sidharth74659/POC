
## 1. Introduction

This document is a **developer‑ready specification** for a web‑based resource scheduler POC built in Angular, demonstrating how to leverage a Model Context Protocol (MCP) backend to power an “Ask AI” chat feature. It consolidates all functional and non‑functional requirements, architecture decisions, data schema, API definitions, error handling strategies, UI/UX guidelines, component/service stubs, and a testing plan, enabling a developer to begin implementation immediately.

## 2. Objectives & Scope

* **POC Goal**: Showcase MCP integration for context‑aware AI responses within a resource scheduler.
* **Key Features**:

  * Tabular scheduler view of **human resources**.
  * Server‑side filters by equipment type, date range, and resource name.
  * “Ask AI” slide‑out chat per row, context‑aware, with follow‑up suggestions.
* **Out of Scope (for POC)**:
  * Stateful conversation storage (stateless only)
  * Additional resource types beyond human resources
  * Full production‑grade logging, monitoring, or CI/CD pipelines

## 3. Requirements

### 3.1 Functional Requirements

1. **Scheduler Table**: Display resource name, skillset, allocated operation, equipment, time slot, availability status, and an “Ask AI” action button.
2. **Filtering & Search**: Support filtering by equipment type, date/time range, and resource name; keyword search across notes.
3. **AI Chat Flow**:

   * Trigger a slide‑out sidebar with chat UI when “Ask AI” is clicked.
   * Send user question + `resourceContext` to `POST /ai/chat`.
   * Display AI answer, suggested follow‑up pills, response time, and color‑coded messages.
   * Allow follow‑up questions by clicking pills.
4. **Error Handling**: Gracefully handle no‑data, API errors, and AI failures with user‑friendly messages.

### 3.2 Non‑Functional Requirements

* **Performance**:

  * Use Angular OnPush change detection for chat and table components.
  * Debounce or disable rapid‑fire requests in chat.
* **Modularity**: Standalone components; lean feature modules.
* **Styling**: Use a SCSS for MVP; include micro‑interactions (typing indicator, animations, smooth transitions).
* **Testing**: Unit tests for all services and components; manual QA scopes defined below.

## 4. Architecture Overview

### 4.1 Frontend

* **Framework**: Angular with Standalone components and OnPush strategy.
* **State Management**: Services + `BehaviorSubject` streams.
* **Modules**:

  * `SchedulerModule` (table, filters).
  * `ChatModule` (chat sidebar & components).
* **Styling**: SCSS.

### 4.2 Backend

* **Technology**: Node.js API layer implementing MCP.
* **AI Provider**: Third‑party LLM (e.g., OpenAI GPT‑4).
* **Workflow**:

  1. **POST /ai/chat** receives `{ userId, resourceContext, question }`.
  2. MCP layer invokes GET /operations to fetch contextual data.
  3. Combine context + question into LLM prompt.
  4. Return `{ answer, followUps }` in envelope.

### 4.3 Data Model
Note: use Mock JSON data for now following the schema below
```sql
-- Resources
CREATE TABLE Resources (
  resourceId   VARCHAR PRIMARY KEY,
  resourceName VARCHAR NOT NULL,
  skillSet     VARCHAR,
  role         VARCHAR
);

-- Operations
CREATE TABLE Operations (
  operationId     VARCHAR PRIMARY KEY,
  operationName   VARCHAR NOT NULL,
  equipment       VARCHAR,
  workOrderNumber VARCHAR,
  workOrderId     VARCHAR,
  resourceId      VARCHAR REFERENCES Resources(resourceId),
  startDate       TIMESTAMP,
  endDate         TIMESTAMP,
  notes           TEXT
);
```

## 5. API Specification

| Method | Endpoint    | Description                         | Query/Body Params                                  | Response Envelope                                               |
| ------ | ----------- | ----------------------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| GET    | /resources  | List human resources (with filters) | `skillSet?`, `role?`, `name?`, `page?`, `size?`    | `{ Response: items[], Success: boolean, ErrorMessage: string }` |
| GET    | /operations | Fetch scheduled operations          | `resourceId`, `equipment?`, `startDate`, `endDate` | `{ Response: { items[], totalCount }, Success, ErrorMessage }`  |
| POST   | /ai/chat    | Chat with AI using MCP context      | `{ userId, resourceContext, question }`            | `{ Response: { answer, followUps[] }, Success, ErrorMessage }`  |

### 5.1 Sample Request/Response

```http
GET /operations?resourceId=123&startDate=2025-05-05T00:00:00Z&endDate=2025-05-07T23:59:59Z
```

```json
{ "Response": { "items": [ /* ... */ ], "totalCount": 1 }, "Success": true, "ErrorMessage": null }
```

```http
POST /ai/chat
Content-Type: application/json
```

```json
{
  "userId": "user-001",
  "resourceContext": { "operationId": "op-456", "resourceId": "123" },
  "question": "What operations are assigned next week?"
}
```

```json
{ "Response": { "answer": "…", "followUps": […] }, "Success": true, "ErrorMessage": null }
```

## 6. Error Handling Strategy

* **HTTP Codes**: 200 (success/fallback), 400 (invalid request), 404 (data not found), 500 (server error), 502 (AI failure).
* **Envelope**: Always return `{ Response, Success, ErrorMessage }`.
* **AI & Data Edge Cases**:

  * No matching operations → `Success: false`, `ErrorMessage: "No operations found"` (200).
  * AI API downtime → 502 + `ErrorMessage: "AI service unavailable"`.

## 7. UI/UX Specification

### 7.1 Scheduler Table

* **Columns**: Resource, Skillset, Time Slot, Operation, Equipment, Availability, Ask AI.
* **Behavior**:

  * Horizontal scroll or column chooser if needed.
  * Filters displayed prominently above the table.

### 7.2 Chat Sidebar

* **Layout**: Slide‑out from right; modal fallback if slide‑out isn’t feasible.
* **Micro‑interactions**:

  * Typing indicator during AI calls.
  * Animated pill entry for follow‑ups.
  * Smooth open/close transitions (\~200 ms).
  * Response‑time display next to each AI answer.
  * Color‑coding: user questions (e.g. blue), AI answers (e.g. gray), errors (red).

## 8. Angular Components & Services

### 8.1 ChatService (`chat.service.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class ChatService {
  private msgs$ = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.msgs$.asObservable();

  postChat(userId: string, ctx: any, q: string) {
    const start = Date.now();
    return this.http.post<any>('/ai/chat', { userId, resourceContext: ctx, question: q })
      .pipe(map(resp => {
        const elapsed = Date.now() - start;
        const newMsgs = [
          { text: q, isUser: true, timestamp: new Date(), type: 'question' },
          { text: `${resp.Response.answer} (${elapsed} ms)`, isUser: false, timestamp: new Date(), type: 'answer' }
        ];
        this.msgs$.next([...this.msgs$.value, ...newMsgs]);
        return this.msgs$.value;
      }));
  }

  clear() { this.msgs$.next([]); }
}
```

### 8.2 ChatComponent (`chat.component.ts`)

```typescript
@Component({ selector: 'app-chat', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush })
export class ChatComponent {
  @Input() resourceContext!: any;
  @Output() onClose = new EventEmitter<void>();
  @Output() onError = new EventEmitter<string>();

  messages$ = this.chatService.messages$;
  question = '';

  sendMessage() {
    if (!this.question.trim()) return;
    this.chatService.postChat('user-001', this.resourceContext, this.question)
      .subscribe({ error: e => this.onError.emit(e.message) });
    this.question = '';
  }

  close() { this.onClose.emit(); }
}
```

## 9. High‑Level Sequence Diagram

```plaintext
User clicks Ask AI → SchedulerComponent emits context → ChatService opens sidebar
  ChatComponent.sendMessage() → POST /ai/chat → MCP → GET /operations
  MCP → AI API → Response{answer, followUps} → ChatService updates messages
User sees answer + pills; clicks follow‑up → repeat
```

## 10. Testing Plan

### 10.1 Unit Tests

* **ChatService**: Mock HTTP to verify envelope parsing, elapsed timing, BehaviorSubject updates.
* **ChatComponent**: Test input binding, sendMessage disabling when empty, error output emission.

### 10.2 Manual QA Scenarios

1. **Assigned Operations**: Ask “Which operations are mine next week?” → correct answer.
2. **Availability**: Filter by date range; ask “Show available slots” → respects filters.
3. **Equipment Conflicts**: Ask “Any equipment conflicts?” → handles conflict detection.
4. **No Data**: Ask out‑of‑range question → displays “No operations found” message.
5. **AI Fallback**: Simulate AI timeout → shows “AI service unavailable”.

## 11. Future Considerations

* Stateful context (GET/DELETE context endpoints).
* Support for additional resource types (equipment, rooms).
* Role‑based access control and permissions.
* Persist conversation history for analytics.
