const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');

dotenv.config();

const app       = express();
const PORT      = 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/hr_workflow';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/workflows', require('./routes/workflows'));
app.use('/api/rules',     require('./routes/rules'));
app.use('/api/auditlogs', require('./routes/auditLogs'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/api/health', function(req, res) {
  res.json({ status: 'OK' });
});

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000, family: 4 }).then(function() {
  console.log('✅ MongoDB connected');
  app.listen(PORT, function() {
    console.log('🚀 Server running on http://localhost:' + PORT);
  });
}).catch(function(err) {
  console.error('❌ MongoDB failed:', err.message);
  process.exit(1);
});

