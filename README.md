# 🍳 MrCook (HomeChef Connect)

> A full-stack MERN application connecting food lovers with local home chefs, culinary experts, and personalized meal services.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18%2B-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)

---

## 📌 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation & Setup](#installation--setup)
- [API Documentation](#-api-documentation)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About the Project

**MrCook (HomeChef Connect)** is designed to bridge the gap between busy individuals/families and talented local home chefs. Whether you need a daily meal preparation service, party catering, or customized dietary meal plans (keto, vegan, low-sodium), MrCook allows users to seamlessly discover verified chefs nearby, negotiate customized menus and pricing, and manage dietary preferences.

---

## ✨ Key Features

### 👤 Dual Role Ecosystem (Users & Chefs)
- **Customer Profiles:** Save dietary restrictions, preferred cuisines, favorite chefs, and delivery/service addresses.
- **Chef Profiles:** Custom portfolio showcasing signature dishes, hourly/per-meal rates, dietary specialties, and service radius.

### 🔍 Discovery & Location-Based Search
- **Nearby Search:** Filter chefs based on location, budget range, preferred cuisine, and availability.
- **Verification Badges:** Verified chef profiles with health safety compliance checkmarks and user reviews.

### 💬 Real-Time Chat & Negotiation
- **In-App Messaging:** Discuss customized menu items, special instructions, and meal schedules directly with chefs before booking.

### 📑 Smart Utilities & Payments
- **Grocery Checklist Generator:** Automatically compiles required ingredients based on confirmed meal menus.
- **Secure Payments:** Integrated payment gateway flow for bookings and subscription meal plans.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React.js (Hooks, Context API / Redux Toolkit)
- **Styling:** CSS3 / Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** React Icons / Lucide React

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
- **Real-Time Communication:** Socket.io (for chat & updates)

### **Database**
- **DBMS:** MongoDB (Atlas / Local)
- **ODM:** Mongoose

---

## 🏗️ System Architecture

```text
  [ Client (React.js) ] 
            │
      HTTP / WebSockets
            │
            ▼
   [ Server (Express / Node.js) ] ──────► [ Authentication (JWT) ]
            │
            ▼
   [ Database (MongoDB Mongoose Models) ]
   ├── Users & Chefs
   ├── Bookings & Menus
   └── Messages & Reviews
```

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### Environment Variables

Create a `.env` file in the `server/` directory and configure the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mrcook?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# CORS Origin
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mrcook-homechef-connect.git
   cd mrcook-homechef-connect
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Run the Application:**

   - **Option A: Run Client and Server Separately**
     ```bash
     # In /server terminal
     npm run dev

     # In /client terminal
     npm start
     ```

   - **Option B: Run Simultaneously (if using Concurrently)**
     ```bash
     # From root folder
     npm run dev
     ```

5. **Open Application:**
   Navigate to `http://localhost:3000` in your browser.

---

## 📡 API Documentation

### Auth Routes
- `POST /api/v1/auth/register` - Register a new user/chef
- `POST /api/v1/auth/login` - Authenticate user & receive JWT token
- `GET /api/v1/auth/me` - Get current logged-in user profile

### Chef Routes
- `GET /api/v1/chefs` - Get all chefs (Supports location/cuisine filtering)
- `GET /api/v1/chefs/:id` - Get detailed chef profile
- `PUT /api/v1/chefs/profile` - Update chef menu and pricing details

### Booking Routes
- `POST /api/v1/bookings` - Create a new meal booking
- `GET /api/v1/bookings/user` - Fetch user bookings
- `PUT /api/v1/bookings/:id/status` - Update booking status (Accept/Decline)

---

## 🗺️ Roadmap

- [x] User & Chef Authentication (JWT)
- [x] Chef Discovery & Filter system
- [x] In-app Chat system prototype
- [ ] Automated Grocery List Export (PDF/Text)
- [ ] Integrated Payment Gateway (Razorpay / Stripe)
- [ ] Push Notifications for Order Updates
- [ ] Advanced Rating & Detailed Review System

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please follow these steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

