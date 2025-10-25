const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/categories', categoryRoutes);

module.exports = app;
