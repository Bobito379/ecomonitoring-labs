import WaterQuality from '../models/WaterQuality.js';

export const createWaterQuality = async (req, res) => {
  try {
    const { station_name, location, ph_level, dissolved_oxygen, temperature, measurement_time } = req.body;

    if (!station_name || !location || ph_level === undefined || dissolved_oxygen === undefined || temperature === undefined || !measurement_time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const newWaterQuality = new WaterQuality({
      station_name,
      location,
      ph_level,
      dissolved_oxygen,
      temperature,
      measurement_time
    });

    await newWaterQuality.save();

    res.status(201).json({
      success: true,
      data: newWaterQuality
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getAllWaterQuality = async (req, res) => {
  try {
    const data = await WaterQuality.find().sort({ createdAt: -1 });

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

export const getWaterQualityById = async (req, res) => {
  try {
    const { id } = req.params;

    const waterQuality = await WaterQuality.findById(id);

    if (!waterQuality) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: waterQuality
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateWaterQuality = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedWaterQuality = await WaterQuality.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedWaterQuality) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: updatedWaterQuality
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteWaterQuality = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWaterQuality = await WaterQuality.findByIdAndDelete(id);

    if (!deletedWaterQuality) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      message: 'Record deleted successfully',
      data: deletedWaterQuality
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
