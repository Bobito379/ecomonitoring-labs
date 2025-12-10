import connectDB from './config/database.js';
import AnomalyDetection from './models/AnomalyDetection.js';

function generateTimeSeries(pollutant, hours = 48) {
  const timeSeries = [];
  const now = new Date();
  
  const ranges = {
    'PM2.5': { base: 25, variation: 15, spikes: [80, 120, 150] },
    'NO2': { base: 40, variation: 20, spikes: [150, 250, 350] },
    'SO2': { base: 15, variation: 10, spikes: [80, 120, 180] },
    'O3': { base: 60, variation: 25, spikes: [120, 180, 230] }
  };

  const config = ranges[pollutant];
  const pointsPerHour = 4;
  const totalPoints = hours * pointsPerHour;
  
  const anomalyPositions = [
    Math.floor(totalPoints * 0.25),
    Math.floor(totalPoints * 0.55),
    Math.floor(totalPoints * 0.78)
  ];

  for (let i = 0; i < totalPoints; i++) {
    const minutesAgo = (totalPoints - i) * (60 / pointsPerHour);
    const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000);
    
    let value;
    
    if (anomalyPositions.some(pos => Math.abs(i - pos) < 8)) {
      const spikeIndex = Math.floor(Math.random() * config.spikes.length);
      value = config.spikes[spikeIndex] + (Math.random() - 0.5) * 20;
    } else {
      const hourOfDay = timestamp.getHours();
      const dailyCycle = Math.sin((hourOfDay - 6) * Math.PI / 12) * config.variation * 0.3;
      const noise = (Math.random() - 0.5) * config.variation;
      value = config.base + dailyCycle + noise;
    }
    
    value = Math.max(2, value);
    
    timeSeries.push({
      timestamp,
      value: parseFloat(value.toFixed(2))
    });
  }

  return timeSeries.sort((a, b) => a.timestamp - b.timestamp);
}

const seedAnomalyData = async () => {
  try {
    await connectDB();

    await AnomalyDetection.deleteMany({});

    const pollutants = ['PM2.5', 'NO2', 'SO2', 'O3'];
    const stations = ['Station-Kyiv-Center', 'Station-Lviv-North', 'Station-Kharkiv-East'];

    const records = [];

    for (const pollutant of pollutants) {
      for (const stationId of stations) {
        const timeSeries = generateTimeSeries(pollutant, 48);
        
        records.push({
          stationId,
          pollutant,
          timeSeries: timeSeries.map(point => ({
            timestamp: point.timestamp,
            value: point.value
          })),
          analysisParams: {
            windowSize: 120,
            thresholdMultiplier: 3,
            minEventDuration: 10
          },
          detectedAnomalies: [],
          p95: 0
        });
      }
    }

    await AnomalyDetection.insertMany(records);
    console.log(`✅ Added ${records.length} anomaly detection records`);
    console.log(`   Pollutants: ${pollutants.join(', ')}`);
    console.log(`   Stations: ${stations.join(', ')}`);
    console.log(`   Each record contains 48 hours of time series data`);

    console.log('\n📊 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAnomalyData();
