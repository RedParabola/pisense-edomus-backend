const Room = require('../models/room.model.js');

//GET - Return all rooms in the DB
const getAllRooms = function (req, res) {
  Room.find({}, '-_id -__v', function (err, rooms) {
    if (err) {
      console.log('FAILED GET getAllRooms');
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS GET getAllRooms');
      res.status(200).jsonp(rooms);
    }
  });
};

//GET - Return a room with specified ID
const getRoomById = function (req, res) {
  Room.findOne({ id: req.params.id }, function (err, room) {
    if (err) {
      console.log('FAILED GET getRoomById ' + req.params.id);
      res.status(500).send(err.message);
    } else {
      const object = room.toObject();
      delete object._id;
      delete object.__v;
      console.log('SUCCESS GET getRoomById ' + req.params.id);
      res.status(200).jsonp(object);
    }
  });
};

//POST - Return a room with specified ID
const addRoom = function (req, res) {
  const generatedId = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  let newRoom = new Room({
    id: 'room' + generatedId,
    customName: req.body.customName,
    type: req.body.type,
    things: [],
    mainThingsId: { none: '' }
  });
  newRoom.save(function (err, room) {
    if (err) {
      console.log('FAILED POST addRoom ' + req.body.customName);
      res.status(500).send(err.message);
    } else {
      const object = room.toObject();
      delete object._id;
      delete object.__v;
      console.log('SUCCESS POST addRoom ' + req.body.customName);
      res.status(200).jsonp(object);
    }
  });
};

//DELETE - Delete a room with specified ID
const deleteRoom = function (req, res) {
  Room.deleteOne({ id: req.params.id }, function (err) {
    if (err) {
      console.log('FAILED DELETE deleteRoom ' + req.params.id);
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS DELETE deleteRoom ' + req.params.id);
      res.status(200).jsonp({ message: 'Room ' + req.params.id + ' deleted sucessfully' });
    }
  });
};

//PUT '/rename/:id' - Rename a room with specified ID
const renameRoom = function (req, res) {
  Room.update({ id: req.params.id }, { $set: { customName: req.body.newName } }, function (err) {
    if (err) {
      console.log('FAILED PUT renameRoom ' + req.params.id);
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS PUT renameRoom ' + req.params.id);
      res.status(200).jsonp({ message: 'Room ' + req.params.id + 'renamed sucessfully' });
    }
  })
};

const roomController = {
  getAllRooms,
  getRoomById,
  addRoom,
  deleteRoom,
  renameRoom
};

module.exports = roomController;