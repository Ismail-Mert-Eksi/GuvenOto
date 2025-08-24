const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { dynamicRateLimiter } = require('./middleware/rateLimiter');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const app = express();

// proxy arkasında isen (HTTPS cookie için gerekli)
app.set('trust proxy', 1);

// CORS
const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: ORIGIN,
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '1mb' }));            // HTML verisi için yeterli
app.use(express.urlencoded({ extended: true }));     // form-urlencoded

app.use(cookieParser());
app.use(helmet());            // API için default yeterli
app.use(compression());       // response sıkıştırma
app.use(morgan('dev'));
app.use(dynamicRateLimiter);

// Sağlık
app.get('/', (req, res) => res.send('🚀 API çalışıyor'));

// Rotalar
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/cars/filters', require('./routes/filtersRoutes'));
app.use('/api/cars/hierarchy', require('./routes/hierarchyRoutes'));
app.use('/api/', require('./routes/statisticsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/spareparts', require('./routes/sparePartRoutes'));

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint bulunamadı' });
});

// Global error handler (multer vs. dahil)
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Sunucu hatası' });
});

// Graceful shutdown
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Sunucu ${process.env.PORT || 5000} portunda`);
});
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
function shutdown() {
  console.log('🛑 Kapanıyor...');
  server.close(() => {
    // mongoose.connection.close(false, () => process.exit(0));
    process.exit(0);
  });
}
