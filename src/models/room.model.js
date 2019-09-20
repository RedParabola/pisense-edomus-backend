const mongoose = require('mongoose'),
      ROOMS = require('../constants/room.constants.js');
  
const RoomSchema = mongoose.Schema({
  id:             { type: String,
                    required: true,
                    unique: true },
  customName:     { type: String,
                    required: true },
  type:           { type: String,
                    required: true,
                    enum: ROOMS.TYPE_ENUM },
  things:         { type: [String],
                    required: true },
  mainThingsId:   { type: mongoose.Schema.Types.Mixed,
                    required: true },
  sensorMeasures: { type: mongoose.Schema.Types.Mixed}
});

module.exports = mongoose.model('Room', RoomSchema);