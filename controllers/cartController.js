import db from "../db.js";

export const getCartCount = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT SUM(quantity) as count FROM cart_items WHERE user_id=?", [req.session.user.id]);
    res.json({ count: rows[0].count || 0 });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const addToCart = async (req, res) => {
  const { product_id } = req.body;
  
  try {
    const [products] = await db.query("SELECT stock, title FROM products WHERE id=?", [product_id]);
    if (products.length === 0 || products[0].stock <= 0) {
      return res.status(400).json({ error: "Sorry, this item is now sold out." });
    }

    const [rows] = await db.query("SELECT id, quantity FROM cart_items WHERE user_id=? AND product_id=?", [req.session.user.id, product_id]);
    
    if (rows.length > 0) {
      if (rows[0].quantity + 1 > products[0].stock) {
        return res.status(400).json({ error: `Only ${products[0].stock} units of ${products[0].title} are available.` });
      }
      await db.query("UPDATE cart_items SET quantity = quantity + 1 WHERE id=?", [rows[0].id]);
    } else {
      await db.query("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)", [req.session.user.id, product_id]);
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
      await db.query("DELETE FROM cart_items WHERE id=? AND user_id=?", [cart_id, req.session.user.id]);
    } else if (action === 'increase') {
      const [rows] = await db.query(`
        SELECT c.quantity, p.stock, p.title 
        FROM cart_items c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.id=?`, [cart_id]);
      
      if (rows.length > 0 && rows[0].quantity + 1 > rows[0].stock) {
        return res.json({ success: false, error: `Only ${rows[0].stock} units of ${rows[0].title} are available.` });
      }
      
      await db.query("UPDATE cart_items SET quantity = quantity + 1 WHERE id=? AND user_id=?", [cart_id, req.session.user.id]);
    } else if (action === 'decrease') {
      await db.query("UPDATE cart_items SET quantity = quantity - 1 WHERE id=? AND user_id=?", [cart_id, req.session.user.id]);
      await db.query("DELETE FROM cart_items WHERE id=? AND quantity <= 0", [cart_id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const purchase = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const [cartItems] = await connection.query(`
      SELECT c.id as cart_id, c.product_id, c.quantity, p.stock, p.title 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id=?`, [req.session.user.id]);
    
    if (cartItems.length === 0) return res.status(400).json({ success: false, error: "Cart is empty" });

    let adjustments = [];
    for (let item of cartItems) {
      if (item.stock <= 0) {
        adjustments.push(`"${item.title}" is sold out and was removed.`);
        await connection.query("DELETE FROM cart_items WHERE id=?", [item.cart_id]);
      } else if (item.quantity > item.stock) {
        adjustments.push(`"${item.title}" quantity was reduced to ${item.stock} due to stock limits.`);
        await connection.query("UPDATE cart_items SET quantity = ? WHERE id=?", [item.stock, item.cart_id]);
      }
    }

    if (adjustments.length > 0) {
      return res.json({ 
        success: false, 
        adjusted: true, 
        message: "Some items in your cart were adjusted due to stock changes.",
        details: adjustments
      });
    }

    // No adjustments needed, proceed with transaction
    await connection.beginTransaction();
    for (let item of cartItems) {
      await connection.query("UPDATE products SET stock = stock - ? WHERE id=?", [item.quantity, item.product_id]);
    }
    await connection.query("DELETE FROM cart_items WHERE user_id=?", [req.session.user.id]);
    await connection.commit();
    
    res.json({ success: true });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, error: "An unexpected error occurred." });
  } finally {
    if (connection) connection.release();
  }
};
