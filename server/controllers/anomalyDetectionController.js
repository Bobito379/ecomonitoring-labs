import AnomalyDetection from '../models/AnomalyDetection.js';
import { computeAnomalies, validateAnomalyInput } from '../utils/anomalyCompute.js';

export const detectAnomalies = async (req, res) => {
  try {
    const validationErrors = validateAnomalyInput(req.body);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    const { stationId, pollutant, timeSeries, windowSize, thresholdMultiplier, minEventDuration } = req.body;

    const result = computeAnomalies({
      timeSeries,
      windowSize: windowSize || 120,
      thresholdMultiplier: thresholdMultiplier || 3,
      minEventDuration: minEventDuration || 10
    });

    const anomalyRecord = new AnomalyDetection({
      stationId,
      pollutant,
      timeSeries: result.processedSeries,
      analysisParams: {
        windowSize: windowSize || 120,
        thresholdMultiplier: thresholdMultiplier || 3,
        minEventDuration: minEventDuration || 10
      },
      detectedAnomalies: result.detectedAnomalies,
      p95: result.p95
    });

    await anomalyRecord.save();

    res.status(201).json({
      success: true,
      data: {
        id: anomalyRecord._id,
        summary: result.summary,
        detectedAnomalies: result.detectedAnomalies,
        p95: result.p95,
        processedSeries: result.processedSeries
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getAllAnomalies = async (req, res) => {
  try {
    const { pollutant, stationId } = req.query;
    const filter = {};
    
    if (pollutant) filter.pollutant = pollutant;
    if (stationId) filter.stationId = stationId;

    const anomalies = await AnomalyDetection.find(filter)
      .select('-timeSeries')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: anomalies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getAnomalyById = async (req, res) => {
  try {
    const { id } = req.params;

    const anomaly = await AnomalyDetection.findById(id);

    if (!anomaly) {
      return res.status(404).json({
        success: false,
        error: 'Anomaly record not found'
      });
    }

    res.json({
      success: true,
      data: anomaly
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteAnomaly = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await AnomalyDetection.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Anomaly record not found'
      });
    }

    res.json({
      success: true,
      message: 'Anomaly record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getTimeSeriesData = async (req, res) => {
  try {
    const { id } = req.params;

    const anomaly = await AnomalyDetection.findById(id)
      .select('timeSeries pollutant stationId analysisParams');

    if (!anomaly) {
      return res.status(404).json({
        success: false,
        error: 'Anomaly record not found'
      });
    }

    res.json({
      success: true,
      data: {
        pollutant: anomaly.pollutant,
        stationId: anomaly.stationId,
        analysisParams: anomaly.analysisParams,
        timeSeries: anomaly.timeSeries
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
