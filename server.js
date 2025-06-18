const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "userDetails.db");

const app = express();

app.use(express.json());

let database = null;

const initializeingServrAndDatabase = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeingServrAndDatabase();

app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  const query = `
    INSERT INTO contact (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;
  await database.run(query, [name, email, subject, message]);
  res.status(201).send({ message: "Contact saved successfully" });
});

// GET all contacts
app.get("/contacts", async (req, res) => {
  const contacts = await database.all(
    `SELECT * FROM contact ORDER BY created_at DESC`
  );
  res.send(contacts);
});
