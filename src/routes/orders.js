const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/orders - Get all orders with user and product info
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT o.id, o.quantity, o.total_price, o.status, o.ordered_at,
             u.name AS user_name, u.email AS user_email,
             p.name AS product_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.id
    `;
    let params = [];

    if (status) {
      query += " WHERE o.status = $1";
      params.push(status);
    }

    query += " ORDER BY o.ordered_at DESC";
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

// GET /api/orders/:id - Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT o.*, u.name AS user_name, u.email AS user_email,
              p.name AS product_name, p.price AS unit_price
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN products p ON o.product_id = p.id
       WHERE o.id = $1`,
      [id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
