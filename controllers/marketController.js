import db from "../db.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
export const upload = multer({ storage });

export const dashboard = async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT *, (expiration_date < CURDATE()) AS is_expired, DATEDIFF(expiration_date, CURDATE()) AS days_left FROM products WHERE market_id = ? ORDER BY id DESC",
      [req.session.user.id]
    );
    res.render("market/dashboard", { products });
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
  res.render("market/product-form", { product: {}, action: "/market/product/add" });
};

export const addProduct = async (req, res) => {
  const { title, stock, normal_price, discounted_price, expiration_date } = req.body;
  const image_filename = req.file ? req.file.filename : 'default.png';

  try {
    await db.query(
      "INSERT INTO products (title, stock, normal_price, discounted_price, expiration_date, image_filename, market_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
    const [rows] = await db.query("SELECT * FROM products WHERE id=? AND market_id=?", [req.params.id, req.session.user.id]);
    if (rows.length === 0) return res.redirect("/market/dashboard");
    
    // Format date for the HTML input[type="date"]
    const p = rows[0];
    p.expiration_date = p.expiration_date.toISOString().split('T')[0];
    
    res.render("market/product-form", { product: p, action: `/market/product/edit/${p.id}` });
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};

export const editProduct = async (req, res) => {
  const { title, stock, normal_price, discounted_price, expiration_date } = req.body;
  
  try {
    if (req.file) {
      await db.query(
        "UPDATE products SET title=?, stock=?, normal_price=?, discounted_price=?, expiration_date=?, image_filename=? WHERE id=? AND market_id=?",
        [title, stock, normal_price, discounted_price, expiration_date, req.file.filename, req.params.id, req.session.user.id]
      );
    } else {
      await db.query(
        "UPDATE products SET title=?, stock=?, normal_price=?, discounted_price=?, expiration_date=? WHERE id=? AND market_id=?",
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
    await db.query("DELETE FROM products WHERE id=? AND market_id=?", [req.params.id, req.session.user.id]);
    res.redirect("/market/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};
