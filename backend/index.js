require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());

const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,               
}));

const connectdb = require('./config/db')
connectdb()

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

//For login and register
app.use('/auth',authRoutes);

//For tasks
app.use('/tasks',taskRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`))