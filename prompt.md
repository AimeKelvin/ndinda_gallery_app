Build/refactor my **Gallery App** into a clean, modular, professional full-stack application using **React + TypeScript + Node.js + Express + PostgreSQL**, with **no Docker**.

I normally work with **MongoDB/Mongoose**, so I am currently transitioning to **PostgreSQL** and need the codebase to be structured professionally while also being educational. Do NOT give me one giant `index.ts` file. I want a proper layered architecture.

## 1. Core Application

The application is a simple image gallery where users can:

* View gallery items
* Upload an image
* Add a title
* Add a description
* Edit an existing gallery item
* Replace an image
* Delete a gallery item
* Search/filter gallery items
* View the gallery responsively

Each gallery item should contain:

```text
id
title
description
image_url
created_at
updated_at
```

Images should be stored locally in:

```text
server/uploads/
```

PostgreSQL should store the image URL/path, not the binary image itself.

---

# 2. REQUIRED BACKEND ARCHITECTURE

Do NOT put the backend into one large file.

Use this structure:

```text
server/
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── controllers/
│   │   └── gallery.controller.ts
│   │
│   ├── services/
│   │   └── gallery.service.ts
│   │
│   ├── repositories/
│   │   └── gallery.repository.ts
│   │
│   ├── routes/
│   │   └── gallery.routes.ts
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   ├── notFound.middleware.ts
│   │   └── upload.middleware.ts
│   │
│   ├── database/
│   │   ├── connection.ts
│   │   └── migrations/
│   │       └── 001_create_gallery_items.sql
│   │
│   ├── types/
│   │   └── gallery.types.ts
│   │
│   ├── utils/
│   │   └── file.utils.ts
│   │
│   ├── app.ts
│   └── index.ts
│
└── uploads/
    └── .gitkeep
```

The architecture must follow:

```text
HTTP Request
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

Explain this architecture clearly in the README and comments.

---

# 3. VERY IMPORTANT — EDUCATIONAL COMMENTS

I don't normally use PostgreSQL. I mostly use MongoDB/Mongoose.

Therefore, **EVERY important file must contain useful explanatory comments**.

Do NOT add meaningless comments such as:

```ts
// import express
import express from "express";
```

Instead explain the reasoning.

For example:

```ts
// MongoDB/Mongoose equivalent:
// This repository is roughly where your Mongoose model/database
// operations would normally live.
//
// Instead of calling something like:
// Gallery.find()
//
// PostgreSQL uses SQL queries executed through the pg library.
```

Comments should help me understand the transition:

```text
MongoDB/Mongoose concept
        ↓
PostgreSQL equivalent
```

For example, explain concepts such as:

* MongoDB collection → PostgreSQL table
* MongoDB document → PostgreSQL row
* MongoDB field → PostgreSQL column
* Mongoose schema → PostgreSQL table schema
* Mongoose model → repository/data-access layer
* `Model.find()` → `SELECT`
* `Model.findById()` → `SELECT ... WHERE id = $1`
* `Model.create()` → `INSERT`
* `Model.findByIdAndUpdate()` → `UPDATE`
* `Model.findByIdAndDelete()` → `DELETE`
* MongoDB `_id` → PostgreSQL primary key
* ObjectId → PostgreSQL integer/UUID
* Mongoose validation → application validation + database constraints
* MongoDB connection → PostgreSQL connection pool
* Aggregation pipelines → SQL queries / joins / CTEs where appropriate

Do not assume I already understand SQL.

---

# 4. PostgreSQL CONNECTION

Use the `pg` Node.js package.

Use a PostgreSQL connection pool.

Example environment:

```env
PORT=5000
DATABASE_URL=postgresql://hobby@localhost:5432/gallery_app
CLIENT_ORIGIN=http://localhost:5173
```

Do not hardcode credentials.

Create:

```text
server/src/config/env.ts
server/src/database/connection.ts
```

Explain:

* What a PostgreSQL connection is
* What a connection pool is
* Why we use a pool
* What `DATABASE_URL` means
* Why the PostgreSQL user/database appear in the connection string

Explain how this differs from:

```js
mongoose.connect(MONGODB_URI)
```

---

# 5. DATABASE MIGRATIONS

Do NOT hide table creation inside `index.ts`.

Use:

```text
server/src/database/migrations/001_create_gallery_items.sql
```

The migration should create:

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

Explain every part of this SQL.

For example:

```text
SERIAL
PRIMARY KEY
VARCHAR
TEXT
NOT NULL
TIMESTAMP
DEFAULT
```

Also explain the MongoDB equivalent.

If appropriate, create a simple migration runner so I can run something like:

```bash
npm run db:migrate
```

Do not introduce a huge migration framework unless necessary.

---

# 6. REPOSITORY LAYER

Create:

```text
gallery.repository.ts
```

The repository should contain PostgreSQL queries.

For example:

```text
findAll()
findById()
create()
update()
delete()
```

Keep SQL here rather than inside controllers.

Every query should use parameterized queries:

```ts
WHERE id = $1
```

Never concatenate user input directly into SQL.

Explain why parameterized queries are important and compare them to MongoDB query objects.

---

# 7. SERVICE LAYER

Create:

```text
gallery.service.ts
```

The service should contain business logic.

Controllers should NOT contain business logic.

Explain why we separate:

```text
Controller
Service
Repository
```

Use practical examples.

For example:

```text
Controller:
"What HTTP request did the user make?"

Service:
"What should the application do?"

Repository:
"How do we store/retrieve it from PostgreSQL?"
```

---

# 8. CONTROLLER LAYER

Create:

```text
gallery.controller.ts
```

Implement:

```text
GET /api/gallery
GET /api/gallery/:id
POST /api/gallery
PUT /api/gallery/:id
DELETE /api/gallery/:id
```

Controllers should:

* Receive `req`
* Call the service
* Return appropriate HTTP status codes
* Handle errors through centralized error middleware

Do not put SQL inside controllers.

---

# 9. ROUTES

Create:

```text
gallery.routes.ts
```

Routes should only define endpoint → controller relationships.

For example:

```text
GET /
GET /:id
POST /
PUT /:id
DELETE /:id
```

Explain what Express Router is and why it is better than putting every route directly into `index.ts`.

---

# 10. MIDDLEWARE

Create separate middleware for:

### Uploads

Use `multer`.

Support:

```text
JPEG
PNG
WEBP
GIF
```

Maximum file size:

```text
8 MB
```

### Error handling

Create:

```text
error.middleware.ts
```

Centralize API errors.

### Not found

Create:

```text
notFound.middleware.ts
```

Return proper JSON for unknown routes.

Explain what Express middleware is and compare it to middleware patterns I may already know from Express + MongoDB projects.

---

# 11. FILE MANAGEMENT

Create:

```text
file.utils.ts
```

Handle:

* File paths
* Safe file deletion
* Uploaded file handling

When an image is replaced:

1. Upload new image
2. Update PostgreSQL record
3. Remove old image

When a gallery item is deleted:

1. Delete database record
2. Delete corresponding image file

Handle errors carefully so orphaned files are minimized.

---

# 12. TYPESCRIPT

Use strict TypeScript.

Avoid:

```ts
any
```

unless genuinely unavoidable.

Define proper types/interfaces for:

```text
GalleryItem
CreateGalleryItemInput
UpdateGalleryItemInput
```

Explain TypeScript types as they relate to the database schema.

---

# 13. FRONTEND

Use:

```text
React
TypeScript
Vite
```

Structure it modularly too.

Use something similar to:

```text
client/src/
├── components/
│   ├── gallery/
│   │   ├── GalleryCard.tsx
│   │   ├── GalleryGrid.tsx
│   │   ├── GalleryModal.tsx
│   │   └── DeleteDialog.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       └── Spinner.tsx
│
├── pages/
│   └── GalleryPage.tsx
│
├── hooks/
│   └── useGallery.ts
│
├── services/
│   └── galleryApi.ts
│
├── types/
│   └── gallery.ts
│
├── utils/
│   └── formatDate.ts
│
├── App.tsx
├── main.tsx
└── styles.css
```

Do not put the entire frontend into `App.tsx`.

---

# 14. API SERVICE

Create:

```text
galleryApi.ts
```

It should handle:

```text
getGallery()
getGalleryItem()
createGalleryItem()
updateGalleryItem()
deleteGalleryItem()
```

Explain that this is analogous to separating API/database calls from UI components.

---

# 15. UI

Make the UI clean and modern but simple.

Requirements:

* Responsive
* Good empty state
* Loading state
* Error state
* Upload form
* Edit form
* Delete confirmation
* Image preview
* Search
* Refresh
* Proper form validation
* Accessible buttons and inputs

Do not overdesign it.

---

# 16. ERROR HANDLING

Implement consistent API responses.

For example:

```json
{
  "success": false,
  "message": "Gallery item not found"
}
```

and:

```json
{
  "success": true,
  "data": {}
}
```

Use proper HTTP status codes:

```text
200
201
400
404
500
```

Explain why each is used.

---

# 17. README

Create a very detailed README.

It must explain:

1. Project overview
2. Architecture
3. Folder structure
4. Installation
5. PostgreSQL installation
6. Creating `gallery_app`
7. Configuring `.env`
8. Running migrations
9. Starting backend
10. Starting frontend
11. API endpoints
12. Database schema
13. Image storage
14. DBeaver usage
15. PostgreSQL basics for a MongoDB developer
16. MongoDB vs PostgreSQL comparison
17. Common errors and fixes

Include commands such as:

```bash
npm install
npm run install:all
npm run db:migrate
npm run dev
```

---

# 18. MONGODB → POSTGRESQL CHEAT SHEET

Include a section like:

```text
MongoDB                     PostgreSQL

Database                    Database
Collection                  Table
Document                    Row
Field                       Column
ObjectId                    SERIAL / UUID
Schema                      Table definition
Mongoose Model              Repository / data-access layer
find()                      SELECT
findOne()                   SELECT ... WHERE
create()                    INSERT
findByIdAndUpdate()         UPDATE
findByIdAndDelete()         DELETE
populate()                  JOIN
Aggregation                 SQL / JOIN / CTE
```

But explain each one rather than merely listing it.

---

# 19. PACKAGE MANAGEMENT

Use sensible dependencies only.

Backend should use things such as:

```text
express
cors
dotenv
pg
multer
```

Development dependencies should include the appropriate TypeScript tooling.

Frontend should use React + Vite + TypeScript.

Do not add unnecessary libraries simply to make the project appear sophisticated.

---

# 20. SECURITY

Implement reasonable basic security:

* Parameterized SQL
* File type validation
* File size validation
* Environment variables
* Proper CORS configuration
* Safe file names
* No database credentials in source code
* No sensitive `.env` files committed to Git

Do not claim the application is production-secure if it isn't.

---

# 21. CODE COMMENTS — VERY IMPORTANT

Every major file must begin with a short comment explaining:

1. What this file is responsible for
2. Where it sits in the architecture
3. What it is equivalent to in a typical MongoDB/Mongoose application

For example:

```ts
/**
 * Gallery Repository
 *
 * Responsibility:
 * Handles all direct PostgreSQL database operations for gallery items.
 *
 * MongoDB/Mongoose comparison:
 * This is roughly where operations such as:
 *
 *   Gallery.find()
 *   Gallery.findById()
 *   Gallery.create()
 *
 * would be represented.
 *
 * Unlike Mongoose, PostgreSQL does not give us a model with
 * methods like .find(). We explicitly write SQL queries.
 */
```

Do this throughout the backend.

However, **do not comment every obvious line**. Comments should explain architecture, PostgreSQL concepts, decisions, and non-obvious code.

---

# 22. TEACH ME AS YOU BUILD

After generating the code, provide a section called:

```text
HOW THIS WORKS IF YOU KNOW MONGODB
```

Walk through one complete request:

```text
User uploads image
        ↓
React
        ↓
POST /api/gallery
        ↓
Express route
        ↓
Multer middleware
        ↓
Controller
        ↓
Service
        ↓
Repository
        ↓
INSERT INTO gallery_items
        ↓
PostgreSQL
        ↓
Response
        ↓
React updates UI
```

Then explain the equivalent flow in a typical MongoDB/Mongoose application.

---

# 23. DO NOT CHEAT

Do NOT:

* Put everything into `index.ts`
* Put SQL into controllers
* Put business logic into routes
* Put database logic into React
* Use `any` everywhere
* Hardcode database credentials
* Store uploaded image binaries in PostgreSQL
* Automatically create tables inside application startup
* Give me pseudo-code
* Leave TODO placeholders
* Give me incomplete files
* Tell me to "implement this part myself"
* Skip configuration files
* Skip error handling
* Skip README
* Skip `.env.example`

I want a **complete runnable project**.

---

# 24. FINAL DELIVERABLE

Give me the complete project with every file fully implemented.

I should be able to:

```bash
npm install
npm run install:all
npm run db:migrate
npm run dev
```

and have:

```text
React frontend
        ↓
Express REST API
        ↓
PostgreSQL
```

working end-to-end.

Make the project simple enough for someone transitioning from MongoDB to understand, but architected professionally enough that I can later add:

```text
authentication
users
favorites
comments
categories
pagination
```

without rewriting the entire application.

Most importantly:

**Teach me PostgreSQL through the architecture. Don't just replace MongoDB syntax with SQL. Explain why the architecture works this way.**
