# MongoDB Viewer - Test Plan

## Backend
- [x] Can connect to MongoDB (mock-mongo container)
- [x] GET /databases returns all databases
- [x] GET /collections/:db returns collections for a database
- [x] GET /documents/:db/:col returns first 10 documents
- [x] No write endpoints exist
- [x] All requests are logged
- [x] Only read-only operations are allowed

## Frontend
- [ ] Databases column loads and displays all databases
- [ ] Selecting a database loads collections in column 2
- [ ] Selecting a collection loads documents in column 3
- [ ] Documents can be viewed in table, accordion, and card views
- [ ] Switching views works smoothly
- [ ] Auto-refresh works and can be configured
- [ ] Debounce prevents DB overload
- [ ] Manual refresh button works (if implemented)
- [ ] Search/filter works for collections and documents (if implemented)

## Security
- [ ] No endpoints allow writing to MongoDB
- [ ] Backend checks for read-only permissions
- [ ] All requests are logged

## End-to-End
- [ ] Backend and frontend run separately
- [ ] Only view operations are possible
- [ ] UI/UX is smooth for switching and viewing 