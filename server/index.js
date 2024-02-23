const express = require("express");
const app = express();
const pg = require("pg");
const { Pool } = pg;
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgres://localhost/acme_hr_db",
});
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = "SELECT * FROM employees";
    const response = await pool.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    console.error("Error executing query:", ex);
    res.status(500).send("Internal Server Error");
  }
});

const init = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS employees;
      CREATE TABLE employees(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        is_admin BOOLEAN DEFAULT FALSE
      );
      INSERT INTO employees(name, is_admin) VALUES('Sarah', false);
      INSERT INTO employees(name, is_admin) VALUES('Tim', false);
      INSERT INTO employees(name, is_admin) VALUES('Matt', true);
    `);
    console.log("Tables created and data seeded");
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

init();
