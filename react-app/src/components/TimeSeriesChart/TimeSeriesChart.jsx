import React from 'react';
import './TimeSeriesChart.css';

function TimeSeriesChart({ data, pollutant }) {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.threshold || 0)));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const padding = range * 0.1;

  const chartHeight = 300;
  const chartWidth = 800;

  const normalizeY = (value) => {
    return chartHeight - ((value - minValue + padding) / (range + 2 * padding)) * chartHeight;
  };

  const getX = (index) => {
    return (index / (data.length - 1)) * chartWidth;
  };

  const valuePath = data
    .map((point, index) => {
      const x = getX(index);
      const y = normalizeY(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const thresholdPath = data
    .map((point, index) => {
      const x = getX(index);
      const y = normalizeY(point.threshold);
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const avgPath = data
    .map((point, index) => {
      const x = getX(index);
      const y = normalizeY(point.movingAvg);
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const anomalyPoints = data
    .map((point, index) => ({
      ...point,
      index,
      x: getX(index),
      y: normalizeY(point.value)
    }))
    .filter(point => point.isAnomaly);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  const xAxisLabels = [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor(3 * data.length / 4), data.length - 1];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>📊 Часовий ряд: {pollutant}</h3>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#3498db' }}></span>
            Виміряне значення
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#2ecc71' }}></span>
            Ковзне середнє (μ)
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#e74c3c' }}></span>
            Поріг (μ + 3σ)
          </span>
          <span className="legend-item">
            <span className="legend-dot anomaly"></span>
            Аномалія
          </span>
        </div>
      </div>
      
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="chart-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3498db" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3498db" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path
          d={`${valuePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
          fill="url(#areaGradient)"
        />

        <path
          d={avgPath}
          fill="none"
          stroke="#2ecc71"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        <path
          d={thresholdPath}
          fill="none"
          stroke="#e74c3c"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        <path
          d={valuePath}
          fill="none"
          stroke="#3498db"
          strokeWidth="3"
        />

        {anomalyPoints.map((point, idx) => (
          <g key={idx}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#e74c3c"
              stroke="white"
              strokeWidth="2"
            />
            <title>
              {formatTime(point.timestamp)}: {point.value} мкг/м³ (Аномалія)
            </title>
          </g>
        ))}

        {xAxisLabels.map((dataIndex) => (
          <g key={dataIndex}>
            <line
              x1={getX(dataIndex)}
              y1={chartHeight - 20}
              x2={getX(dataIndex)}
              y2={chartHeight}
              stroke="#bdc3c7"
              strokeWidth="1"
            />
            <text
              x={getX(dataIndex)}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="10"
              fill="#7f8c8d"
            >
              {formatTime(data[dataIndex].timestamp)}
            </text>
          </g>
        ))}
      </svg>

      <div className="chart-info">
        <div className="info-item">
          <span className="info-label">Мін:</span>
          <span className="info-value">{minValue.toFixed(2)} мкг/м³</span>
        </div>
        <div className="info-item">
          <span className="info-label">Макс:</span>
          <span className="info-value">{maxValue.toFixed(2)} мкг/м³</span>
        </div>
        <div className="info-item">
          <span className="info-label">Аномалій:</span>
          <span className="info-value anomaly-count">{anomalyPoints.length}</span>
        </div>
      </div>
    </div>
  );
}

export default TimeSeriesChart;
