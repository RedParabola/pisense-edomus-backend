const mongoose = require('mongoose'),
      THINGS = require('../constants/thing.constants.js');

const ThingSchema = mongoose.Schema({
  id:             { type: String,
                    required: true,
                    unique: true },
  customName:     { type: String,
                    required: true },
  type:           { type: String,
                    required: true,
                    enum: THINGS.TYPE_ENUM },
  model:          { type: String,
                    required: true },
  linkedRoomId:   { type: String },
  flaggedAsMain:  { type: Boolean },
  typeProperties: { type: mongoose.Schema.Types.Mixed,
                    required: true },
});

module.exports = mongoose.model('Thing', ThingSchema);