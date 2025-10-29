const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const expertRoutes = require('./routes/expertRoutes');
const expertProfileRoutes = require('./routes/expertProfileRoutes');
const expertPriceRoutes = require('./routes/expertPriceRoutes');
const userRoutes = require('./routes/userRoutes');
const userWalletRoutes = require('./routes/userWalletRoutes');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/expert-profiles', expertProfileRoutes);
app.use('/api/expert-price', expertPriceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", userWalletRoutes);

module.exports = app;


