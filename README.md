# CHATLY

Chatly is a real-time chat application that allows users to connect and communicate instantly. 
Built with modern technologies, it provides a seamless messaging experience with live presence indicators. 
Perfect for teams, communities, and individuals who want to stay connected in real-time.

## Features

- 🔐 Secure user authentication with JWT
- 💬 Real-time messaging with Socket.io
- 👥 Live online/offline status
- 📱 Fully responsive design
- ⚡ Efficient state management with Zustand
- 🖼️ Image sharing support


## Tech Stack

- **Frontend:** React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
- **State Management:** Zustand
- **Authentication:** JWT (JSON Web Token)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/itaayush/Chatly.git
cd chatly
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the `backend` folder with the following example:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatly
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

### 4. Run Development Servers

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend Server:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`
