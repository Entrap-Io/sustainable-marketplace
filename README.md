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

## Full Project Map

```text
.
├── controllers/
│   ├── authController.js      # Logic for login, register, and email verification
│   ├── authMiddleware.js      # Protects routes based on role (Consumer vs Market)
│   ├── cartController.js      # Logic for the AJAX shopping cart
│   ├── consumerController.js   # Logic for search and consumer profiles
│   └── marketController.js     # Logic for product CRUD and uploads
├── routes/
│   ├── authRoutes.js          # URLs for /auth (login, logout, register)
│   ├── cartRoutes.js          # URLs for /cart (add, update, purchase)
│   ├── consumerRoutes.js      # URLs for /consumer (search, profile)
│   └── marketRoutes.js        # URLs for /market (dashboard, products)
├── views/
│   ├── consumer/
│   │   ├── cart.ejs           # Shopping cart page
│   │   └── dashboard.ejs      # Product search page
│   ├── market/
│   │   ├── dashboard.ejs      # Product management page
│   │   ├── product-form.ejs   # Add/Edit product form
│   │   └── profile.ejs        # Market profile settings
│   ├── partials/
│   │   ├── footer.ejs         # Reusable footer
│   │   └── header.ejs         # Reusable navbar
│   ├── login.ejs              # Auth: Login page
│   ├── register.ejs           # Auth: Register page
│   └── verify.ejs             # Auth: Email verification page
├── public/
│   ├── css/
│   │   └── style.css          # Custom styling
│   └── uploads/               # Where product images are stored
├── sql/
│   └── init.sql               # Database setup and test data script
├── .env                       # Environment variables (Secrets)
├── .gitignore                 # Files to ignore on GitHub
├── db.js                      # Database connection pool
├── docker-compose.yml         # Container configuration
├── package.json               # Dependencies and scripts
├── README.md                  # This file
└── server.js                  # Main entry point
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

Go to: **http://localhost:3000**

---

## Pro Tips for Testing
- **Emails:** We use a test service. When you register, check the terminal for an **Ethereal Preview URL**. Click it to get your 6-digit code.
- **Database:** See the data at **http://localhost:8080** (Login: `std`/`std`).
- **Cart:** Everything is AJAX. The total updates instantly without a page refresh.
