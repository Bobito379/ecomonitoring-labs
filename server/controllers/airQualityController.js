import AirQuality from '../models/AirQuality.js';

export const createAirQuality = async (req, res) => {
  try {
    const { station_name, city_name, pm25, pm10, no2, measurement_time } = req.body;

    if (!station_name || !city_name || pm25 === undefined || pm10 === undefined || no2 === undefined || !measurement_time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const newAirQuality = new AirQuality({
      station_name,
      city_name,
      pm25,
      pm10,
      no2,
      measurement_time
    });

    await newAirQuality.save();

    res.status(201).json({
      success: true,
      data: newAirQuality
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getAllAirQuality = async (req, res) => {
  try {
    const data = await AirQuality.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getAirQualityById = async (req, res) => {
  try {
    const { id } = req.params;

    const airQuality = await AirQuality.findById(id);

    if (!airQuality) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: airQuality
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateAirQuality = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAirQuality = await AirQuality.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAirQuality) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: updatedAirQuality
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteAirQuality = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAirQuality = await AirQuality.findByIdAndDelete(id);

    if (!deletedAirQuality) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      message: 'Record deleted successfully',
      data: deletedAirQuality
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
