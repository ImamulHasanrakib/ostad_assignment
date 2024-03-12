const express = require('express');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./src/routes/api');
const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();

// cors configuration
app.use(cors());
//security configuration
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  legacyHeaders: false,
});
app.use(limiter);

// for database connection
const db = process.env.DB_URL;
mongoose
  .connect(db)
  .then(() => {
    console.log('db connection established');
  })
  .catch((err) => console.log(err));

// router configuration
app.use('/users', router);
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

// server configuration
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
