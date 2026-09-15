# Gallery App — React + Express + PostgreSQL

A small full-stack image gallery built to be easy to extend **and** to teach PostgreSQL to a developer who already knows MongoDB/Mongoose.

Users can view, search, upload, edit, replace, and delete gallery images. Images live on disk in `server/uploads/`; PostgreSQL stores only the image path plus metadata.

## Architecture

The backend uses a layered request flow:

```text
HTTP request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

Why split it this way?

- **Route** answers: “Which handler should run for this HTTP method/path?”
- **Middleware** handles reusable request concerns such as image uploads.
- **Controller** answers: “What HTTP request did the user make?” It reads `req`, calls a service, and sends an HTTP response.
- **Service** answers: “What should the application do?” It owns validation and file-lifecycle/business rules.
- **Repository** answers: “How is this data stored/retrieved?” It owns SQL and nothing else.
- **PostgreSQL** persists rows in a table.

In a small Mongoose app you may be used to `Gallery.find()` directly inside a route/controller. That works at first, but it couples HTTP code, business behavior, and storage. Here the repository replaces the “database-method” role of a Mongoose model, while the service creates a clean place for logic that should survive if the transport or database changes later.

## Folder structure

```text
.
├── package.json
├── README.md
├── client/
│   ├── .env.example
│   └── src/
│       ├── components/
│       │   ├── gallery/
│       │   │   ├── GalleryCard.tsx
│       │   │   ├── GalleryGrid.tsx
│       │   │   ├── GalleryModal.tsx
│       │   │   └── DeleteDialog.tsx
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Spinner.tsx
│       │       └── Textarea.tsx
│       ├── hooks/useGallery.ts
│       ├── pages/GalleryPage.tsx
│       ├── services/galleryApi.ts
│       ├── types/gallery.ts
│       ├── utils/formatDate.ts
│       ├── App.tsx
│       ├── main.tsx
│       └── styles.css
└── server/
    ├── .env.example
    ├── uploads/.gitkeep
    └── src/
        ├── config/env.ts
        ├── controllers/gallery.controller.ts
        ├── services/gallery.service.ts
        ├── repositories/gallery.repository.ts
        ├── routes/gallery.routes.ts
        ├── middleware/
        │   ├── error.middleware.ts
        │   ├── notFound.middleware.ts
        │   └── upload.middleware.ts
        ├── database/
        │   ├── connection.ts
        │   ├── migrate.ts
        │   └── migrations/001_create_gallery_items.sql
        ├── types/gallery.types.ts
        ├── utils/
        │   ├── app-error.ts
        │   └── file.utils.ts
        ├── app.ts
        └── index.ts
```

## Requirements

- Node.js 18+ (Node 20+ recommended)
- npm
- PostgreSQL installed and running

No Docker is required.

## 1. Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

`npm install` installs the root development dependency (`concurrently`). `npm run install:all` installs both backend and frontend dependencies.

## 2. Install PostgreSQL

### macOS (Homebrew)

```bash
brew install postgresql@16
brew services start postgresql@16
```

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

### Windows

Install PostgreSQL using the official PostgreSQL installer, keep the PostgreSQL service running, and remember the username/password you choose during setup.

## 3. Create the database

A PostgreSQL **database** is the container that holds tables, indexes, views, and other database objects. It is not the same thing as a MongoDB collection.

If your local PostgreSQL user is your OS username and does not require a password:

```bash
createdb gallery_app
```

Or via `psql`:

```sql
CREATE DATABASE gallery_app;
```

You can inspect users with:

```sql
\du
```

And databases with:

```sql
\l
```

## 4. Configure environment variables

Copy the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Example backend configuration:

```env
PORT=5000
DATABASE_URL=postgresql://hobby@localhost:5432/gallery_app
CLIENT_ORIGIN=http://localhost:5173
```

Example frontend configuration:

```env
VITE_API_URL=http://localhost:5000
```

### What `DATABASE_URL` means

```text
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

For example:

```text
postgresql://hobby@localhost:5432/gallery_app
```

means:

- protocol: PostgreSQL
- PostgreSQL user: `hobby`
- host: your own machine (`localhost`)
- PostgreSQL port: `5432`
- database: `gallery_app`

If your user has a password:

```env
DATABASE_URL=postgresql://hobby:your_password@localhost:5432/gallery_app
```

Do **not** commit `.env`. The project `.gitignore` excludes it.

### `mongoose.connect()` vs `pg` Pool

MongoDB/Mongoose often looks like:

```js
await mongoose.connect(MONGODB_URI)
```

This project uses:

```ts
new Pool({ connectionString: DATABASE_URL })
```

A PostgreSQL **connection** is one live network session to the server. Opening a new connection for every HTTP request is expensive, so `pg.Pool` maintains reusable connections. Repository queries borrow a connection from that pool and release it automatically after `pool.query(...)` completes.

## 5. Run the database migration

```bash
npm run db:migrate
```

This executes `server/src/database/migrations/001_create_gallery_items.sql`.

The application **does not create tables automatically on server startup**. That is intentional: schema changes are explicit and auditable.

Migration:

```sql
CREATE TABLE IF NOT EXISTS gallery_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SQL explained

- `CREATE TABLE`: creates a PostgreSQL table. MongoDB equivalent: conceptually creating/using a collection.
- `IF NOT EXISTS`: avoids an error if this table already exists.
- `id`: a column. MongoDB equivalent: a document field.
- `SERIAL`: PostgreSQL shorthand for an auto-incrementing integer sequence. Here it plays a role similar to an automatically generated MongoDB `_id`, though the type is an integer rather than an ObjectId.
- `PRIMARY KEY`: unique row identifier. PostgreSQL enforces uniqueness and non-nullness.
- `VARCHAR(255)`: text with a maximum length of 255 characters.
- `NOT NULL`: the database rejects rows missing this value. Similar in intent to `required: true` in a Mongoose schema, but enforced by PostgreSQL itself.
- `TEXT`: variable-length text without the 255-character bound.
- `TIMESTAMP`: stores a date + time value.
- `DEFAULT CURRENT_TIMESTAMP`: if an `INSERT` does not supply the column, PostgreSQL fills in the current timestamp.

Unlike a Mongoose schema, a PostgreSQL table definition is enforced by the database independently of your Node.js process.

## 6. Start the app

From the project root:

```bash
npm run dev
```

This starts:

- React/Vite: `http://localhost:5173`
- Express API: `http://localhost:5000`

Build both apps:

```bash
npm run build
```

Run the compiled backend:

```bash
npm start
```

## API endpoints

| Method | Endpoint | Purpose | Success status |
|---|---|---|---|
| GET | `/api/health` | Health check | `200` |
| GET | `/api/gallery` | Get all gallery items | `200` |
| GET | `/api/gallery/:id` | Get one item | `200` |
| POST | `/api/gallery` | Create item + upload image | `201` |
| PUT | `/api/gallery/:id` | Edit item / optionally replace image | `200` |
| DELETE | `/api/gallery/:id` | Delete item and image | `200` |

POST/PUT use `multipart/form-data` fields:

```text
title       required
description optional
image       required on create, optional on update
```

Supported image types: JPEG, PNG, WEBP, GIF. Maximum file size: **8 MB**.

## Consistent API responses

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Failure response:

```json
{
  "success": false,
  "message": "Gallery item not found"
}
```

Status codes used:

- `200 OK`: successful read/update/delete.
- `201 Created`: a new gallery row was created.
- `400 Bad Request`: invalid ID, bad form data, unsupported image, oversized file.
- `404 Not Found`: item or API route does not exist.
- `500 Internal Server Error`: unexpected server/database failure.

## Database schema and TypeScript

PostgreSQL is the runtime source of truth for persisted data. TypeScript interfaces mirror that shape so mistakes can be caught while coding.

```text
PostgreSQL column     TypeScript
id INTEGER            number
title VARCHAR         string
description TEXT      string | null
image_url TEXT        string
created_at TIMESTAMP  Date on backend / string after JSON
updated_at TIMESTAMP  Date on backend / string after JSON
```

TypeScript does **not** replace database constraints. It disappears when compiled to JavaScript. PostgreSQL constraints still protect the data even if another client accesses the database.

## Image storage

Uploaded files are stored in:

```text
server/uploads/
```

PostgreSQL stores only a path such as:

```text
/uploads/1789466834376-uuid.jpg
```

Express exposes that directory at `/uploads`, and the frontend combines it with `VITE_API_URL`.

When replacing an image:

1. Multer stores the new file.
2. Service validates the request.
3. Repository updates PostgreSQL.
4. Only after the DB update succeeds, the old file is removed.
5. If the DB update fails, the newly uploaded file is cleaned up.

When deleting:

1. Repository deletes the database row and returns it using SQL `RETURNING`.
2. Service safely deletes the associated local file.

This ordering reduces orphaned files and avoids deleting the old image before the database has safely moved to the new one.

## Repository queries: PostgreSQL vs Mongoose

The repository is the only backend layer containing SQL.

Mongoose:

```js
Gallery.find()
```

PostgreSQL:

```sql
SELECT ... FROM gallery_items;
```

Mongoose:

```js
Gallery.findById(id)
```

PostgreSQL:

```sql
SELECT ... FROM gallery_items WHERE id = $1;
```

Mongoose:

```js
Gallery.create(data)
```

PostgreSQL:

```sql
INSERT INTO gallery_items (...) VALUES ($1, $2, $3) RETURNING ...;
```

Mongoose:

```js
Gallery.findByIdAndUpdate(id, update, { new: true })
```

PostgreSQL:

```sql
UPDATE gallery_items SET ... WHERE id = $4 RETURNING ...;
```

Mongoose:

```js
Gallery.findByIdAndDelete(id)
```

PostgreSQL:

```sql
DELETE FROM gallery_items WHERE id = $1 RETURNING ...;
```

### Why `$1` instead of string interpolation?

This is a parameterized query:

```ts
pool.query("SELECT * FROM gallery_items WHERE id = $1", [id])
```

The SQL command and the user-supplied value are sent separately. That means a malicious string cannot turn itself into extra SQL syntax. Never build SQL like:

```ts
`SELECT * FROM gallery_items WHERE title = '${userInput}'`
```

MongoDB query objects feel different syntactically, but the principle is the same: pass values as data rather than constructing executable query text from untrusted input.

## MongoDB → PostgreSQL cheat sheet

| MongoDB / Mongoose | PostgreSQL | Meaning |
|---|---|---|
| Database | Database | Top-level logical data container. |
| Collection | Table | A named set of records of one general kind. |
| Document | Row | One persisted record, such as one gallery item. |
| Field | Column | One named piece of data on a record. |
| `_id` / ObjectId | Primary key (`SERIAL` / UUID) | Unique identifier. This project uses an auto-incrementing integer. |
| Mongoose schema | Table definition + constraints | Defines allowed columns/types/rules. PostgreSQL enforces this independently of Node. |
| Mongoose model | Repository/data-access layer | The place app code goes to query persisted data. With raw `pg`, we explicitly build this layer. |
| `find()` | `SELECT` | Reads multiple rows. |
| `findOne()` | `SELECT ... WHERE ... LIMIT 1` | Reads a row matching a condition. |
| `create()` | `INSERT` | Adds a row. |
| `findByIdAndUpdate()` | `UPDATE ... WHERE ...` | Changes an existing row. |
| `findByIdAndDelete()` | `DELETE ... WHERE ...` | Removes a row. |
| `populate()` | `JOIN` | Combines related rows from tables. |
| Aggregation pipeline | SQL queries / JOIN / GROUP BY / CTE | Transforms, groups, filters, or combines data. |

### Schema flexibility difference

MongoDB documents in one collection can have different shapes. A PostgreSQL table is structured: every row follows the table's column definitions. Nullable columns can be empty, but the set of columns is centrally defined.

That stricter schema is helpful for integrity. The tradeoff is that schema changes should be managed intentionally through migrations.

## DBeaver quick start

DBeaver is a GUI database client; it does not replace PostgreSQL itself.

1. Install/open DBeaver.
2. Create a **PostgreSQL** connection.
3. Host: `localhost`.
4. Port: `5432`.
5. Database: `gallery_app`.
6. Username/password: the same credentials used in `DATABASE_URL`.
7. Test connection, then connect.
8. Expand `gallery_app` → `Schemas` → `public` → `Tables` → `gallery_items`.
9. Right-click `gallery_items` → View Data to see rows.

Try this in DBeaver's SQL editor:

```sql
SELECT *
FROM gallery_items
ORDER BY created_at DESC;
```

That is roughly the SQL equivalent of a Mongoose `find().sort({ createdAt: -1 })`.

## Security notes

Implemented basics:

- parameterized SQL queries
- file MIME allowlist
- 8 MB upload limit
- generated safe filenames
- upload deletion restricted to `server/uploads`
- environment variables for DB credentials
- CORS restricted to `CLIENT_ORIGIN`
- `.env` excluded from Git
- centralized errors that do not expose raw DB errors to clients

This is a learning/small-app baseline, **not a claim of production security**. Before deploying publicly, consider authentication/authorization, request-rate limiting, reverse-proxy hardening, secure object storage, content scanning, HTTPS, structured logging, backups, and a more robust migration strategy.

## Common errors and fixes

### `DATABASE_URL is required`

Create `server/.env` from `server/.env.example` and ensure you run backend commands from the `server` package (the root scripts already do this correctly).

### `database "gallery_app" does not exist`

Create it:

```bash
createdb gallery_app
```

or run `CREATE DATABASE gallery_app;` in `psql`/DBeaver.

### `role "hobby" does not exist`

The example username is only an example. Replace `hobby` in `DATABASE_URL` with your real PostgreSQL user. `psql -c '\du'` can show roles.

### `password authentication failed`

Your connection-string username/password does not match PostgreSQL. Correct the credentials or configure your local PostgreSQL user appropriately.

### `relation "gallery_items" does not exist`

You have not run the migration against the database currently in `DATABASE_URL`:

```bash
npm run db:migrate
```

### Browser shows CORS error

Make sure backend `.env` has:

```env
CLIENT_ORIGIN=http://localhost:5173
```

Restart the backend after changing environment variables.

### Images return 404

Confirm the file still exists under `server/uploads/` and `VITE_API_URL` points at the Express server, normally `http://localhost:5000`.

### Port already in use

Change `PORT` in `server/.env`. If you change the API port, also update `VITE_API_URL` in `client/.env`.

## HOW THIS WORKS IF YOU KNOW MONGODB

Follow one upload all the way through:

```text
User chooses image + enters text
        ↓
React GalleryModal
        ↓
useGallery hook
        ↓
galleryApi.ts builds FormData
        ↓
POST /api/gallery
        ↓
Express gallery route
        ↓
Multer upload middleware
        ↓
Gallery controller
        ↓
Gallery service
        ↓
Gallery repository
        ↓
INSERT INTO gallery_items (...)
        ↓
PostgreSQL stores a row
        ↓
Repository returns the inserted row
        ↓
Service returns it
        ↓
Controller sends { success: true, data: ... }
        ↓
React inserts the returned item into UI state
```

### The same mental model in a typical Mongoose app

You might write:

```text
POST route
   ↓
Multer
   ↓
controller
   ↓
Gallery.create({ title, description, imageUrl })
   ↓
MongoDB collection
```

In this project, the important shift is not merely replacing `Gallery.create()` with an `INSERT`. We expose the responsibilities that Mongoose often bundles together:

1. **Mongoose model** gives you a schema plus query methods.
2. **PostgreSQL** gives you the table/schema and SQL engine.
3. **`pg`** gives you a driver/connection pool, not a rich model API.
4. Therefore **the repository** becomes your explicit data-access API.
5. **The service** prevents controllers from becoming a new “everything file.”

So when you later add `users`, `favorites`, `comments`, or `categories`, you can create parallel route/controller/service/repository modules instead of rewriting the gallery feature.

### What happens when relationships arrive?

Suppose a future `comments` table has `gallery_item_id`. In MongoDB you might store an ObjectId reference and use `populate()`. PostgreSQL typically uses a **foreign key** and a `JOIN`. That relationship can be enforced by PostgreSQL itself, which is one of the major advantages of a relational database.

## Useful commands

```bash
# root dependencies
npm install

# client + server dependencies
npm run install:all

# create/update PostgreSQL schema
npm run db:migrate

# run frontend + backend together
npm run dev

# compile both projects
npm run build

# run compiled backend
npm start
```
