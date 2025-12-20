
<p align="center">
   <img src="client/public/Gemini_Generated_Image_oeqf9noeqf9noeqf.png" alt="Blood Bank Banner" width="600"/>
</p>

# Blood Bank Management System

A comprehensive MERN stack application for managing blood bank operations, connecting donors, blood banks, and hospitals.

## Features

- **User Roles**: Admin, Blood Bank Staff, Hospital Staff, Blood Donors
- **Authentication**: JWT-based secure login and registration
- **Inventory Management**: Track blood units with expiry monitoring
- **Request System**: Hospitals can request blood, blood banks approve/reject
- **Emergency Alerts**: Priority handling for urgent requests
- **Dashboard Analytics**: Role-specific dashboards with key metrics
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Styling**: Plain CSS with design system
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blood-bank-system
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Environment Variables**

   **Backend (.env)**
   ```
   MONGO_URI=mongodb://localhost:27017/bloodbank
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

   **Frontend (.env)**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`
3. Deploy automatically on push

### Backend (Render/Railway)

1. Connect repository
2. Set environment variables as above
3. Set build command: `npm install`
4. Set start command: `npm start`

## Usage

1. **Register** as a user with appropriate role
2. **Login** to access role-specific dashboard
3. **Blood Banks**: Manage inventory, handle requests
4. **Hospitals**: Search blood, submit requests, track status
5. **Donors**: View eligibility, donation history
6. **Admins**: System oversight, user management

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Inventory (Blood Bank)
- `GET /api/inventory` - Get inventory
- `POST /api/inventory` - Add inventory
- `PUT /api/inventory/:id` - Update inventory

### Requests
- `POST /api/requests` - Create request (Hospital)
- `GET /api/requests` - Get requests (Blood Bank)
- `PUT /api/requests/:id/approve` - Approve request
- `PUT /api/requests/:id/reject` - Reject request
- `PUT /api/requests/:id/complete` - Complete request

### Admin
- `GET /api/admin/stats` - System statistics
- `PUT /api/admin/users/:id/approve` - Approve user
- `PUT /api/admin/users/:id/block` - Block user
- `GET /api/admin/audit-logs` - Audit logs

## Project Structure

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
