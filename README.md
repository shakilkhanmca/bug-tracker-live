# Jira-like Bug Tracker

A full-stack bug tracking application built with Spring Boot (Backend) and React (Frontend).

## Features
- **Project Management**: Create and manage projects.
- **Ticket Management**: Create, update, assign, and delete tickets.
- **Kanban Board**: Drag and drop tickets to change status.
- **Comments**: Discuss tickets with comments.
- **Search & Filter**: Find tickets easily.
- **Authentication**: Secure JWT-based login/register.

## Prerequisites
- Java 17+
- Maven
- Node.js & npm
- MySQL Database

## Setup Instructions

### Database
1. Create a MySQL database named `ni`.
2. Update `bugtracker-backend/src/main/resources/application.properties` with your username/password if different from root/password.

### Backend
1. Navigate to the backend directory:
   ```sh
   cd bugtracker-backend
   ```
2. Build and run the application:
   ```sh
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### Frontend
1. Navigate to the frontend directory:
   ```sh
   cd bugtracker-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (or 3000 depending on Vite config).

## API Documentation
- Swagger UI is available at `http://localhost:8080/swagger-ui.html` when the backend is running.
