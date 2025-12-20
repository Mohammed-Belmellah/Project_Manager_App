# Project Management App - Internship Task

A full-stack application for managing projects and tasks, built with **Spring Boot** and **Angular**. This application allows users to create projects, manage tasks, and track progress in real-time with a secure authentication system.

## 🛠️ Tools & Technologies
* **Backend:** Java 21, Spring Boot 3, Spring Security, JWT, JPA/Hibernate.
* **Frontend:** Angular 21 (Standalone Components), Bootstrap 5.
* **Database:** PostgreSQL.
* **Build Tools:** Maven (Backend), NPM (Frontend).

---

## ⚙️ Setup & Execution Guide

Follow these steps to run the application locally.

### 1. Database Setup (PostgreSQL)
Before starting the backend, you must create the database.

1.  Open your PostgreSQL terminal or pgAdmin.
2.  Create a new database named `project_db`:
    ```sql
    CREATE DATABASE project_db;
    ```
3.  **Check Configuration:**
    Open `backend/src/main/resources/application.properties` and ensure the username/password matches your local PostgreSQL credentials.

### 2. How to Run the Backend
1.  Open a terminal in the root folder.
2.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
3.  Run the application using Maven:
    ```bash
    mvn spring-boot:run
    ```
4.  The server will start at: `http://localhost:8083`

### 3. How to Run the Frontend
1.  Open a new terminal in the root folder.
2.  Navigate to the frontend client directory:
    ```bash
    cd frontend/proj-front
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the Angular server:
    ```bash
    ng serve
    ```
5.  Open your browser and navigate to: `http://localhost:4200`

---

## 🚀 Key Features
* **Authentication:** Secure Login/Register with JWT & Silent Refresh Token mechanism.
* **Project Management:** Create projects and view detailed dashboards.
* **Task Tracking:** Full CRUD for tasks (Add, Delete, Mark as Done).
* **Visual Progress:** Real-time progress bars and task counters.
* **Security:** Routes protected by Angular `AuthGuard`.
