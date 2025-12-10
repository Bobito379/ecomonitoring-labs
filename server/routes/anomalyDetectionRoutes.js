import express from 'express';
import {
  detectAnomalies,
  getAllAnomalies,
  getAnomalyById,
  deleteAnomaly,
  getTimeSeriesData
} from '../controllers/anomalyDetectionController.js';

const router = express.Router();

router.post('/detect', detectAnomalies);
router.get('/', getAllAnomalies);
router.get('/:id', getAnomalyById);
router.get('/:id/timeseries', getTimeSeriesData);
router.delete('/:id', deleteAnomaly);

export default router;
