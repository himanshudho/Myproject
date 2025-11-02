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
const expertPost = require('./routes/expertPostRoutes');
const expertFollower = require('./routes/expertFollowerRoutes');
const chatRoutes = require('./routes/chatRoutes');


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
app.use("/api/createpost",expertPost);
app.use("/api",expertFollower);
app.use('/api/chat', chatRoutes);
app.use('/api/chat', chatRoutes);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

module.exports = app;


