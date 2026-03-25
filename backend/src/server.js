require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

/* Auto-create users table */
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE
      );
    `);
    console.log("Users table ready");
  } catch (err) {
    console.error("Table creation error:", err);
  }
})();

/* Routes */
app.get("/health", (req, res) => res.status(200).send("OK"));
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch {
    res.status(500).send("Server error");
  }
});
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).send("Missing fields");
  try {
    await pool.query("INSERT INTO users(name,email) VALUES($1,$2)", [name, email]);
    res.status(201).send("User added");
  } catch {
    res.status(400).send("Email already exists");
  }
});
app.delete("/api/users/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.send("User deleted");
  } catch {
    res.status(500).send("Delete failed");
  }
});

/* Start server */
app.listen(process.env.PORT || 5000, "0.0.0.0", () =>
  console.log(`Backend running on port ${process.env.PORT || 5000}`)
);