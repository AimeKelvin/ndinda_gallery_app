# Gallery App — React + Express + PostgreSQL

A full-stack image gallery built with **React, Express, TypeScript, and PostgreSQL**.

Users can upload, view, edit, replace, search, and delete images. Images are stored locally while PostgreSQL stores their metadata.

<table>
  <tr>
    <td width="50%">
      <img src="https://i.pinimg.com/736x/5d/a9/45/5da9452b6a0f86f7c4f68c0e13ce5b99.jpg" alt="Gallery illustration 1" width="100%">
    </td>
    <td width="50%">
      <img src="https://i.pinimg.com/736x/e6/d8/df/e6d8df35632f9d1338936b48212f988f.jpg" alt="Gallery illustration 2" width="100%">
    </td>
  </tr>
</table>

## ✨ Features

* Upload images with metadata
* View and search gallery items
* Edit titles and descriptions
* Replace existing images
* Delete images
* PostgreSQL database with migrations
* REST API with Express
* Layered backend architecture
* TypeScript throughout the application
* Local image storage
* Centralized error handling

## 🏗️ Architecture

The backend follows a simple layered structure:

```text
Request
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

### Responsibilities

| Layer      | Responsibility                             |
| ---------- | ------------------------------------------ |
| Route      | Defines API endpoints                      |
| Middleware | Handles reusable request logic and uploads |
| Controller | Handles HTTP requests/responses            |
| Service    | Business logic and validation              |
| Repository | PostgreSQL queries                         |
| PostgreSQL | Persistent data storage                    |

This keeps database logic, business logic, and HTTP logic separated.

## 📁 Project Structure

```text
.
├── client/
│   └── src/
│       ├── components/
│       │   ├── gallery/
│       │   └── ui/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── App.tsx
│       ├── main.tsx
│       └── styles.css
│
├── server/
│   ├── uploads/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── routes/
│       ├── middleware/
│       ├── database/
│       ├── types/
│       ├── utils/
│       ├── app.ts
│       └── index.ts
│
├── package.json
└── README.md
```

## 🛠️ Requirements

* Node.js 18+ (20+ recommended)
* npm
* PostgreSQL
* No Docker required

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
npm run install:all
```

### 2. Create the database

Create a PostgreSQL database named:

```text
gallery_app
```

For example:

```bash
createdb gallery_app
```

### 3. Configure environment variables

Copy the example files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Backend:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/gallery_app
CLIENT_ORIGIN=http://localhost:5173
```

Frontend:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the migration

```bash
npm run db:migrate
```

This creates the `gallery_items` table.

### 5. Start the application

```bash
npm run dev
```

The application will run at:

```text
Frontend → http://localhost:5173
API      → http://localhost:5000
```

## 🔌 API

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | `/api/health`      | Health check        |
| GET    | `/api/gallery`     | Get all images      |
| GET    | `/api/gallery/:id` | Get one image       |
| POST   | `/api/gallery`     | Create gallery item |
| PUT    | `/api/gallery/:id` | Update gallery item |
| DELETE | `/api/gallery/:id` | Delete gallery item |

Images are uploaded using `multipart/form-data`.

Supported formats:

```text
JPEG · PNG · WEBP · GIF
```

Maximum size:

```text
8 MB
```

## 🗄️ Database

The main table is:

```sql
gallery_items
```

```text
id
title
description
image_url
created_at
updated_at
```

PostgreSQL stores the image metadata and file path. The actual image files are stored in:

```text
server/uploads/
```

## 🍃 MongoDB → PostgreSQL

If you're coming from MongoDB/Mongoose, the basic mapping is:

| MongoDB               | PostgreSQL  |
| --------------------- | ----------- |
| Database              | Database    |
| Collection            | Table       |
| Document              | Row         |
| Field                 | Column      |
| `_id`                 | Primary key |
| `find()`              | `SELECT`    |
| `create()`            | `INSERT`    |
| `findByIdAndUpdate()` | `UPDATE`    |
| `findByIdAndDelete()` | `DELETE`    |
| `populate()`          | `JOIN`      |
| Mongoose Model        | Repository  |

The biggest difference is that `pg` is a database driver rather than a full ORM/model layer. The repository therefore provides the application's explicit data-access layer.

## 🖼️ Image Lifecycle

When an image is uploaded:

```text
React
  ↓
Express
  ↓
Multer
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

The image itself goes to:

```text
server/uploads/
```

PostgreSQL stores its path.

When an image is replaced, the new file is saved first and the old file is removed only after the database update succeeds.

## 🔐 Security Basics

The project includes:

* Parameterized SQL queries
* File type validation
* 8 MB upload limit
* Safe generated filenames
* Restricted upload deletion
* Environment variables for credentials
* CORS configuration
* Centralized error handling

For a public production deployment, add authentication, rate limiting, HTTPS, object storage, backups, logging, and additional file/content security.

## 📦 Useful Commands

```bash
# Install root dependencies
npm install

# Install client + server dependencies
npm run install:all

# Run database migration
npm run db:migrate

# Start frontend + backend
npm run dev

# Build the application
npm run build

# Start compiled backend
npm start
```

## License

Built as a learning project and a foundation for extending into a larger gallery application.
