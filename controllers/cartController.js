import db from "../db.js";

export const getCartCount = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT SUM(quantity) as count
                                  FROM cart_items WHERE user_id=?", [req.session.user.id]);
    res.json({ count: rows[0].count || 0 });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const addToCart = async (req, res) => {
  const { product_id } = req.body;
  try {
    const [rows] = await db.query("SELECT id,
                                  quantity FROM cart_items 
      WHERE user_id=? AND product_id=?", 
      [req.session.user.id, product_id]);
    if (rows.length > 0) {
      await db.query("UPDATE cart_items 
                     SET quantity = quantity + 1 
        WHERE id=?", [rows[0].id]);
    } else {
      await db.query("INSERT INTO cart_items 
                     (user_id, product_id, quantity) VALUES (?, ?, 1)", 
        [req.session.user.id, product_id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const viewCart = async (req, res) => {
  try {
    const [cartItems] = await db.query(`
      SELECT c.id as cart_id, c.quantity, p.* 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `, [req.session.user.id]);
    
    res.render("consumer/cart", { cartItems });
  } catch (err) {
    res.send("Server Error");
  }
};

export const updateCart = async (req, res) => {
  const { cart_id, action } = req.body;
  try {
    if (action === 'remove') {
      await db.query("DELETE FROM cart_items
                     WHERE id=? AND user_id=?", 
        [cart_id, req.session.user.id]);
    } else if (action === 'increase') {
      await db.query("UPDATE cart_items 
                     SET quantity = quantity + 1 
        WHERE id=? AND user_id=?", 
          [cart_id, req.session.user.id]);
    } else if (action === 'decrease') {
      await db.query("UPDATE cart_items 
                     SET quantity = quantity - 1 
        WHERE id=? AND user_id=?", 
          [cart_id, req.session.user.id]);
      await db.query("DELETE FROM cart_items 
                     WHERE id=? AND quantity <= 0", [cart_id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const purchase = async (req, res) => {
  try {
    const [cartItems] = await db.query("SELECT product_id, 
                                       quantity FROM cart_items WHERE user_id=?", 
      [req.session.user.id]);
    
    for (let item of cartItems) {
      await db.query("UPDATE products 
                     SET stock = stock - ? WHERE id=?", 
        [item.quantity, item.product_id]);
    }
    
    await db.query("DELETE FROM cart_items 
                   WHERE user_id=?", 
      [req.session.user.id]);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
