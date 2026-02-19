const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = "SELECT * FROM products";
    let params = [];

    if (category) {
      query += " WHERE category = $1";
      params.push(category);
    }

    query += " ORDER BY id";
    const result = await pool.query(query, params);
    res.json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id - Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
