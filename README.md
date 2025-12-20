# Blood Bank Management System

![Blood Bank Banner](client/public/Gemini_Generated_Image_oeqf9noeqf9noeqf.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://react.dev/)

---

A comprehensive MERN stack application for managing blood bank operations, connecting donors, blood banks, and hospitals.

## Features

- **User Roles**: Admin, Blood Bank Staff, Hospital Staff, Blood Donors
- **Authentication**: JWT-based secure login and registration
- **Inventory Management**: Track blood units with expiry monitoring
- **Request System**: Hospitals can request blood, blood banks approve/reject
- **Emergency Alerts**: Priority handling for urgent requests
- **Dashboard Analytics**: Role-specific dashboards with key metrics
- **Responsive Design**: Mobile-friendly interface


## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Styling**: Plain CSS with design system
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB

### Installation

```bash
# Clone the repository
git clone https://github.com/Chhatrapati-sahu-09/bloodlink.git
cd bloodlink

# Install dependencies
cd client && npm install
cd ../server && npm install
```

### Environment Setup

- Create a `.env` file in `server/` with your MongoDB URI:

  ```
  MONGO_URI=mongodb://localhost:27017/bloodbank
  JWT_SECRET=your_jwt_secret
  ```

### Database Seeding

```bash
cd server
node seed.js
```

### Running the App

```bash
# Start backend
cd server && npm start
# Start frontend (in a new terminal)
cd client && npm run dev
```

---

## Screenshots

### Landing Page

![Landing Page](client/public/images/Screenshot%202025-12-20%20235741.png)



---
## 📸 Screenshots

<p align="center">
  <img src="client/public/images/Screenshot%202025-12-20%20234540.png" alt="Screenshot 234540" width="350" style="margin:8px;"/>
  <img src="client/public/images/Screenshot%202025-12-20%20235218.png" alt="Screenshot 235218" width="350" style="margin:8px;"/>
  <img src="client/public/images/Screenshot%202025-12-20%20235307.png" alt="Screenshot 235307" width="350" style="margin:8px;"/>
  <img src="client/public/images/Screenshot%202025-12-20%20235405.png" alt="Screenshot 235405" width="350" style="margin:8px;"/>
  <img src="client/public/images/Screenshot%202025-12-20%20235457.png" alt="Screenshot 235457" width="350" style="margin:8px;"/>
  <img src="client/public/images/Screenshot%202025-12-20%20235549.png" alt="Screenshot 235549" width="350" style="margin:8px;"/>
  <img src="client/public/images/Screenshot%202025-12-20%20235558.png" alt="Screenshot 235558" width="350" style="margin:8px;"/>
  <img src="client/public/images/Screenshot%202025-12-20%20235741.png" alt="Screenshot 235741" width="350" style="margin:8px;"/>
</p>

---

## 🗂️ Project Structure

```
blood-bank-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── routes/         # Route protection
│   │   ├── services/       # API services
│   │   └── styles/         # CSS files
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middleware
│   ├── services/           # Business logic
│   ├── utils/              # Utilities
│   └── server.js
└── README.md
```

---

## 📝 License

This project is licensed under the MIT License.

---

## Author

Chhatrapati Sahu

---

## Acknowledgements

- [React](https://react.dev/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
