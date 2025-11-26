import mongoose from 'mongoose';

const waterQualitySchema = new mongoose.Schema({
  station_name: {
    type: String,
    required: true
  },
  
  location: {
    type: String,
    required: true
  },
  
  ph_level: {
    type: Number,
    required: true
  },
  
  dissolved_oxygen: {
    type: Number,
    required: true
  },
  
  temperature: {
    type: Number,
    required: true
  },
  
  measurement_time: {
    type: Date,
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const WaterQuality = mongoose.model('WaterQuality', waterQualitySchema);

export default WaterQuality;
