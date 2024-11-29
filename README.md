# Bulk Vegetable/Fruit Ordering Platform

## Overview

This is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It enables buyers to place bulk orders for vegetables/fruits and track their order status. Admins can efficiently manage orders and inventory.

---

# Live Demo

- live URL: https://fruit-ordering-platform-xjbc.vercel.app/

### Mock credentials for Testing

- **Admin**

  - Email: `admin1@gmail.com`
  - Password: `admin1@A`

- **User/Buyer**

  - Email: `user11@gmail.com`
  - Password: `user11@U`

- **You can use new credentials for register/login as an admin to manage your admin account, or can register/login as a buyer for purchasing purposes.**

## Features

### For Buyers

1. **Browse Products**

   - Display a catalog of vegetables and fruits with name and price per unit.

2. **Place Orders**

   - Submit bulk orders with delivery details such as name, contact information, and address.
   - Orders are securely stored in the database with a unique identifier.

3. **Order Tracking**
   - Check the status of placed orders with the following updates:
     - **Pending**: Order received.
     - **In Progress**: Order is being processed.
     - **Delivered**: Order successfully delivered.

### For Admins

1. **Order Management**

   - View placed orders with buyer details and delivery addresses.
   - Update the status of orders (Pending → In Progress → Delivered).

2. **Inventory Management**
   - Add, edit, or remove items from the product catalog.
   - Assume all items are always available (no stock tracking required).

---

## Tech Stack

- **Frontend**: React.js, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Deployment**: Vercel (optional)

---

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB Atlas account or local MongoDB installation

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/BASHISTHANAYAK/Fruit_Ordering_Platform.git

   ```

2. **Install Dependencies**

- bash
- Copy code
- cd frontend
- npm install
- cd backend
- npm install

3. **Set Up Environment Variables Create a .env file in the backend directory and add the following:**

### Steps

- create an account in mongo atlas
- add these credentials
- PORT=5000
- Add your username and password
- MONGOODB_URL=mongodb+srv://<-username>:<-password>@agrofixdata.elgeg.mongodb.net/?retryWrites=true&w=majority&appName=agrofixData
- ADMIN_JWT_SECRET_KEY=<your_jwt_secret_key>
- USER_JWT_SECRET_KEY=<your_jwt_secret_key>

4. **Start the Application**

Backend:

- go to backend folder in terminal
- nodemon .\index.js

frontend:

- go to frontend folder in terminal
- npm start

5. **Access the Application**

- Open your browser and navigate to http://localhost:3000 for the frontend.
- Backend runs on http://localhost:5000.
