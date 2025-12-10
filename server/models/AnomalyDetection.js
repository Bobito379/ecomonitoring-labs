import mongoose from 'mongoose';

const timeSeriesDataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  movingAvg: {
    type: Number
  },
  stdDev: {
    type: Number
  },
  isAnomaly: {
    type: Boolean,
    default: false
  }
});

const anomalyDetectionSchema = new mongoose.Schema({
  stationId: {
    type: String,
    required: true
  },
  pollutant: {
    type: String,
    required: true,
    enum: ['PM2.5', 'NO2', 'SO2', 'O3']
  },
  timeSeries: [timeSeriesDataSchema],
  analysisParams: {
    windowSize: {
      type: Number,
      required: true
    },
    thresholdMultiplier: {
      type: Number,
      default: 3
    },
    minEventDuration: {
      type: Number,
      default: 10
    }
  },
  detectedAnomalies: [{
    startTime: Date,
    endTime: Date,
    duration: Number,
    maxValue: Number,
    avgValue: Number
  }],
  p95: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AnomalyDetection = mongoose.model('AnomalyDetection', anomalyDetectionSchema);

export default AnomalyDetection;
