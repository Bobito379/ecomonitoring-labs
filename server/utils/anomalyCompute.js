export function computeAnomalies(payload) {
  const { timeSeries, windowSize = 120, thresholdMultiplier = 3, minEventDuration = 10 } = payload;

  if (!timeSeries || timeSeries.length === 0) {
    throw new Error('Time series cannot be empty');
  }

  const actualWindowSize = Math.min(windowSize, Math.floor(timeSeries.length / 2));
  
  if (timeSeries.length < 24) {
    throw new Error(`Time series must have at least 24 data points, got ${timeSeries.length}`);
  }

  const sortedData = [...timeSeries].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  const processedSeries = [];
  const values = sortedData.map(d => d.value);
  const p95 = calculatePercentile(values, 95);

  for (let i = 0; i < sortedData.length; i++) {
    const windowStart = Math.max(0, i - actualWindowSize + 1);
    const windowEnd = i + 1;
    const window = values.slice(windowStart, windowEnd);

    const movingAvg = calculateMean(window);
    const stdDev = calculateStdDev(window, movingAvg);
    
    const threshold = movingAvg + thresholdMultiplier * stdDev;
    const isAnomaly = sortedData[i].value > threshold;

    processedSeries.push({
      timestamp: sortedData[i].timestamp,
      value: sortedData[i].value,
      movingAvg: parseFloat(movingAvg.toFixed(2)),
      stdDev: parseFloat(stdDev.toFixed(2)),
      threshold: parseFloat(threshold.toFixed(2)),
      isAnomaly
    });
  }

  const detectedAnomalies = detectAnomalyEvents(processedSeries, minEventDuration);

  return {
    processedSeries,
    detectedAnomalies,
    p95: parseFloat(p95.toFixed(2)),
    summary: {
      totalPoints: processedSeries.length,
      anomalyPoints: processedSeries.filter(p => p.isAnomaly).length,
      anomalyEvents: detectedAnomalies.length,
      p95Value: parseFloat(p95.toFixed(2))
    }
  };
}

function calculateMean(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateStdDev(values, mean) {
  if (values.length === 0) return 0;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculatePercentile(values, percentile) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

function detectAnomalyEvents(processedSeries, minEventDuration) {
  const events = [];
  let currentEvent = null;

  for (let i = 0; i < processedSeries.length; i++) {
    const point = processedSeries[i];
    
    if (point.isAnomaly) {
      if (!currentEvent) {
        currentEvent = {
          startTime: point.timestamp,
          startIndex: i,
          maxValue: point.value,
          values: [point.value]
        };
      } else {
        currentEvent.values.push(point.value);
        if (point.value > currentEvent.maxValue) {
          currentEvent.maxValue = point.value;
        }
      }
    } else {
      if (currentEvent) {
        const duration = (i - currentEvent.startIndex);
        
        if (duration >= minEventDuration) {
          events.push({
            startTime: currentEvent.startTime,
            endTime: processedSeries[i - 1].timestamp,
            duration,
            maxValue: parseFloat(currentEvent.maxValue.toFixed(2)),
            avgValue: parseFloat(calculateMean(currentEvent.values).toFixed(2))
          });
        }
        
        currentEvent = null;
      }
    }
  }

  if (currentEvent) {
    const duration = (processedSeries.length - currentEvent.startIndex);
    if (duration >= minEventDuration) {
      events.push({
        startTime: currentEvent.startTime,
        endTime: processedSeries[processedSeries.length - 1].timestamp,
        duration,
        maxValue: parseFloat(currentEvent.maxValue.toFixed(2)),
        avgValue: parseFloat(calculateMean(currentEvent.values).toFixed(2))
      });
    }
  }

  return events;
}

export function validateAnomalyInput(payload) {
  const errors = [];

  if (!payload.stationId || typeof payload.stationId !== 'string') {
    errors.push('stationId is required and must be a string');
  }

  if (!payload.pollutant || !['PM2.5', 'NO2', 'SO2', 'O3'].includes(payload.pollutant)) {
    errors.push('pollutant must be one of: PM2.5, NO2, SO2, O3');
  }

  if (!payload.timeSeries || !Array.isArray(payload.timeSeries)) {
    errors.push('timeSeries is required and must be an array');
  } else if (payload.timeSeries.length < 24) {
    errors.push('timeSeries must contain at least 24 data points');
  }

  if (payload.timeSeries && Array.isArray(payload.timeSeries)) {
    payload.timeSeries.forEach((point, idx) => {
      if (!point.timestamp) {
        errors.push(`timeSeries[${idx}]: timestamp is required`);
      }
      if (typeof point.value !== 'number' || point.value < 0) {
        errors.push(`timeSeries[${idx}]: value must be a non-negative number`);
      }
    });
  }

  if (payload.windowSize !== undefined) {
    if (typeof payload.windowSize !== 'number' || payload.windowSize < 10 || payload.windowSize > 500) {
      errors.push('windowSize must be a number between 10 and 500');
    }
  }

  if (payload.thresholdMultiplier !== undefined) {
    if (typeof payload.thresholdMultiplier !== 'number' || payload.thresholdMultiplier < 1 || payload.thresholdMultiplier > 10) {
      errors.push('thresholdMultiplier must be a number between 1 and 10');
    }
  }

  if (payload.minEventDuration !== undefined) {
    if (typeof payload.minEventDuration !== 'number' || payload.minEventDuration < 1 || payload.minEventDuration > 200) {
      errors.push('minEventDuration must be a number between 1 and 200');
    }
  }

  return errors;
}
