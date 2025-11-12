# Study Planner API

REST API for the Study Planner application built with Express.js and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Language**: JavaScript

## Architecture

The API follows a layered architecture pattern:

```
src/
├── config/          # Configuration files (database, etc.)
├── routes/          # Route definitions (HTTP endpoints)
├── services/        # Business logic layer
├── repositories/    # Data access layer (database interactions)
└── database/        # Database schema and migrations
```

### Layer Separation

- **Routes**: Define HTTP endpoints and handle request/response
- **Services**: Contain business logic and validation
- **Repositories**: Handle database queries and data access

This separation ensures:
- Better maintainability
- Easier testing
- Clear separation of concerns
- Reusability of business logic

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Create PostgreSQL database:
```bash
createdb study_planner
```

4. Run database schema:
```bash
psql -d study_planner -f src/database/schema.sql
```

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Domains
- `GET /api/domains` - Get all domains
- `GET /api/domains/:id` - Get domain by ID
- `POST /api/domains` - Create new domain
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain
- `PATCH /api/domains/:id/toggle` - Toggle completion status

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic by ID
- `POST /api/topics` - Create new topic
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic
- `PATCH /api/topics/:id/toggle` - Toggle completion status

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `PATCH /api/sessions/:id/toggle` - Toggle completion status

### Last Studied
- `GET /api/last-studied` - Get all last studied items
- `GET /api/last-studied/:id` - Get last studied item by ID
- `POST /api/last-studied` - Create new last studied item
- `PUT /api/last-studied/:id` - Update last studied item
- `DELETE /api/last-studied/:id` - Delete last studied item
- `PATCH /api/last-studied/:id/toggle` - Toggle completion status

## Request/Response Examples

### Create Domain
```bash
POST /api/domains
Content-Type: application/json

{
  "time": "18:00",
  "title": "Call mom",
  "completed": false
}
```

### Response
```json
{
  "id": 1,
  "time": "18:00",
  "title": "Call mom",
  "completed": false,
  "created_at": "2025-11-12T10:00:00.000Z",
  "updated_at": "2025-11-12T10:00:00.000Z"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment (development/production) | development |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | study_planner |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |

## Development

The API uses ES Modules (`"type": "module"` in package.json) for modern JavaScript syntax.

Watch mode is available for development:
```bash
npm run dev
```

This uses Node.js built-in `--watch` flag to automatically restart on file changes.
