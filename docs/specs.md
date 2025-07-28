# MongoDB Viewer - Project Specifications

## Backend (Node.js, Express, MongoDB)
- [x] Install dependencies: express, mongodb, cors
- [x] Connect to MongoDB using a read-only user URI
- [x] GET /databases: List all databases
- [x] GET /collections/:db: List collections in a database
- [x] GET /documents/:db/:col: Return first 10 documents from a collection
- [x] No write endpoints
- [x] Check user permissions (read-only)
- [x] Log all requests
- [x] Document how to create a read-only MongoDB user and require its credentials

## Frontend (React)
- [ ] Multi-column UI: Databases, Collections, Documents
- [ ] Documents preview: table/accordion/card views
- [ ] Auto-refresh with polling interval and debounce
- [ ] Buttons to switch views
- [ ] Use Fetch/Axios for backend requests
- [ ] Search/filter for collections and documents (optional)
- [ ] Manual refresh button (optional)

## Security
- [x] No write endpoints
- [x] Backend checks permissions and logs requests
- [x] Document read-only user creation

## Testing
- [ ] Run backend and frontend separately
- [ ] Use the "mock-mongo" container for DB
- [ ] Confirm only view operations are possible
- [ ] Confirm smooth UI/UX for switching and viewing

---

## Progress Log
- [x] Backend setup
- [x] Backend endpoints
- [x] Backend security & logging
- [ ] Backend tested
- [x] Frontend scaffolded (Vite + React)
- [ ] Frontend features implemented
- [ ] Frontend tested
- [ ] End-to-end test 