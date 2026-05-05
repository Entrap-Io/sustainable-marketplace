import db from "../db.js";

export const dashboard = async (req, res) => {
  const keyword = req.query.keyword || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const offset = (page - 1) * limit;

  try {
    const userCity = req.session.user.city;
    const selectedDistrict = req.query.district || "ALL";
    const userDistrict = req.session.user.district;

    let query = `
      SELECT p.*, u.district as market_district, 
      u.name as market_name, 
      DATEDIFF(p.expiration_date, CURDATE()) AS days_left
      FROM products p
      JOIN users u ON p.market_id = u.id
      WHERE u.city = ? 
      AND u.district = ? 
      AND p.expiration_date >= CURDATE() AND p.stock > 0
    `;
    let queryParams = [userCity, userDistrict];

    if (keyword) {
      query += ` AND p.title LIKE ?`;
      queryParams.push(`%${keyword}%`);
    }

    query += ` ORDER BY (u.district = ?) DESC, p.id DESC LIMIT ? OFFSET ?`;
    queryParams.push(userDistrict, limit, offset);

    const [products] = await db.query(query, queryParams);

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM products p
      JOIN users u ON p.market_id = u.id
      WHERE u.city = ? 
      AND p.expiration_date >= CURDATE() 
      AND p.stock > 0 ${selectedDistrict !== "ALL" ? "AND u.district = ?" : ""}
    `;
    let countParams = [userCity];
    if (selectedDistrict !== "ALL") {
       countParams.push(selectedDistrict);
    }
    if (keyword) {
      countQuery += ` AND p.title LIKE ?`;
      countParams.push(`%${keyword}%`);
    }
    const [countResult] = await db.query(countQuery, countParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    res.render("consumer/dashboard", { products, keyword, page, totalPages, selectedDistrict });
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};

export const showProfile = (req, res) => {
  res.render("consumer/profile", { data: req.session.user, message: req.query.message });
};

export const updateProfile = async (req, res) => {
  const { name, city, district } = req.body;
  try {
    await db.query("UPDATE users 
                   SET name=?, city=?, district=? WHERE id=?", [name, city, district, req.session.user.id]);
    req.session.user.name = name;
    req.session.user.city = city;
    req.session.user.district = district;
    res.redirect("/consumer/profile?message=Profile Updated");
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};
