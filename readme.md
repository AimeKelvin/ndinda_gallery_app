# Gallery App

A simple full-stack image gallery application where users can view, upload, edit, and delete gallery items.

The project is built as a learning project to practice modern web development technologies including **TypeScript, React, Node.js, PostgreSQL, REST APIs, Git, and GitHub**.

## Features

* View all gallery images
* Upload new images
* Add image titles and descriptions
* Edit existing gallery items
* Replace images
* Delete gallery items
* REST API for communication between frontend and backend
* PostgreSQL database for persistent data storage
* Simple and responsive interface

## Tech Stack

| Technology     | Purpose                                            |
| -------------- | -------------------------------------------------- |
| **TypeScript** | Adds type safety and improves code maintainability |
| **React**      | Builds the interactive frontend                    |
| **Node.js**    | Runs the backend server                            |
| **PostgreSQL** | Stores gallery item information                    |
| **REST API**   | Connects the frontend with the backend             |
| **Git**        | Tracks project changes                             |
| **GitHub**     | Hosts the repository and project history           |

## How the Technologies Are Used

### TypeScript

**What it is:**
TypeScript is a programming language built on top of JavaScript that adds static typing.

**Why we use it:**
It helps catch errors earlier, makes the code easier to understand, and improves maintainability.

**In this project:**
TypeScript is used for React components, API requests, and gallery item data.

---

### React

**What it is:**
React is a JavaScript library for building user interfaces.

**Why we use it:**
It makes it easier to create reusable and interactive UI components.

**In this project:**
React is used to build the gallery, image cards, upload form, and edit interface.

---

### Node.js

**What it is:**
Node.js is a JavaScript runtime that allows JavaScript and TypeScript to run outside the browser.

**Why we use it:**
It allows us to build the backend server and handle requests from the frontend.

**In this project:**
Node.js runs the backend server that handles image uploads and CRUD operations.

---

### PostgreSQL

**What it is:**
PostgreSQL is an open-source relational database management system.

**Why we use it:**
It provides reliable and structured storage for application data.

**In this project:**
PostgreSQL stores gallery item information such as titles, descriptions, image paths, and timestamps.

---

### REST APIs

**What it is:**
A REST API is a way for different parts of an application to communicate over HTTP.

**Why we use it:**
It allows the React frontend and Node.js backend to exchange data in a structured way.

**In this project:**
The frontend communicates with the backend through endpoints such as:

```text
GET    /api/gallery
GET    /api/gallery/:id
POST   /api/gallery
PUT    /api/gallery/:id
DELETE /api/gallery/:id
```

These endpoints provide the basic CRUD operations for the gallery.

---

### Git & GitHub

**What it is:**
Git is a version control system used to track changes in a project. GitHub is a platform for hosting Git repositories online.

**Why we use it:**
They allow us to track development progress, manage changes, and share the project.

**In this project:**
Git is used to document development through meaningful commits, while GitHub hosts the repository.

## Project Structure

```text
gallery-app/
│
├── client/              # React + TypeScript frontend
│   ├── src/
│   └── ...
│
├── server/              # Node.js backend
│   ├── src/
│   ├── uploads/         # Uploaded images
│   └── ...
│
├── README.md
└── package.json
```

## Database Structure

The application uses PostgreSQL with a simple `gallery_items` table.

```text
gallery_items
├── id
├── title
├── description
├── image_url
├── created_at
└── updated_at
```

The database stores the information about each gallery item, while the uploaded image files are stored by the backend.

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm or pnpm
* Git
* VS Code
* PostgreSQL

### Installation

Clone the repository:

```bash
git clone <your-github-repository-url>
cd gallery-app
```

Install the dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory.

Example:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
```

### Run the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The application should then be available at the local development URL provided by the frontend server.

## Git Progress

The project development is documented using meaningful Git commits.

Example:

```text
Initial project setup
Set up PostgreSQL database and REST API
Add gallery CRUD functionality
Add image upload functionality
Improve gallery UI
Finalize documentation
```

At least **3 meaningful commits** are included to demonstrate the development process.

## Learning Objectives

This project provides practical experience with:

* TypeScript
* React
* Node.js
* PostgreSQL
* REST API development
* CRUD operations
* File uploads
* Git and GitHub
* Full-stack application structure

## Status

**In Development**

This project is being developed as part of a technology research and environment setup exercise.
