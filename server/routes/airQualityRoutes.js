import express from 'express';
import {
  createAirQuality,
  getAllAirQuality,
  getAirQualityById,
  updateAirQuality,
  deleteAirQuality
} from '../controllers/airQualityController.js';

const router = express.Router();

router.post('/', createAirQuality);
router.get('/', getAllAirQuality);
router.get('/:id', getAirQualityById);
router.put('/:id', updateAirQuality);
router.delete('/:id', deleteAirQuality);

export default router;
