# Social App

A simple full-stack social media application where users can create an account, log in, and manage posts.

The project is built as a learning project to practice modern web development technologies including **TypeScript, React, Node.js, PostgreSQL, REST APIs, Git, and GitHub**.

## Features

* User registration and login
* User authentication
* View posts
* Create new posts
* Edit your posts
* Delete your posts
* REST API for communication between frontend and backend
* PostgreSQL database for persistent data storage

## Tech Stack

| Technology     | Purpose                                            |
| -------------- | -------------------------------------------------- |
| **TypeScript** | Adds type safety and improves code maintainability |
| **React**      | Builds the interactive frontend                    |
| **Node.js**    | Runs the backend server                            |
| **PostgreSQL** | Stores users and posts                             |
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
TypeScript is used for React components, API requests, user data, and post types.

---

### React

**What it is:**
React is a JavaScript library for building user interfaces.

**Why we use it:**
It makes it easier to create reusable and interactive UI components.

**In this project:**
React is used to build the login page, post feed, post forms, and post editing interface.

---

### Node.js

**What it is:**
Node.js is a JavaScript runtime that allows JavaScript and TypeScript to run outside the browser.

**Why we use it:**
It allows us to build the backend server and handle requests from the frontend.

**In this project:**
Node.js runs the server that handles authentication and CRUD operations for posts.

---

### PostgreSQL

**What it is:**
PostgreSQL is an open-source relational database management system.

**Why we use it:**
It provides reliable and structured storage for application data.

**In this project:**
PostgreSQL stores users, authentication-related information, and posts.

---

### REST APIs

**What it is:**
A REST API is a way for different parts of an application to communicate over HTTP.

**Why we use it:**
It allows the React frontend and Node.js backend to exchange data in a structured way.

**In this project:**
The frontend communicates with endpoints such as:

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/posts
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
```

---

### Git & GitHub

**What it is:**
Git is a version control system used to track changes in a project. GitHub is a platform for hosting Git repositories online.

**Why we use it:**
They allow us to track development progress, safely manage changes, and share the project.

**In this project:**
Git is used to document development through meaningful commits, while GitHub hosts the repository.

## Project Structure

```text
social-app/
├── client/          # React + TypeScript frontend
│   ├── src/
│   └── ...
│
├── server/          # Node.js backend
│   ├── src/
│   └── ...
│
├── README.md
└── package.json
```

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
cd social-app
```

Install dependencies:

```bash
npm install
```

If the frontend and backend have separate dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

### Environment Variables

Create a `.env` file in the backend directory and configure your database connection and other required variables.

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

The application should then be available through the local development URL shown by the frontend server.

## Git Progress

The project development is documented using Git commits.

Example progress:

```text
Initial project setup
Add authentication and database configuration
Add post CRUD functionality
Improve frontend UI
Fix bugs and finalize documentation
```

At least **3 meaningful commits** are included to demonstrate the development process.

## Learning Objectives

This project is designed to provide practical experience with:

* TypeScript
* React
* Node.js
* PostgreSQL
* REST API development
* Authentication
* CRUD operations
* Git and GitHub
* Full-stack application structure

## Status

**In Development**

The application is being developed as part of a technology research and setup exercise.
