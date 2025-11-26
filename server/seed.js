import connectDB from './config/database.js';
import AirQuality from './models/AirQuality.js';
import WaterQuality from './models/WaterQuality.js';

const seedDatabase = async () => {
  try {
    await connectDB();

    await AirQuality.deleteMany({});
    await WaterQuality.deleteMany({});

    const airQualityData = [
      { city: 'Kyiv', pm25: 25.3, pm10: 35.2, temperature: 18.5 },
      { city: 'Lviv', pm25: 30.5, pm10: 42.3, temperature: 16.8 },
      { city: 'Kharkiv', pm25: 22.5, pm10: 32.5, temperature: 19.5 },
      { city: 'Odesa', pm25: 19.5, pm10: 28.5, temperature: 20.5 },
      { city: 'Dnipro', pm25: 26.5, pm10: 38.5, temperature: 17.8 }
    ];

    const waterQualityData = [
      { location: 'Dnieper River, Kyiv', phLevel: 7.2, dissolvedOxygen: 8.5, turbidity: 2.5 },
      { location: 'Piskovy River, Lviv', phLevel: 6.8, dissolvedOxygen: 9.2, turbidity: 2.0 },
      { location: 'Uday River, Kharkiv', phLevel: 7.1, dissolvedOxygen: 8.8, turbidity: 2.3 },
      { location: 'Black Sea, Odesa', phLevel: 8.2, dissolvedOxygen: 9.8, turbidity: 1.8 },
      { location: 'Dnieper River, Dnipro', phLevel: 7.0, dissolvedOxygen: 8.3, turbidity: 2.8 }
    ];

    await AirQuality.insertMany(airQualityData);
    console.log('✅ Added 5 air quality records');

    await WaterQuality.insertMany(waterQualityData);
    console.log('✅ Added 5 water quality records');

    console.log('\n📊 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
