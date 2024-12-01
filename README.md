# Virtual Classroom Project

## Description
This project is a combination of Google Classroom and YouTube, offering a platform for managing and delivering educational content. It provides functionality similar to Google Classroom, including student tracking, individual classes, and the ability to monitor progress. Additionally, it allows educators to upload lectures along with accompanying materials, much like YouTube. 

The goal is to offer a seamless experience for educators to manage classes and for students to access lectures, assignments, and resources in one integrated platform.

## Tech Stack
- **Frontend**: React+Vite, CSS/TailwindCSS
- **Backend**: Node.js, Express.js
- **Storage**: Firebase(Video lectures & materials)
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT

## Features
- User authentication (JWT-based)
- CRUD operations for All Models
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

