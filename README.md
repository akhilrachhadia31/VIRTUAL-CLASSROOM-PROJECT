# Learnify

## Description
Learnify is a platform that combines class management tools with a system for delivering educational content. Educators can organize classes and upload lectures with supporting materials. It provides a streamlined experience for educators to manage learning and for students to access lessons, assignments, and resources in a single location.
The aim is to create a user-friendly and efficient platform for educators and students to manage and engage in learning activities. Learnify will enable class organization, assignment distribution and seamless access to educational resources, fostering an interactive and collaborative learning environment.

## Tech Stack
- **Frontend**: React+Vite, CSS/TailwindCSS
- **Backend**: Node.js, Express.js
- **Storage**: Firebase(Video lectures & materials)
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT

## Features
- User authentication (JWT-based)
- CRUD operations for All Models
- Create, organize, and manage multiple classes
- Announcements for class updates
- Separate dashboards for students and educators
- Material Upload/download
- Video upload
- Mail Functionality(node mailer)

## Project Structure


```bash
├── client/                   # Frontend React application
│   ├── public/               # Public assets (HTML, favicons, etc.)
│   └── src/                  # Source files for the React app
│       ├── assets/           # Static files like images, logos, etc.
│       ├── components/       # Reusable React components (UI elements, forms, etc.)
│       ├── firebase/         # Firebase setup and configuration files
│       ├── hooks/            # Custom React hooks for managing state and side-effects
│       ├── pages/            # Page components (Login, Dashboard, etc.)
│       ├── services/         # API calls and data handling logic
│       └── App.jsx           # Main entry point for the React application
├── server/                   # Backend Express server
│   ├── config/               # Database and environment configuration (e.g., MongoDB)
│   ├── controllers/          # Business logic for handling API requests
│   ├── models/               # Mongoose schemas and models (e.g., User, Class, Lecture)
│   ├── routes/               # API routes (e.g., /api/users, /api/classes)
│   ├── middleware/           # Middleware for authentication, error handling, etc.
│   ├── utils/                # Utility functions and services (e.g., email sending, token generation)
│   └── server.js             # Main entry point for the Express server
├── .env                      # Environment variables (e.g., API keys, database URLs)
├── package.json              # Project metadata and NPM scripts for both client and server
└── README.md                 # Project documentation (this file)

