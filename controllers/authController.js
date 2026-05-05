import db from "../db.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";

let transporter;

async function getTransporter() {
  if (transporter) return transporter;
  let testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
}

export const showLogin = (req, res) => {
  res.render("login", { errors: {}, data: {}, message: req.query.message });
};

export const processLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        if (!user.is_verified) {
          return res.redirect(`/auth/verify?email=${email}`);
        }
        req.session.user = { id: user.id, name: user.name, role: user.role, city: user.city, district: user.district };
        req.session.isAuthenticated = true;
        return res.redirect(user.role === 'market' ? "/market/dashboard" : "/consumer/dashboard");
      }
    }
    res.render("login", { errors: { email: { msg: "Invalid email or password" } }, data: req.body, message: null });
  } catch (err) {
    console.error(err);
    res.render("login", { errors: { email: { msg: "Server error" } }, data: req.body, message: null });
  }
};

export const showRegister = (req, res) => {
  res.render("register", { errors: {}, data: {} });
};

export const processRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("register", { errors: errors.mapped(), data: req.body });
  }

  const { email, password, role, name, city, district } = req.body;
  
  try {
    // Check if exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.render("register", { errors: { email: { msg: "Email already in use" } }, data: req.body });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code

    await db.query(
      "INSERT INTO users (email, password, role, name, city, district, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, role, name, city, district, code]
    );

    // Send email
    const mailer = await getTransporter();
    let info = await mailer.sendMail({
      from: '"Marketplace" <noreply@marketplace.com>',
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
    });

    console.log("-----------------------------------------");
    console.log(`NEW REGISTRATION: ${email}`);
    console.log(`VERIFICATION CODE: ${code}`);
    console.log("Ethereal Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");

    res.redirect(`/auth/verify?email=${email}`);
  } catch (err) {
    console.error(err);
    res.render("register", { errors: { email: { msg: "Server error" } }, data: req.body });
  }
};

export const showVerify = (req, res) => {
  const email = req.query.email || '';
  res.render("verify", { email, error: null });
};

export const processVerify = async (req, res) => {
  const { email, code } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND verification_code = ?", [email, code]);
    if (rows.length > 0) {
      await db.query("UPDATE users SET is_verified = TRUE, verification_code = NULL WHERE email = ?", [email]);
      return res.redirect("/auth/login?message=Account+verified.+Please+login.");
    }
    res.render("verify", { email, error: "Invalid code" });
  } catch (err) {
    console.error(err);
    res.render("verify", { email, error: "Server error" });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
};
