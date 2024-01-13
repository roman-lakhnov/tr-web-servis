const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing
const saltRounds = 10; // Number of salt rounds for hashing
const sql = require('better-sqlite3');
const cors = require('cors');
const { getData, getSingleData } = require('./lib/data'); // Adjust the path accordingly

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());


const db = sql('data.db');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/data', async (req, res) => {
  const data = await getData();
  res.json(data);
});

app.get('/data/:slug', (req, res) => {
  const { slug } = req.params;
  const singleData = getSingleData(slug);

  if (singleData) {
    res.json(singleData);
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

// Registration route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the database
    const result = db
      .prepare(
        `
        INSERT INTO users (username, email, password)
        VALUES (@username, @email, @password)
        `
      )
      .run({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/data', (req, res) => {
  const data = req.body;

  // Insert the data into the database
  const stmt = db.prepare(`
    INSERT INTO data VALUES (
      null,
      @slug,
      @title,
      @image,
      @summary,
      @instructions,
      @creator,
      @creator_email
    )
  `);

  try {
    stmt.run(data);
    res.status(201).json({ message: 'Data added successfully!' });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
