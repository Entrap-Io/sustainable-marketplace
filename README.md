# Sustainable Discount Marketplace

## What is this?
Local markets have food that's about to expire. They want to sell it. Consumers want a discount. This app connects them. 
- **Markets** upload discounted products.
- **Consumers** find and buy them in their city.

---

## The Tech Stack
- **Node.js + Express** (The engine)
- **EJS** (The UI templates)
- **MySQL** (The data)
- **Docker** (The environment)

---

## MVC: How we organized the code
We used the **Model-View-Controller** pattern so we can work together without breaking each other's code.

1. **Model (The Data):** This is the database. It stores users, products, and carts. (`db.js` + MySQL)
2. **View (The Face):** This is what the user sees. HTML + dynamic EJS templates. (`/views`)
3. **Controller (The Brain):** This is the logic. It takes a request, talks to the DB, and renders the View. (`/controllers`)
4. **Routes (The Map):** These connect URLs to the Controller functions. (`/routes`)

---

## Full Project Map (The Blueprint)
```text
.
├── controllers/
│   ├── authController.js      # Register, Login, & 6-digit verification logic
│   ├── authMiddleware.js      # Role-based security (Consumer vs Market)
│   ├── cartController.js      # The Smart AJAX Cart & Purchase logic
│   ├── consumerController.js   # Search engine + Location prioritization
│   └── marketController.js     # Inventory CRUD + Auto Image Cleanup
├── routes/
│   ├── authRoutes.js          # Authentication endpoints
│   ├── cartRoutes.js          # AJAX Cart endpoints
│   ├── consumerRoutes.js      # Search & Profile endpoints
│   └── marketRoutes.js        # Dashboard & Product endpoints
├── views/
│   ├── consumer/              # Consumer-facing dashboard & cart
│   ├── market/                # Merchant inventory tools
│   ├── partials/              # Reusable UI components
│   └── *.ejs                  # Auth & Verification views
├── public/
│   ├── css/style.css          # Premium design system
│   └── uploads/               # Product images (Auto-managed)
├── sql/init.sql               # DB Schema & Meaningful seed data
├── .env                       # The Config
├── docker-compose.yml         # The Environment
└── server.js                  # The Entry Point
```

---

## Get it running

### 1. Requirements
- Install **Docker Desktop**.
- Install **Node.js**.

### 2. Set the variables
Create a `.env` file in the root and paste this:
```env
PORT=3000
DB_HOST=localhost
DB_USER=std
DB_PASSWORD=std
DB_NAME=test
SESSION_SECRET=supersecret
```

### 3. Deploy
1. **Install:** `npm install`
2. **Start DB:** `docker compose up -d`
3. **Start App:** `npm run dev`

Open: **http://localhost:3000**

---

## Why us?

- **Search Prioritization**: We don't just search. We prioritize the user's district. Higher relevance = higher conversion.
- **Smart Cart Adjustment**: If stock changes mid-purchase, the cart adjusts itself. No errors. No frustration. Just clean UX.
- **Automated Image Cleanup**: When a product is gone, the file is gone. We don't hoard bytes.
- **Validation-First**: All forms are "Sticky." If a user messes up, we keep their data and show them why. That's how you build trust.

---

## Pro Tips for Testing
- **Emails:** We use a test service. When you register, check the terminal for an **Ethereal Preview URL**. Click it to get your 6-digit code.
- **Database:** See the data at **http://localhost:8080** (Login: `std`/`std`).
- **Cart:** Everything is AJAX. The total updates instantly without a page refresh.
