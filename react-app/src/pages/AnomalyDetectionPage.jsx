import React, { useState } from 'react';
import PrimaryButton from '../components/ui/PrimaryButton/PrimaryButton';
import TimeSeriesChart from '../components/TimeSeriesChart/TimeSeriesChart';
import './AnomalyDetectionPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function AnomalyDetectionPage() {
  const [stationId, setStationId] = useState('');
  const [pollutant, setPollutant] = useState('PM2.5');
  const [windowSize, setWindowSize] = useState(120);
  const [thresholdMultiplier, setThresholdMultiplier] = useState(3);
  const [minEventDuration, setMinEventDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generateSyntheticData = () => {
    const stations = ['Station-Kyiv-Center', 'Station-Lviv-North', 'Station-Kharkiv-East'];
    const randomStation = stations[Math.floor(Math.random() * stations.length)];
    
    setStationId(randomStation);
    setPollutant(['PM2.5', 'NO2', 'SO2', 'O3'][Math.floor(Math.random() * 4)]);
    setWindowSize(Math.floor(Math.random() * (240 - 60 + 1)) + 60);
    setThresholdMultiplier(Math.floor(Math.random() * (5 - 2 + 1)) + 2);
    setMinEventDuration(Math.floor(Math.random() * (30 - 5 + 1)) + 5);
  };

  const generateTimeSeries = (pollutantType, requiredWindowSize) => {
    const timeSeries = [];
    const now = new Date();
    
    const ranges = {
      'PM2.5': { base: 25, variation: 15, spikes: [80, 120, 150] },
      'NO2': { base: 40, variation: 20, spikes: [150, 250, 350] },
      'SO2': { base: 15, variation: 10, spikes: [80, 120, 180] },
      'O3': { base: 60, variation: 25, spikes: [120, 180, 230] }
    };

    const config = ranges[pollutantType];
    const pointsPerHour = 4;
    const totalPoints = Math.max(requiredWindowSize * 2, 200);
    
    const anomalyPositions = [
      Math.floor(totalPoints * 0.3),
      Math.floor(totalPoints * 0.6)
    ];

    for (let i = 0; i < totalPoints; i++) {
      const minutesAgo = (totalPoints - i) * (60 / pointsPerHour);
      const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000);
      
      let value;
      
      if (anomalyPositions.some(pos => Math.abs(i - pos) < 6)) {
        const spikeIndex = Math.floor(Math.random() * config.spikes.length);
        value = config.spikes[spikeIndex] + (Math.random() - 0.5) * 15;
      } else {
        const hourOfDay = timestamp.getHours();
        const dailyCycle = Math.sin((hourOfDay - 6) * Math.PI / 12) * config.variation * 0.3;
        const noise = (Math.random() - 0.5) * config.variation;
        value = config.base + dailyCycle + noise;
      }
      
      value = Math.max(2, value);
      
      timeSeries.push({
        timestamp: timestamp.toISOString(),
        value: parseFloat(value.toFixed(2))
      });
    }

    return timeSeries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const handleDetect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const timeSeries = generateTimeSeries(pollutant, windowSize);

      const response = await fetch(`${API_BASE_URL}/anomaly-detection/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stationId,
          pollutant,
          timeSeries,
          windowSize,
          thresholdMultiplier,
          minEventDuration
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anomaly-page">
      <div className="anomaly-header">
        <h2>Виявлення аномальних викидів (НС)</h2>
        <p>Варіант 5: Аналіз часових рядів забруднювачів</p>
      </div>

      <div className="anomaly-content">
        <div className="anomaly-form-section">
          <form onSubmit={handleDetect} className="anomaly-form">
            <div className="form-group">
              <label>ID станції</label>
              <input
                type="text"
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                placeholder="Station-Kyiv-Center"
                required
              />
            </div>

            <div className="form-group">
              <label>Забруднювач</label>
              <select value={pollutant} onChange={(e) => setPollutant(e.target.value)}>
                <option value="PM2.5">PM2.5</option>
                <option value="NO2">NO₂</option>
                <option value="SO2">SO₂</option>
                <option value="O3">O₃</option>
              </select>
            </div>

            <div className="form-group">
              <label>Розмір вікна (точок)</label>
              <input
                type="number"
                value={windowSize}
                onChange={(e) => setWindowSize(Number(e.target.value))}
                min="10"
                max="500"
              />
              <small>Кількість точок для розрахунку ковзного середнього</small>
            </div>

            <div className="form-group">
              <label>Множник порогу (σ)</label>
              <input
                type="number"
                value={thresholdMultiplier}
                onChange={(e) => setThresholdMultiplier(Number(e.target.value))}
                min="1"
                max="10"
                step="0.5"
              />
              <small>Поріг: μ + {thresholdMultiplier}σ</small>
            </div>

            <div className="form-group">
              <label>Мінімальна тривалість події (хв)</label>
              <input
                type="number"
                value={minEventDuration}
                onChange={(e) => setMinEventDuration(Number(e.target.value))}
                min="1"
                max="200"
              />
            </div>

            <div className="form-buttons">
              <PrimaryButton type="button" onClick={generateSyntheticData}>
                🎲 Згенерувати дані
              </PrimaryButton>
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? 'Аналіз...' : '🔍 Виявити аномалії'}
              </PrimaryButton>
            </div>
          </form>
        </div>

        {error && (
          <div className="error-box">
            ❌ Помилка: {error}
          </div>
        )}

        {result && (
          <div className="results-section">
            <TimeSeriesChart 
              data={result.processedSeries} 
              pollutant={pollutant}
            />

            <div className="summary-cards">
              <div className="summary-card">
                <h4>Всього точок</h4>
                <div className="card-value">{result.summary.totalPoints}</div>
              </div>
              <div className="summary-card">
                <h4>Аномальних точок</h4>
                <div className="card-value anomaly">{result.summary.anomalyPoints}</div>
              </div>
              <div className="summary-card">
                <h4>Подій НС</h4>
                <div className="card-value events">{result.summary.anomalyEvents}</div>
              </div>
              <div className="summary-card">
                <h4>P95 ({pollutant})</h4>
                <div className="card-value">{result.p95} мкг/м³</div>
              </div>
            </div>

            {result.detectedAnomalies.length > 0 && (
              <div className="events-list">
                <h3>🚨 Виявлені аномальні події</h3>
                {result.detectedAnomalies.map((event, idx) => (
                  <div key={idx} className="event-card">
                    <div className="event-header">
                      <span className="event-badge">Подія #{idx + 1}</span>
                      <span className="event-duration">{event.duration} хв</span>
                    </div>
                    <div className="event-details">
                      <div className="event-detail">
                        <span className="label">Початок:</span>
                        <span>{new Date(event.startTime).toLocaleString('uk-UA')}</span>
                      </div>
                      <div className="event-detail">
                        <span className="label">Кінець:</span>
                        <span>{new Date(event.endTime).toLocaleString('uk-UA')}</span>
                      </div>
                      <div className="event-detail">
                        <span className="label">Макс. значення:</span>
                        <span className="highlight">{event.maxValue} мкг/м³</span>
                      </div>
                      <div className="event-detail">
                        <span className="label">Серед. значення:</span>
                        <span>{event.avgValue} мкг/м³</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.detectedAnomalies.length === 0 && (
              <div className="no-events">
                ✅ Аномальних подій не виявлено
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnomalyDetectionPage;
