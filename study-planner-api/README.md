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
  - Query param: `?include_topics=true` to include topics
- `GET /api/domains/:id` - Get domain by ID
  - Query param: `?include_topics=true` to include topics
- `POST /api/domains` - Create new domain
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain (cascades to topics)
- `PATCH /api/domains/:id/toggle` - Toggle completion status

### Topics
**Note:** Topics are related to Domains (one domain can have multiple topics)

- `GET /api/topics` - Get all topics
  - Query param: `?domain_id=X` to filter by domain
- `GET /api/topics/:id` - Get topic by ID
- `POST /api/topics` - Create new topic (requires `domain_id` in body)
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic
- `PATCH /api/topics/:id/toggle` - Toggle completion status

### Sessions
**Note:** Sessions use spaced repetition algorithm (SM-2) for intelligent study planning

- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/due` - Get sessions due for review today
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
  - Body: `{ name, difficultyScore?, interval?, nextReviewDate?, reviewCount? }`
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `PATCH /api/sessions/:id/review` - Mark session as reviewed
  - Body: `{ difficulty: 'easy' | 'normal' | 'hard' }`

### Spaced Repetition
**Note:** State is now persisted in PostgreSQL (`spaced_repetition_topics` table)

- `POST /api/spaced-repetition/topics` - Load topics into the spaced repetition engine
  - Body: `{ topics: ["Topic 1", "Topic 2", ...] }`
- `GET /api/spaced-repetition/recommendations` - Get complete recommendations
  - Returns: suggested for current session, topics for today, topics for next session, most/least difficult topics
- `GET /api/spaced-repetition/suggested` - Get suggested topics for current session
  - Query param: `?max=5` (default: 5)
- `POST /api/spaced-repetition/save` - Save engine state to database
- `POST /api/spaced-repetition/load` - Load engine state from database

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

### Create Topic (with domain relationship)
```bash
POST /api/topics
Content-Type: application/json

{
  "domain_id": 2,
  "time": "09:15",
  "title": "JavaScript basics",
  "completed": false
}
```

### Get Domain with Topics
```bash
GET /api/domains/2?include_topics=true
```

### Response (Domain with Topics)
```json
{
  "id": 2,
  "time": "14:30",
  "title": "Review math concepts",
  "completed": true,
  "created_at": "2025-11-12T10:00:00.000Z",
  "updated_at": "2025-11-12T10:00:00.000Z",
  "topics": [
    {
      "id": 1,
      "domain_id": 2,
      "time": "09:15",
      "title": "JavaScript basics",
      "completed": false,
      "created_at": "2025-11-12T10:05:00.000Z",
      "updated_at": "2025-11-12T10:05:00.000Z"
    },
    {
      "id": 2,
      "domain_id": 2,
      "time": "13:00",
      "title": "React hooks",
      "completed": true,
      "created_at": "2025-11-12T10:06:00.000Z",
      "updated_at": "2025-11-12T10:06:00.000Z"
    }
  ]
}
```

### Get Topics by Domain
```bash
GET /api/topics?domain_id=2
```

### Response
```json
[
  {
    "id": 1,
    "domain_id": 2,
    "time": "09:15",
    "title": "JavaScript basics",
    "completed": false,
    "created_at": "2025-11-12T10:05:00.000Z",
    "updated_at": "2025-11-12T10:05:00.000Z"
  }
]
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
