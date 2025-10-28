const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config(); 
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/announcements', require('./routes/announcement.routes'));
app.use('/api/class', require('./routes/class.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/result', require('./routes/result.routes'));

app.get('/', (req, res) => {
  res.send('MongoDB connected successfully!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
