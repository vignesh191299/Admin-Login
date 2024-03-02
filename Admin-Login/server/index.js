const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vigneshM@123',
    database: 'test'
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });
  
  app.use(express.json());

  const adminCredentials = {
    username: 'admin',
    password: 'password'
  };

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === adminCredentials.username && password === adminCredentials.password) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

app.post('/students', (req, res) => {
  const { id, name, email, phoneNumber, dob } = req.body;
  const query = 'INSERT INTO students (id,name, email, phoneNumber, dob) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [id,name, email, phoneNumber, dob], (error, results, fields) => {
    if (error) throw error;
    res.send('Student created successfully');
  });
});

// Read all students
app.get('/students', (req, res) => {
  connection.query('SELECT * FROM students', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

app.put('/students/:id', (req, res) => {
  const { name, email, phoneNumber, dob } = req.body;
  const id = req.params.id;
  const query = 'UPDATE students SET name=?, email=?, phoneNumber=?, dob=? WHERE id=?';
  connection.query(query, [name, email, phoneNumber, dob, id], (error, results, fields) => {
    if (error) throw error;
    res.send('Student updated successfully');
  });
});

app.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM students WHERE id=?';
  connection.query(query, [id], (error, results, fields) => {
    if (error) throw error;
    res.send('Student deleted successfully');
  });
});

app.post('/marks', (req, res) => {
  const { id, studentId, reactjs, nodejs, reactNative, figma } = req.body;
  const checkQuery = 'SELECT COUNT(*) AS count FROM marks WHERE studentId = ?';
  connection.query(checkQuery, [studentId], (error, results, fields) => {
    if (error) {
      throw error;
    }
    const count = results[0].count;
    if (count > 0) {
      res.status(400).send('Marks for this student already exist');
    } else {
      const insertQuery = 'INSERT INTO marks (id, studentId, reactjs, nodejs, reactNative, figma) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [id, studentId, reactjs, nodejs, reactNative, figma], (error, results, fields) => {
        if (error) {
          throw error;
        }
        res.send('Marks added successfully');
      });
    }
  });
});



app.get('/marks/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const query = 'SELECT students.name, marks.* FROM marks INNER JOIN students ON marks.studentId = students.id WHERE marks.studentId = ?';
  connection.query(query, [studentId], (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

app.put('/marks/:studentId', (req, res) => {
  const { reactjs, nodejs, reactNative, figma } = req.body;
  const studentId = req.params.studentId;
  const query = 'UPDATE marks SET reactjs=?, nodejs=?, reactNative=?, figma=? WHERE studentId=?';
  connection.query(query, [reactjs, nodejs, reactNative, figma, studentId], (error, results, fields) => {
    if (error) throw error;
    res.send('Marks updated successfully');
  });
});


app.delete('/marks/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const query = 'DELETE FROM marks WHERE studentId=?';
  connection.query(query, [studentId], (error, results, fields) => {
    if (error) throw error;
    res.send('Marks deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
