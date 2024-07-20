const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydatabase'
});

// MySQL 데이터베이스 연결
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// 미들웨어 설정
app.use(bodyParser.json());

// Health Check 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Readiness Check 엔드포인트
app.get('/ready', (req, res) => {
  db.ping((err) => {
    if (err) {
      res.status(500).send('Database not ready');
    } else {
      res.status(200).send('Ready');
    }
  });
});

// CRUD 엔드포인트
// CREATE
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  db.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send({ id: result.insertId, name, description });
    }
  });
});

// READ
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM items WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send('Item not found');
    } else {
      res.status(200).send(results[0]);
    }
  });
});

// UPDATE
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send('Item not found');
    } else {
      res.status(200).send({ id, name, description });
    }
  });
});

// DELETE
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send('Item not found');
    } else {
      res.status(200).send('Item deleted');
    }
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
