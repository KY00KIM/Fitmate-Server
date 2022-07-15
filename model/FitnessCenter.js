const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;

/**
 * @swagger
 * components:
 *  schemas:
 *    fitnessCenter:
 *      type: object
 *      properties:
 *        center_name: 
 *          type: string
 *        center_address: 
 *          type: string
 *        center_img: 
 *          type: array
 *          items: 
 *            type: string
 *            format: URI
 *        center_location:  
 *          type: string
 *          format: ObjectId
 *          description: refernces Location ID
 *        fitness_longitude:
 *          type: number
 *          format: degree
 *        fitness_latitude: 
 *          type: number
 *          format: degree
 *        createdAt:
 *          type: string
 *          format : date
 *        updatedAt:
 *          type: string
 *          format : date
  */


const fitnessCenterSchema = mongoose.Schema({
  center_name: {
    type: String,
    required: true,
  },
  center_address: String,
  center_img: [{
    type: String,
  }],
  center_location: {
    type: ObjectId,
    ref: 'Location',
    required: true
  },
  fitness_longitude: {
    type: Double
  },
  fitness_latitude: {
    type: Double
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const FitnessCenter = mongoose.model('FitnessCenter', fitnessCenterSchema);

module.exports = { FitnessCenter };