const Board = require('../models/board.model.js'),
  usbService = require('../providers/usb/usb.service.js');

//GET - Return all boards in the DB
const getAllBoards = function (req, res) {
  Board.find({}, '-_id -__v', function (err, boards) {
    if (err) {
      console.log('FAILED GET getAllBoards');
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS GET getAllBoards');
      res.status(200).jsonp(boards);
    }
  });
};

//GET - Return the currently USB connected board
const getUSBConnectedBoard = function (req, res) {
  let board = usbService.getCurrentConnectedUSB();
  if (board) {
    board = new Board({id: 'connectedBoard', model: 'model1', serialNumber:(board && board.serialNumber) || 'connectedSN'});
    console.log('SUCCESS GET getUSBConnectedBoard');
    res.status(200).jsonp(board);
  } else {
    console.log('FAILED GET getUSBConnectedBoard');
    res.status(500).send('No device currently connected through USB port.');
  }
};

const boardController = {
  getAllBoards,
  getUSBConnectedBoard,
};

module.exports = boardController;