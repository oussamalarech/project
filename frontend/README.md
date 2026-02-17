# Phone Store Frontend

React frontend for the Phone Store e-commerce application. Minimal, responsive UI with a basic admin panel.

## Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Context API**

## Folder Structure

```
frontend/
  src/
    components/     # Reusable UI components
    pages/          # Route-level pages
    context/        # Auth and Cart state
    services/       # API layer (axios)
    hooks/          # useRequireAuth, useRequireAdmin
    App.jsx
    main.jsx
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Product listing |
| `/product/:id` | Product details and add to cart |
| `/cart` | Cart with quantity control |
| `/checkout` | Checkout (requires login) |
| `/login` | Login form |
| `/register` | Registration form |
| `/admin` | Admin product management |
| `/admin/orders` | Admin order list and status updates |

## Admin Usage Guide

1. **Login as admin** – Register a user, then set `isAdmin: true` in the database for that user. Log in with that account.
2. **Products** – Add, edit, and delete products. Upload images via the product form.
3. **Orders** – View all orders and update status (pending → shipped → delivered).

## Environment Variables

Create a `.env` file in `frontend/`:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | (empty, uses Vite proxy) |

If empty, the dev server proxies `/api` and `/uploads` to `http://localhost:5000`.

## How to Run

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Ensure the backend is running on port 5000.

3. Start the dev server:
   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:3000`.

4. Build for production:
   ```bash
   npm run build
   ```

## Screens Overview

**Store home** – Grid of product cards with image, name, category, and price. Add to cart button on each card.

**Product details** – Single product view with image, description, price, stock, quantity selector, and add to cart.

**Cart** – List of cart items with image, name, price, quantity controls (increment/decrement), remove button, and subtotal. Links to continue shopping and proceed to checkout.

**Checkout** – Shipping address form (address, city, postal code, country), payment method select, and place order button. Requires login; redirects to login if not authenticated.

**Login / Register** – Simple forms with validation and link to the other page.

**Admin products** – Table of products with image thumbnail, name, price, stock. Edit and Delete actions. Add product form at top for creating new products. Product form supports image upload.

**Admin orders** – List of orders with order ID, customer name/email, date, shipping address, order items with thumbnails, and status dropdown (pending, shipped, delivered). Status changes are saved immediately.
