# MERN E-Commerce Platform
Beginner starter: React + Vite frontend, Express/Node API, MongoDB/Mongoose product catalog, search, and browser shopping cart.

## Run backend
1. Install Node.js and MongoDB (or use MongoDB Atlas).
2. In PowerShell: `cd server`
3. `npm install`
4. Copy `.env.example` to `.env` and set `MONGODB_URI`.
5. `npm run dev`

## Run frontend (second terminal)
1. `cd client`
2. `npm install`
3. `npm run dev`
4. Open the Vite URL, usually http://localhost:5173.

API routes: GET `/api/health`, GET `/api/products?search=...`, POST `/api/products`.
POST is for learning only and is not protected. Authentication, orders, and payments are not implemented. Do not deploy without adding authorization and validation.

# MERN Stack Job Portal

A full-stack job portal application built using MongoDB, Express.js, React.js, and Node.js (MERN stack). This project aims to provide a platform where job seekers can explore job opportunities and recruiters can manage job postings.

## 🚀 Technologies Used

- **MongoDB** – Database
- **Express.js** – Backend framework
- **React.js** – Frontend library
- **Node.js** – Backend runtime
- **Vite** – Frontend development and build tool
- **JavaScript, HTML, CSS** – Web development

## ✨ Features

- User registration and login
- Job listing and browsing
- Job search functionality
- Job application management
- Recruiter job posting and management
- Responsive user interface

*Update this section to reflect the features implemented in your project.*

## 📂 Project Structure

```text
mern-job-portal/
├── client/          # React + Vite frontend
├── server/          # Express.js backend
├── README.md
└── .gitignore
```

*Adjust the folder names to match your actual project.*

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/mushra4444-maker/mern-stock-job-portal.git
```

### 2. Open the project

```bash
cd mern-stock-job-portal
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

### 5. Run the backend

If your project includes a separate backend, open another terminal, navigate to its folder, install dependencies, configure your environment variables, and run the appropriate script from its `package.json`.

## 🔐 Environment Variables

Configure the environment variables required by your backend, such as the MongoDB connection string and authentication secret.

Never upload `.env` files containing real credentials to GitHub.

## 🎯 Project Objective

To build a full-stack recruitment platform that helps job seekers discover employment opportunities and recruiters manage job listings and applications.

## 👨‍💻 Author

**Mushraf Syed**

GitHub: [mushra4444-maker](https://github.com/mushra4444-maker)

## 📄 License

For educational and portfolio purposes. Add a license if you wish to specify reuse and distribution permissions.
