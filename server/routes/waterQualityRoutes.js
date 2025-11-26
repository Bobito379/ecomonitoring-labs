import express from 'express';
import {
  createWaterQuality,
  getAllWaterQuality,
  getWaterQualityById,
  updateWaterQuality,
  deleteWaterQuality
} from '../controllers/waterQualityController.js';

const router = express.Router();

router.post('/', createWaterQuality);
router.get('/', getAllWaterQuality);
router.get('/:id', getWaterQualityById);
router.put('/:id', updateWaterQuality);
router.delete('/:id', deleteWaterQuality);

export default router;
