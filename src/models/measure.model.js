const mongoose = require('mongoose'),
      MEASURES = require('../constants/measure.constants.js');
  
const MeasureSchema = mongoose.Schema({
  roomId:  { type: String },
  thingId: { type: String },
  date:    { type: Date },
  type:    {
              type: String,
              enum: MEASURES.MAGNITUDE_ENUM
            },
  data:    mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Measure', MeasureSchema);