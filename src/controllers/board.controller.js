const Board = require('../models/board.model.js');

//GET - Return all boards in the DB
const getAllBoards = function (req, res) {
  Room.find({}, '-_id -__v', function (err, rooms) {
    if (err) {
      console.log('FAILED GET getAllBoards');
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS GET getAllBoards');
      res.status(200).jsonp(rooms);
    }
  });
};

//GET - Return the currently USB connected board
const getUSBConnectedBoard = function (req, res) {
  console.log('SUCCESS GET getUSBConnectedBoard');
  board = new Board({id: 'connectedBoard', model: 'model1', serialNumber: 'connectedSN'});
  res.status(200).jsonp(board);
};

const boardController = {
  getAllBoards,
  getUSBConnectedBoard,
};

module.exports = boardController;