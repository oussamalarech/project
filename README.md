# Phone Store API

REST API for an e-commerce phone store. Handles user authentication, product management, orders, and image uploads.

## Tech Stack

- **Node.js** – Runtime
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – ODM
- **JWT** – Authentication
- **bcrypt** – Password hashing
- **Multer** – Image upload
- **dotenv** – Environment configuration

## Folder Structure

```
backend/
├── config/         # Database and app configuration
│   └── db.js       # MongoDB connection
├── models/         # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── controllers/    # Route handlers
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
├── routes/         # Express routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── middleware/     # Auth, admin check, file upload
│   ├── auth.js
│   ├── admin.js
│   └── upload.js
├── uploads/        # Multer upload destination
│   └── products/   # Product images
└── server.js       # Entry point
```

## API Routes

### Authentication

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Protected | Get current user profile |

### Products

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/products` | Public | Get all products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/orders` | Protected | Create order |
| GET | `/api/orders/myorders` | Protected | Get current user's orders |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

### Images

Uploaded images are served at:

```
GET /uploads/products/<filename>
```

## Request Examples

### Register

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Create Product (Admin, multipart/form-data)

- `name` (string)
- `description` (string)
- `price` (number)
- `category` (string)
- `stock` (number)
- `image` (file, optional)

### Create Order

```json
POST /api/orders
Authorization: Bearer <token>
{
  "orderItems": [
    { "product": "<productId>", "quantity": 2 }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

### Update Order Status

```json
PUT /api/orders/:id/status
Authorization: Bearer <admin-token>
{
  "status": "shipped"
}
```

Valid statuses: `pending`, `shipped`, `delivered`

## Environment Variables

Create a `.env` file in the project root:

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/phone-store |
| JWT_SECRET | Secret for signing JWT tokens | your-secret-key |

Copy from `.env.example` and adjust values.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` and set `MONGODB_URI` and `JWT_SECRET`.

3. Ensure MongoDB is running locally or update `MONGODB_URI` for your instance.

4. Start the server:
   ```bash
   npm start
   ```

   The API will be available at `http://localhost:5000`.

## Protected Routes

For protected and admin routes, send the JWT in the header:

```
Authorization: Bearer <your-jwt-token>
```

## Creating an Admin User

Admin users require `isAdmin: true` in the database. After registering, update the user document in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

Or use MongoDB Compass / any MongoDB client.

## Notes for Future Improvements

- Add input validation (e.g. express-validator or Joi)
- Add rate limiting for login and registration
- Add pagination for products and orders
- Use cloud storage (S3, Cloudinary) instead of local file storage
- Add unit and integration tests
- Add API documentation (Swagger/OpenAPI)
- Implement refresh tokens for longer sessions
- Add order history and status tracking
- Add product search and filtering
