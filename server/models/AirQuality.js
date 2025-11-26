import mongoose from 'mongoose';

const airQualitySchema = new mongoose.Schema({
  station_name: {
    type: String,
    required: true
  },
  
  city_name: {
    type: String,
    required: true
  },
  
  pm25: {
    type: Number,
    required: true
  },
  
  pm10: {
    type: Number,
    required: true
  },
  
  no2: {
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

const AirQuality = mongoose.model('AirQuality', airQualitySchema);

export default AirQuality;
