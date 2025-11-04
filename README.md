# AutoCP

AutoCP is an AI-powered competitive programming problem generator platform that automates the problem-setting pipeline.

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/DurjoyGH/AutoCP.git
cd AutoCP
```

## 📦 Installation & Setup

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder with the following variables:
```env
PORT=3000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
EMAIL=smtp.gmail.com
EMAIL_PASSWORD=your_app_password
```

4. Start the backend server:
```bash
npm run start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend folder (if needed):
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `DB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRATION` - JWT token expiration time
- `EMAIL` - Email
- `EMAIL_PASSWORD` - Email app password

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer

**Frontend:**
- React
- React Router
- Tailwind CSS
- Axios
- Lucide React Icons

## 📝 Features

- AI-Powered Problem Generation
- Email Verification System
- User Authentication & Authorization
- Role-Based Access Control (User/Admin)
- Responsive Design
- Dark Theme UI

## 👨‍💻 Development

Make sure both backend and frontend servers are running simultaneously for the application to work properly.

## 📄 License

This project is licensed under the MIT License.
