import express from "express";
import session from "express-session";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import consumerRoutes from "./routes/consumerRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Global variables for templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  next();
});

app.use("/auth", authRoutes);
app.use("/market", marketRoutes);
app.use("/consumer", consumerRoutes);
app.use("/cart", cartRoutes);

app.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    return req.session.user.role === 'market' 
      ? res.redirect("/market/dashboard") 
      : res.redirect("/consumer/dashboard");
  }
  res.redirect("/auth/login");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});