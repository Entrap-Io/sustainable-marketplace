import db from "../db.js";

export const dashboard = async (req, res) => {
  const keyword = req.query.keyword || "";
  const page = parseInt(req.query.page) || 1;
  const scope = req.query.scope || "district";
  const sort = req.query.sort || "newest";
  const limit = 4;
  const offset = (page - 1) * limit;

  try {
    const userCity = req.session.user.city;
    const userDistrict = req.session.user.district;

    let filterField = scope === "city" ? "u.city" : "u.district";
    let filterValue = scope === "city" ? userCity : userDistrict;

    let orderBy = "p.id DESC";
    switch(sort) {
        case "price_asc": orderBy = "p.discounted_price ASC"; break;
        case "price_desc": orderBy = "p.discounted_price DESC"; break;
        case "expiry_soon": orderBy = "p.expiration_date ASC"; break;
        case "discount_high": orderBy = "((p.normal_price - p.discounted_price) / p.normal_price) DESC"; break;
        case "name_asc": orderBy = "p.title ASC"; break;
    }

    let query = `
      SELECT p.*, u.district as market_district, u.name as market_name, DATEDIFF(p.expiration_date, CURDATE()) AS days_left
      FROM products p
      JOIN users u ON p.market_id = u.id
      WHERE ${filterField} = ? AND p.expiration_date >= CURDATE() AND p.stock > 0
    `;
    let queryParams = [filterValue];

    if (keyword) {
      query += ` AND p.title LIKE ?`;
      queryParams.push(`%${keyword}%`);
    }

    query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const [products] = await db.query(query, queryParams);

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM products p
      JOIN users u ON p.market_id = u.id
      WHERE ${filterField} = ? AND p.expiration_date >= CURDATE() AND p.stock > 0
    `;
    let countParams = [filterValue];

    if (keyword) {
      countQuery += ` AND p.title LIKE ?`;
      countParams.push(`%${keyword}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    res.render("consumer/dashboard", { 
        products, 
        keyword, 
        page, 
        totalPages, 
        scope,
        sort,
        cityName: userCity,
        districtName: userDistrict
    });
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
    await db.query("UPDATE users SET name=?, city=?, district=? WHERE id=?", [name, city, district, req.session.user.id]);
    req.session.user.name = name;
    req.session.user.city = city;
    req.session.user.district = district;
    res.redirect("/consumer/profile?message=Profile Updated");
  } catch (err) {
    console.error(err);
    res.send("Server Error");
  }
};
