# Fruit Ordering Platform - Backend API Documentation

## Overview
This document provides comprehensive API response structures and error handling patterns for all backend endpoints. Frontend developers should use this to handle all response scenarios properly in the UI.

---

## Authentication Middleware

### Admin Authentication (adminAuth)
- **Applied to**: All admin-protected routes
- **Header Required**: `Authorization: Bearer <token>`
- **Token Source**: Admin JWT token (from signup/login)

**Error Responses:**
```json
// Missing token
{
  "message": "Unauthorized: Token needed for authentication"
}
// Status: 401

// Invalid/expired token
{
  "err": "Unauthorized: Token is not valid"
}
// Status: 401
```

### User Authentication (userAuth)
- **Applied to**: All buyer-protected routes
- **Header Required**: `Authorization: Bearer <token>`
- **Token Source**: Buyer JWT token (from signup/login)

**Error Responses:**
```json
// Missing token
{
  "message": "Unauthorized: Token needed for authentication"
}
// Status: 401

// Invalid/expired token
{
  "err": "Unauthorized: Token is not valid"
}
// Status: 401
```

---

## Admin Endpoints

### 1. Admin Signup
**Endpoint**: `POST /adminSignup`
**Authentication**: None

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "admin has been created",
  "jwttoken": "jwt_token_string",
  "detail": {
    "name": "Admin Name",
    "role": "Admin",
    "_id": "admin_id"
  }
}
```

**Error Responses:**
```json
// Missing fields
{
  "message": "Please enter all details"
}
// Status: 400

// Invalid email
{
  "message": "Please enter a valid email"
}
// Status: 400

// Invalid password (must be 8+ chars, 1 uppercase, 1 lowercase)
{
  "message": "Password must be at least 8 characters long and have at least one uppercase and one lowercase letter"
}
// Status: 400

// Email already exists
{
  "message": "Use a different email"
}
// Status: 400

// Creation failed
{
  "message": "admin could not be created"
}
// Status: 400

// Server error
{
  "message": "unable to send data"
}
// Status: 400
```

---

### 2. Admin Login
**Endpoint**: `POST /adminLogin`
**Authentication**: None

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "Admin loggedin",
  "jwttoken": "jwt_token_string",
  "detail": {
    "name": "Admin Name",
    "role": "Admin",
    "_id": "admin_id"
  }
}
```

**Error Responses:**
```json
// Missing fields
{
  "message": "Please enter all details"
}
// Status: 400

// Admin not found
{
  "message": "Admin not found"
}
// Status: 400

// Wrong password
{
  "message": "Not a Admin"
}
// Status: 400

// Server error
{
  "message": "unable to login"
}
// Status: 400
```

---

### 3. Get All Placed Orders (Admin)
**Endpoint**: `GET /getAllPlacedOrdersByAdmin/:adminId`
**Authentication**: Required (adminAuth)

**Success Response (200):**
```json
{
  "message": "Orders retrieved successfully",
  "orders": [
    {
      "_id": "order_id",
      "buyer": {
        "_id": "buyer_id",
        "name": "Buyer Name",
        "email": "buyer@email.com"
      },
      "products": [
        {
          "product": {
            "_id": "product_id",
            "name": "Product Name",
            "price": 100,
            "category": "Fruit",
            "admin": "admin_id"
          },
          "quantity": 2,
          "status": "Pending",
          "_id": "subdoc_id"
        }
      ],
      "totalPrice": 200,
      "deliveryName": "Recipient Name",
      "contactInfo": "contact_number",
      "deliveryAddress": {
        "street": "Street Address",
        "city": "City",
        "state": "State",
        "postalCode": "12345",
        "country": "Country"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
```json
// No orders found
{
  "message": "No products found ."
}
// Status: 404

// Server error
{
  "error": "error_message"
}
// Status: 500
```

---

### 4. Update Order Status
**Endpoint**: `PUT /updateProductStatus/:orderId/:productId`
**Authentication**: Required (adminAuth)

**Request Body:**
```json
{
  "status": "string" // e.g., "Pending", "Shipped", "Delivered", "Cancelled"
}
```

**Success Response (200):**
```json
{
  "message": "Product status updated and email sent"
}
```

**Error Responses:**
```json
// Order not found
{
  "message": "Order not found"
}
// Status: 404

// Product not found in order
{
  "message": "Product not found in this order"
}
// Status: 404

// Buyer email not found
{
  "message": "Buyer email not found"
}
// Status: 400

// Server error
{
  "message": "Failed to update product status",
  "error": "error_message"
}
// Status: 500
```

---

## Buyer Endpoints

### 5. Buyer Signup
**Endpoint**: `POST /buyerSignup`
**Authentication**: None

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "buyer has been created",
  "jwttoken": "jwt_token_string",
  "detail": {
    "name": "Buyer Name",
    "role": "Buyer",
    "_id": "buyer_id"
  }
}
```

**Error Responses:**
```json
// Missing fields
{
  "message": "Please enter all details"
}
// Status: 400

// Invalid email
{
  "message": "Please enter a valid email"
}
// Status: 400

// Invalid password (must be 8+ chars, 1 uppercase, 1 lowercase)
{
  "message": "Password must be at least 8 characters long and have at least one uppercase and one lowercase letter"
}
// Status: 400

// Email already exists
{
  "message": "Use a different email"
}
// Status: 400

// Creation failed
{
  "message": "buyer could not be created"
}
// Status: 400

// Server error
{
  "message": "unable to send data"
}
// Status: 400
```

---

### 6. Buyer Login
**Endpoint**: `POST /buyerLogin`
**Authentication**: None

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "Buyer loggedin",
  "jwttoken": "jwt_token_string",
  "detail": {
    "name": "Buyer Name",
    "role": "Buyer",
    "_id": "buyer_id"
  }
}
```

**Error Responses:**
```json
// Missing fields
{
  "message": "Please enter all details"
}
// Status: 400

// Buyer not found
{
  "message": "Buyer not found"
}
// Status: 400

// Wrong password
{
  "message": "Account not found please register"
}
// Status: 400

// Server error
{
  "message": "unable to login"
}
// Status: 400
```

---

### 7. Add to Cart
**Endpoint**: `POST /addToCart/:buyerId`
**Authentication**: Required (userAuth)

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1,
  "areYouUpdatingQuantity": false
}
```

**Success Response (200):**
```json
{
  "message": "Product added to cart",
  "cart": [
    {
      "product": "product_id",
      "quantity": 2,
      "_id": "cart_item_id"
    }
  ]
}
```

**Error Responses:**
```json
// Buyer not found
{
  "message": "Buyer not found"
}
// Status: 404

// Server error
{
  "message": "Internal server error"
}
// Status: 500
```

---

### 8. Get Cart Products
**Endpoint**: `GET /getcartProducts/:buyerId`
**Authentication**: Required (userAuth)

**Success Response (200):**
```json
{
  "_id": "buyer_id",
  "name": "Buyer Name",
  "email": "buyer@email.com",
  "role": "Buyer",
  "orders": ["order_id"],
  "cart": [
    {
      "product": {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product description",
        "price": 100,
        "image": "image_url",
        "category": "Fruit",
        "admin": "admin_id",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "quantity": 2,
      "_id": "cart_item_id"
    }
  ]
}
```

**Error Responses:**
```json
// Buyer not found
{
  "message": "Buyer not found"
}
// Status: 500

// Server error
{
  "error": "error_message"
}
// Status: 500
```

---

### 9. Place Order
**Endpoint**: `POST /placeOrder`
**Authentication**: Required (userAuth)

**Request Body:**
```json
{
  "buyerId": "buyer_id",
  "cartItems": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "totalPrice": 200,
  "deliveryName": "Recipient Name",
  "contactInfo": "contact_number",
  "street": "Street Address",
  "city": "City",
  "state": "State",
  "postalcode": "12345",
  "country": "Country"
}
```

**Success Response (200):**
```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "order_id",
    "buyer": "buyer_id",
    "products": [
      {
        "product": "product_id",
        "quantity": 2,
        "status": "Pending",
        "_id": "subdoc_id"
      }
    ],
    "totalPrice": 200,
    "deliveryName": "Recipient Name",
    "contactInfo": "contact_number",
    "deliveryAddress": {
      "street": "Street Address",
      "city": "City",
      "state": "State",
      "postalCode": "12345",
      "country": "Country"
    },
    "status": "Pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// Empty cart
{
  "message": "Cart is empty"
}
// Status: 400

// Buyer not found
{
  "message": "Buyer not found"
}
// Status: 404

// Server error
{
  "message": "Failed to place order",
  "error": "error_message"
}
// Status: 500
```

---

### 10. Fetch Orders (Buyer)
**Endpoint**: `GET /getOrders/:_id`
**Authentication**: Required (userAuth)

**Success Response (200):**
```json
{
  "message": "Orders retrieved successfully",
  "orders": [
    {
      "_id": "order_id",
      "buyer": "buyer_id",
      "products": [
        {
          "product": {
            "_id": "product_id",
            "name": "Product Name",
            "price": 100,
            "image": "image_url"
          },
          "quantity": 2,
          "status": "Pending",
          "_id": "subdoc_id"
        }
      ],
      "totalPrice": 200,
      "deliveryName": "Recipient Name",
      "contactInfo": "contact_number",
      "deliveryAddress": {
        "street": "Street Address",
        "city": "City",
        "state": "State",
        "postalCode": "12345",
        "country": "Country"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
```json
// Buyer not found
{
  "message": "Buyer not found"
}
// Status: 404

// No orders found
{
  "message": "No orders found for this buyer."
}
// Status: 404

// Server error
{
  "message": "Failed to fetch orders",
  "error": "error_message"
}
// Status: 500
```

---

### 11. Remove from Cart
**Endpoint**: `DELETE /removeFromCart/:buyerId/:objToDeleteId`
**Authentication**: Required (userAuth)

**Success Response (200):**
```json
{
  "message": "Product removed from cart",
  "cart": [
    {
      "product": "product_id",
      "quantity": 1,
      "_id": "cart_item_id"
    }
  ]
}
```

**Error Responses:**
```json
// Buyer not found
{
  "message": "Buyer not found"
}
// Status: 404

// Product not found in cart
{
  "message": "Product not found in cart"
}
// Status: 404

// Server error
{
  "message": "Failed to delete order",
  "error": "error_message"
}
// Status: 500
```

---

## Product Endpoints

### 12. Get All Products
**Endpoint**: `GET /getAllProducts`
**Authentication**: None

**Success Response (200):**
```json
[
  {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": 100,
    "image": "image_url",
    "category": "Fruit",
    "admin": {
      "_id": "admin_id",
      "name": "Admin Name",
      "email": "admin@email.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
```json
// Database not connected
{
  "error": "Database not connected"
}
// Status: 503

// Server error
{
  "error": "error_message"
}
// Status: 500
```

---

### 13. Create Product
**Endpoint**: `POST /createProduct`
**Authentication**: Required (adminAuth)

**Request Body:**
```json
{
  "productDetails": {
    "name": "Product Name",
    "price": 100,
    "description": "Product description",
    "image": "image_url",
    "category": "Fruit"
  },
  "adminId": "admin_id"
}
```

**Success Response (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": 100,
    "image": "image_url",
    "category": "Fruit",
    "admin": "admin_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// Admin not found
{
  "error": "Admin not found"
}
// Status: 404

// Server error
{
  "error": "error_message"
}
// Status: 500
```

---

### 14. Delete Product
**Endpoint**: `DELETE /deleteProduct/:productId`
**Authentication**: Required (adminAuth)

**Success Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

**Error Responses:**
```json
// Product not found
{
  "error": "Product not found"
}
// Status: 404

// Admin not found for this product
{
  "error": "Admin not found for this product"
}
// Status: 404

// Server error
{
  "error": "error_message"
}
// Status: 500
```

---

### 15. Get Products by Admin
**Endpoint**: `GET /getProducts/:adminId`
**Authentication**: Required (adminAuth)

**Success Response (200):**
```json
{
  "message": "Products retrieved successfully",
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 100,
      "image": "image_url",
      "category": "Fruit",
      "admin": {
        "_id": "admin_id",
        "name": "Admin Name",
        "email": "admin@email.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
```json
// No products found
{
  "message": "No products found ."
}
// Status: 404

// Server error
{
  "error": "error_message"
}
// Status: 500
```

---

### 16. Get Product by ID
**Endpoint**: `GET /getProductById/:productId`
**Authentication**: Required (adminAuth)

**Success Response (200):**
```json
{
  "_id": "product_id",
  "name": "Product Name",
  "description": "Product description",
  "price": 100,
  "image": "image_url",
  "category": "Fruit",
  "admin": {
    "_id": "admin_id",
    "name": "Admin Name",
    "email": "admin@email.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
```json
// Product not found
{
  "error": "Product not found"
}
// Status: 404

// Server error
{
  "error": "error_message"
}
// Status: 500
```

---

### 17. Edit Product
**Endpoint**: `PUT /editProduct/:productId`
**Authentication**: Required (adminAuth)

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 150,
  "image": "updated_image_url",
  "category": "Vegetable",
  "adminId": "admin_id"
}
```

**Success Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "_id": "product_id",
    "name": "Updated Product Name",
    "description": "Updated description",
    "price": 150,
    "image": "updated_image_url",
    "category": "Vegetable",
    "admin": "admin_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// Product not found
{
  "error": "Product not found"
}
// Status: 404

// Not authorized (product belongs to different admin)
{
  "error": "You are not authorized to edit this product"
}
// Status: 403

// Server error
{
  "error": "error_message"
}
// Status: 500
```

---

## Testing Endpoint

### 18. Test Route
**Endpoint**: `GET /`
**Authentication**: None

**Response**: Returns testing response (defined in TestingROute.js)

---

## HTTP Status Codes Summary

| Status Code | Meaning | Common Scenarios |
|-------------|---------|------------------|
| 200 | OK | Successful GET, POST, PUT, DELETE operations |
| 201 | Created | Resource successfully created (createProduct) |
| 400 | Bad Request | Invalid input, missing fields, validation errors |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Not authorized to perform action (editProduct) |
| 404 | Not Found | Resource not found (user, product, order) |
| 500 | Internal Server Error | Server-side errors, database errors |
| 503 | Service Unavailable | Database not connected |

---

## Response Structure Patterns

### Success Pattern
```json
{
  "message": "Success message",
  "data": {} // or specific field like "product", "orders", etc.
}
```

### Error Pattern
```json
{
  "message": "Error message"
}
// OR
{
  "error": "Error message"
}
// OR
{
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## Frontend Implementation Guidelines

### 1. Authentication Token Handling
- Store JWT tokens securely (localStorage or httpOnly cookies)
- Include token in Authorization header for protected routes: `Authorization: Bearer <token>`
- Handle 401 responses by redirecting to login or refreshing token

### 2. Error Handling
- Always check response status before processing data
- Display user-friendly error messages based on the response
- Implement retry logic for 500 errors where appropriate
- Show loading states during API calls

### 3. Form Validation
- Validate email format before sending to backend
- Validate password requirements (8+ chars, 1 uppercase, 1 lowercase)
- Ensure all required fields are present before submission

### 4. Response Processing
- Check if response has `message` field for success/error status
- Extract data from appropriate fields (`product`, `orders`, `cart`, etc.)
- Handle empty arrays gracefully (e.g., no orders, empty cart)

### 5. Status Code Handling
- **200-299**: Success - process data
- **400-499**: Client error - show validation/error message to user
- **500-599**: Server error - show generic error message, consider retry

---

## Common Issues to Handle

1. **Token Expiration**: JWT tokens expire (40m for signup, 1d for login)
2. **Network Errors**: Implement timeout and retry logic
3. **Empty States**: Handle cases where no data exists (empty cart, no orders)
4. **Concurrent Requests**: Manage race conditions in cart operations
5. **Image Loading**: Handle broken or missing product images
6. **Address Validation**: Ensure delivery address fields are properly formatted

---

## Notes

- All datetime fields are in ISO 8601 format
- Product category is restricted to "Vegetable" or "Fruit"
- Order status can be "Pending", "Shipped", "Delivered", "Cancelled"
- Buyer cart is cleared after successful order placement
- Email notifications are sent when order status is updated by admin
- All prices are in numeric format (not strings)
- IDs are MongoDB ObjectId strings
