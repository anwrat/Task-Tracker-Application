require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true,               
}));

const connectdb = require('./config/db')
connectdb()

const authRoutes = require('./routes/authRoutes');

app.use('/auth',authRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`))