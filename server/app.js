import express from 'express';
import cors from 'cors';
import airQualityRoutes from './routes/airQualityRoutes.js';
import waterQualityRoutes from './routes/waterQualityRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/air-quality', airQualityRoutes);
app.use('/api/water-quality', waterQualityRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server error'
  });
});

export default app;
