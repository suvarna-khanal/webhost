const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});


// MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // or your RDS endpoint
  user: 'root',
  password: 'Kapilvastu2@',
  database: 'login_demo'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected!');
});

// SHA256 hashing
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Login Route
app.post('/login', (req, res) => {
  console.log('Callback hit');
  const { username, password } = req.body;
  const hashedPassword = hashPassword(password);
  console.log('Username:', username);
  console.log('Password:', password);
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, hashedPassword], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.send(`Welcome ${username}`);
    } else {
      res.send('Invalid credentials');
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

