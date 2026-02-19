const pool = require("./pool");

const dummyUsers = [
  {
    name: "Sahan Perera",
    email: "sahan@example.com",
    age: 28,
    city: "Colombo",
  },
  { name: "Kamal Silva", email: "kamal@example.com", age: 34, city: "Kandy" },
  {
    name: "Nimal Fernando",
    email: "nimal@example.com",
    age: 25,
    city: "Galle",
  },
  {
    name: "Amaya Jayawardena",
    email: "amaya@example.com",
    age: 30,
    city: "Colombo",
  },
  {
    name: "Dasun Rajapaksa",
    email: "dasun@example.com",
    age: 22,
    city: "Matara",
  },
];

const dummyProducts = [
  {
    name: "Laptop",
    description: "High performance laptop with 16GB RAM",
    price: 1299.99,
    stock: 50,
    category: "Electronics",
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse",
    price: 29.99,
    stock: 200,
    category: "Electronics",
  },
  {
    name: "Desk Chair",
    description: "Adjustable office chair with lumbar support",
    price: 349.99,
    stock: 30,
    category: "Furniture",
  },
  {
    name: "Notebook",
    description: "A5 ruled notebook, 200 pages",
    price: 5.99,
    stock: 500,
    category: "Stationery",
  },
  {
    name: "Coffee Mug",
    description: "Ceramic mug with motivational quote",
    price: 12.99,
    stock: 100,
    category: "Kitchen",
  },
  {
    name: "Backpack",
    description: "Water-resistant laptop backpack",
    price: 49.99,
    stock: 75,
    category: "Accessories",
  },
];

const dummyOrders = [
  {
    user_id: 1,
    product_id: 1,
    quantity: 1,
    total_price: 1299.99,
    status: "completed",
  },
  {
    user_id: 2,
    product_id: 3,
    quantity: 2,
    total_price: 699.98,
    status: "completed",
  },
  {
    user_id: 3,
    product_id: 2,
    quantity: 3,
    total_price: 89.97,
    status: "pending",
  },
  {
    user_id: 1,
    product_id: 5,
    quantity: 1,
    total_price: 12.99,
    status: "shipped",
  },
  {
    user_id: 4,
    product_id: 6,
    quantity: 1,
    total_price: 49.99,
    status: "pending",
  },
  {
    user_id: 5,
    product_id: 4,
    quantity: 10,
    total_price: 59.9,
    status: "completed",
  },
  {
    user_id: 2,
    product_id: 1,
    quantity: 1,
    total_price: 1299.99,
    status: "shipped",
  },
];

async function seedData() {
  try {
    // Check if data already exists
    const existingUsers = await pool.query("SELECT COUNT(*) FROM users");
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log("Data already seeded. Skipping...");
      return;
    }

    // Seed users
    for (const user of dummyUsers) {
      await pool.query(
        "INSERT INTO users (name, email, age, city) VALUES ($1, $2, $3, $4)",
        [user.name, user.email, user.age, user.city],
      );
    }
    console.log(`Seeded ${dummyUsers.length} users.`);

    // Seed products
    for (const product of dummyProducts) {
      await pool.query(
        "INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5)",
        [
          product.name,
          product.description,
          product.price,
          product.stock,
          product.category,
        ],
      );
    }
    console.log(`Seeded ${dummyProducts.length} products.`);

    // Seed orders
    for (const order of dummyOrders) {
      await pool.query(
        "INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES ($1, $2, $3, $4, $5)",
        [
          order.user_id,
          order.product_id,
          order.quantity,
          order.total_price,
          order.status,
        ],
      );
    }
    console.log(`Seeded ${dummyOrders.length} orders.`);
  } catch (err) {
    console.error("Error seeding data:", err.message);
    throw err;
  }
}

module.exports = { seedData };
