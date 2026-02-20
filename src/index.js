require("dotenv").config();
const express = require("express");
const { createDatabase } = require("./db/createDatabase");
const { createTables } = require("./db/tables");
const { seedData } = require("./db/seed");
const {
  healthCheck,
  livenessProbe,
  readinessProbe,
} = require("./routes/health");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// --- Health / Liveness Routes ---
app.get("/api/health", healthCheck);
app.get("/api/liveness", livenessProbe);
app.get("/api/readiness", readinessProbe);

// --- API Routes ---
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Test Database API",
    endpoints: {
      health: "/api/health",
      liveness: "/api/liveness",
      readiness: "/api/readiness",
      users: "/api/users",
      products: "/api/products",
      orders: "/api/orders",
    },
  });
});

// --- Startup ---
async function startServer() {
  try {
    console.log("=== Starting Application ===");

    // Step 1: Create database if not exists
    console.log("\n[1/3] Creating database...");
    await createDatabase();

    // Step 2: Create tables
    console.log("\n[2/3] Creating tables...");
    await createTables();

    // Step 3: Seed dummy data
    console.log("\n[3/3] Seeding dummy data...");
    await seedData();

    
  } catch (err) {
    console.error("Failed to start server:", err.message);
    // process.exit(1);
  }

  try {
    // Step 4: Start Express server
    app.listen(PORT, () => {
      console.log(`\n=== Server running on http://localhost:${PORT} ===`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Liveness:     http://localhost:${PORT}/api/liveness`);
      console.log(`Readiness:    http://localhost:${PORT}/api/readiness`);
      console.log(`Users:        http://localhost:${PORT}/api/users`);
      console.log(`Products:     http://localhost:${PORT}/api/products`);
      console.log(`Orders:       http://localhost:${PORT}/api/orders`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
}

startServer();
