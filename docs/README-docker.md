# MongoDB Viewer – Dockerized Setup

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- Access to a MongoDB instance (local, remote, or cloud such as MongoDB Atlas)

## Quick Start

1. **Clone the repository** (if not already):
   ```sh
   git clone <repo-url>
   cd 34.mongodb-viewer
   ```

2. **Build and start the app:**
   ```sh
   docker-compose up --build
   ```
   or
   ```sh
   docker compose up --build
   ```
   This will:
   - Build the frontend and backend into a single container
   - Start both frontend (Next.js) and backend (Node.js) servers

3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:4000](http://localhost:4000)

4. **Connect to your own MongoDB:**
   - Enter your MongoDB URI in the UI (e.g., Atlas, local, or remote)
   - Example: `mongodb://username:password@host:port/dbname` or Atlas URI

## Stopping & Cleanup
- To stop the app:
  ```sh
  docker-compose down
  ```

## Notes
- MongoDB is **not** bundled. You must provide your own MongoDB instance.
- You can use [MongoDB Atlas](https://www.mongodb.com/atlas/database) for a free cloud database, or run MongoDB locally/remotely.
- The app and backend will restart automatically if stopped (unless you use `down`).

---

_This setup runs both frontend and backend in a single container. For production, consider using separate containers for scalability._ 