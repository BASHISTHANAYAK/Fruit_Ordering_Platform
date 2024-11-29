# Bulk Vegetable/Fruit Ordering Platform

## Overview

This is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It enables buyers to place bulk orders for vegetables/fruits and track their order status. Admins can efficiently manage orders and inventory.

---

# Live Demo

- live URL: https://fruit-ordering-platform-xjbc.vercel.app/

### Mock Credentials for Testing

- **Admin**
  - Email: `bashisthanayak09@gmail.com`
  - Password: `bashisthanayak09@B`

- **User/Buyer**
  - Email: `moresivam49@gmail.com`
  - Password: `moresivam49@M`
  - **Note**: You will receive email notifications about the status of your order at the email address you provided during registration.

---



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
   - **Email Notifications**: Receive email notifications when the order status is updated.

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
- **Email Service**: Nodemailer (for sending email notifications)
- **Deployment**: Vercel (optional)

---

## Email Notification Feature

This project includes an email notification system that alerts the buyer whenever their order status is updated. The email contains details about the updated status of the order, with both text and HTML formatted messages.

### How it Works:

1. **Order Status Update**: When an admin updates the order status (e.g., "Pending", "In Progress", "Delivered"), an email is automatically sent to the buyer.
2. **Email Content**:
   - **Subject**: Order Status Update
   - **Text Body**: "Your order status has been updated to [Status]."
   - **HTML Body**: `<p>Your order status has been updated to <strong>[Status]</strong>.</p>`
3. **Email Service**: The email notifications are sent using **Nodemailer**, which is configured with a Gmail account. You can modify the credentials and service provider if needed.

### Prerequisites for Email Notification:

- Set up a Gmail account (or any email provider) and generate an **App Password** for secure access.
- Ensure that your backend code is properly configured to send emails using **Nodemailer**.

---

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB Atlas account or local MongoDB installation
- Gmail account (or other email provider for sending emails)

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
