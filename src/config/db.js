const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'problemsolve'
});

db.connect((err) => {
  if (err) console.log('❌ DB Connection failed:', err);
  else console.log('✅ Connected to MySQL Database');
});

module.exports = db;
