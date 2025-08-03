require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;


const connectdb = require('./config/db')
connectdb()

const authRoutes = require('./routes/authRoutes');

app.use('/auth',authRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`))