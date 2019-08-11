const mongoose = require('mongoose');

const BoardSchema = mongoose.Schema({
  id:             { type: String,
                    required: true,
                    unique: true },
  model:          { type: String,
                    required: true },
  serialNumber:   { type: String,
                    required: true },
});

module.exports = mongoose.model('Board', BoardSchema);