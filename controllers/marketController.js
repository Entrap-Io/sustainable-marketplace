import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { validationResult } from "express-validator";

const storage = multer.diskStorage({
// ... existing storage logic ...
// (I will replace the whole file content or chunks carefully)
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
export const upload = multer({ storage });

export const dashboard = async (req, res) => {
  const sort = req.query.sort || "newest";
  
  let orderBy = "id DESC";
  switch(sort) {
      case "expiry_soon": orderBy = "expiration_date ASC"; break;
      case "stock_low": orderBy = "stock ASC"; break;
      case "stock_high": orderBy = "stock DESC"; break;
      case "price_high": orderBy = "discounted_price DESC"; break;
      case "name_asc": orderBy = "title ASC"; break;
  }

  try {
    const [products] = await db.query( 
      `SELECT *, (expiration_date < CURDATE())
      AS is_expired, DATEDIFF(expiration_date, CURDATE()) AS days_left 
      FROM products WHERE market_id = ? ORDER BY ${orderBy}`,
      [req.session.user.id]
    );
    res.render("market/dashboard", { products, sort });
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};

export const showProfile = (req, res) => {
  res.render("market/profile", { data: req.session.user, message: req.query.message });
};

export const updateProfile = async (req, res) => {
  const { name, city, district } = req.body;
  try {
    await db.query("UPDATE users SET name=?, city=?, district=? WHERE id=?", [name, city, district, req.session.user.id]);
    
    req.session.user.name = name;
    req.session.user.city = city;
    req.session.user.district = district;
    res.redirect("/market/profile?message=Profile Updated");
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};

export const showAddProduct = (req, res) => {
  res.render("market/product-form", { product: {}, action: "/market/product/add", errors: {} });
};

export const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("market/product-form", { 
      product: req.body, 
      action: "/market/product/add", 
      errors: errors.mapped() 
    });
  }

  const { title, stock, normal_price, discounted_price, expiration_date } = req.body;
  const image_filename = req.file ? req.file.filename : 'default.png';

  try {
    await db.query(
      `INSERT INTO products (title, stock, normal_price, discounted_price, expiration_date, image_filename, market_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, stock, normal_price, discounted_price, expiration_date, image_filename, req.session.user.id]
    );
    res.redirect("/market/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};

export const showEditProduct = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM products WHERE id=? 
                                  AND market_id=?`, [req.params.id, req.session.user.id]);
    if (rows.length === 0) return res.redirect("/market/dashboard");
    
    // Format date for the HTML input[type="date"] manually to avoid timezone shifts
    const p = rows[0];
    const dateObj = new Date(p.expiration_date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    p.expiration_date = `${year}-${month}-${day}`;
    
    res.render("market/product-form", { product: p, action: `/market/product/edit/${p.id}`, errors: {} });
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};

export const editProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("market/product-form", { 
      product: { ...req.body, id: req.params.id }, 
      action: `/market/product/edit/${req.params.id}`, 
      errors: errors.mapped() 
    });
  }

  const { title, stock, normal_price, discounted_price, expiration_date } = req.body;
  
  try {
    if (req.file) {
      // Delete old image if it exists
      const [rows] = await db.query("SELECT image_filename FROM products WHERE id=? AND market_id=?", [req.params.id, req.session.user.id]);
      if (rows.length > 0 && rows[0].image_filename !== 'default.png') {
        try {
          await fs.unlink(path.join("public/uploads/", rows[0].image_filename));
        } catch (err) {
          console.error("Old file delete failed:", err);
        }
      }

      await db.query(
        `UPDATE products SET title=?, stock=?, normal_price=?, discounted_price=?, expiration_date=?, image_filename=? 
        WHERE id=? AND market_id=?`,
        [title, stock, normal_price, discounted_price, expiration_date, req.file.filename, req.params.id, req.session.user.id]
      );
    } else {
      await db.query(
        `UPDATE products SET title=?, stock=?, normal_price=?, discounted_price=?, expiration_date=? 
        WHERE id=? AND market_id=?`,
        [title, stock, normal_price, discounted_price, expiration_date, req.params.id, req.session.user.id]
      );
    }
    res.redirect("/market/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT image_filename FROM products WHERE id=? AND market_id=?", [req.params.id, req.session.user.id]);
    
    if (rows.length > 0 && rows[0].image_filename !== 'default.png') {
      try {
        await fs.unlink(path.join("public/uploads/", rows[0].image_filename));
      } catch (err) {
        console.error("File delete failed:", err);
      }
    }

    await db.query(`DELETE FROM products WHERE id=? 
                   AND market_id=?`, [req.params.id, req.session.user.id]);
    res.redirect("/market/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};
