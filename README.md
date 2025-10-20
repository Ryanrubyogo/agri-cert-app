# Agri-Cert Management Portal

A full-stack web application designed to streamline the organic certification process for farms. This portal allows for the management of farmers, their farms, and field-level inspections, culminating in the automated generation of official PDF compliance certificates.

## Live Demo

The application is deployed and fully functional. You can access the live version here:

-   **Frontend (Vercel):** [https://agri-cert-app.vercel.app/](https://agri-cert-app.vercel.app/)
-   **Backend API (Render):** [https://agri-cert-backend.onrender.com/](https://agri-cert-backend.onrender.com/)

**Note:** The backend uses an in-memory database. This means any data you create (new inspections, certificates, etc.) will be reset whenever the free hosting service puts the server to sleep.

## Features

-   **Full CRUD Operations:** Manage farmers and their associated farms.
-   **Relational Data Structure:** Farmers have farms, and farms have inspections and certificates.
-   **Inspection System:** Conduct inspections using a standardized checklist.
-   **Automated Compliance Scoring:** Inspection scores are calculated automatically based on checklist answers.
-   **Conditional UI:** The "Approve" button for generating a certificate only appears if the compliance score is 80% or higher.
-   **Automated PDF Certificate Generation:** On approval, a unique, styled PDF certificate is generated and saved.
-   **Automated Testing:** Unit and integration tests for key backend and frontend logic.
-   **Responsive UI:** Styled with TailwindCSS for a clean and modern user experience.

## Tech Stack

-   **Frontend:** React (with Vite), React Router, TailwindCSS
-   **Backend:** Node.js, Express.js
-   **PDF Generation:** `pdfkit`
-   **Testing:**
    -   Backend: Jest & Supertest
    -   Frontend: Vitest & React Testing Library
-   **Deployment:**
    -   Frontend: Vercel
    -   Backend: Render

## Getting Started (Local Setup)

To run this project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd agri-cert-app
```

### 2. Set Up the Backend Server

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# The server is now ready.
```

### 3. Set Up the Frontend Client

```bash
# Navigate to the client directory from the project root
cd client

# Install dependencies
npm install
```

### 4. Create the Frontend Environment File

In the `client` directory, create a new file named `.env` and add the following line. This tells the frontend where to find the local backend API.

```
VITE_API_BASE_URL=http://localhost:3001
```

### 5. Run the Application

You will need two separate terminals to run both the frontend and backend servers concurrently.

-   **Terminal 1 (Backend):**
    ```bash
    # From the /server directory
    npm start
    # Expected output: Server is running and listening on port 3001
    ```

-   **Terminal 2 (Frontend):**
    ```bash
    # From the /client directory
    npm run dev
    # Expected output: VITE vX.X.X  ready in XXX ms
    ```

You can now access the application at `http://localhost:5173` (or whatever port Vite specifies).

## Running Tests

Automated tests are included for both the backend and frontend.

-   **To run backend tests:**
    ```bash
    # From the /server directory
    npm test
    ```

-   **To run frontend tests:**
    ```bash
    # From the /client directory
    npm test
    ```