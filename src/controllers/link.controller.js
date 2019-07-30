const boardHelper = require('../helpers/board.helper.js'),
      scriptService = require('../providers/scripts/script.service.js'),
      Thing = require('../models/thing.model.js'),
      Board = require('../models/board.model.js'),
      Room = require('../models/room.model.js');

//POST '/' - Link a thing to a room.
const linkRoom = function (req, res) {
  const {thingId, roomId, boardSN, boardPin} = req.body;
  const reject = function(err) {
    console.log(err);
    res.status(500).send(err.message);
  }

  _prepareBoardInfo(boardSN, boardPin, thingId, function (board) {
    // Call to compose the scripts needed for the board
    scriptService.composeBoardScripts(board, function (err, scriptsRef) {
      if (err) {
        reject(err);
      } else {
        // Call to flash the composed scripts in the board
        scriptService.flashBoardScripts(scriptsRef, function (err, success) {
          if (err) {
            reject(err);
          } else {
            // If all that worked, then finish this
            Thing.update({ id: thingId }, { $set: { linkedRoomId: roomId } }, function (err, thing) {
              if (err) {
                console.log('FAILED POST linkRoom Thing.update');
                reject(err);
              } else {
                Room.update({ id: roomId }, { $push: { things: thingId } }, function (err, room) {
                  if (err) {
                    console.log('FAILED POST linkRoom Room.update');
                    reject(err.message);
                  } else {
                    board.save(function (err, board) {
                      if (err) {
                        reject('FAILED POST linkRoom board.save ' + board.serialNumber);
                      } else {
                        console.log('SUCCESS POST linkRoom thing ' + thingId + ' to room ' + roomId + ' through board ' + board.serialNumber);
                        res.status(200).jsonp({ message: 'Thing ' + thingId + ' sucessfully linked to room ' + roomId + ' through board ' + board.serialNumber});
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};

//DELETE '/' - Unlink a thing from its room.
//           - Update the given room accordingly.
const unlinkRoom = function (req, res) {
  const thingId = req.body.thingId;
  let roomId = req.body.roomId;
  let thingType = null;
  let setter = {};
  Room.findOne({ id: roomId }, function (err, room) {
    if (err) {
      console.log('FAILED DELETE unlinkRoom Room.findOne');
      console.log(err);
      res.status(500).send(err.message);
    } else if (room) {
      const otherThings = room.things.filter((thing) => { return thing !== thingId });
      setter.things = otherThings;
      // TODO: remove it from main type too if necessary
      thingType = Object.keys(room.mainThingsId).find(type => {
        return room.mainThingsId[type] === thingId;
      });
      if (thingType) {
        setter['mainThingsId.' + thingType] = undefined;
      }
      Room.update({ id: roomId }, { $set: setter }, function (err, room) {
        if (err) {
          console.log('FAILED DELETE unlinkRoom Room.update');
          console.log(err);
          res.status(500).send(err.message);
        } else {
          Thing.update({ id: thingId }, { $set: { linkedRoomId: undefined, flaggedAsMain: false } }, function (err, room) {
            if (err) {
              console.log('FAILED DELETE unlinkRoom Thing.update');
              console.log(err);
              res.status(500).send(err.message);
            } else {
              console.log('SUCCESS DELETE unlinkRoom ' + thingId);
              res.status(200).jsonp({ message: 'Thing ' + thingId + ' unlinked sucessfully from room ' + roomId });
            }
          });
        }
      });
    }
  });
};

//PUT '/main' - Flag the specified thing as main of its linked room.
//            - Deflag the older thing.
//            - Update the main thing type in the given room.
const flagAsMainThing = function (req, res) {
  const thingId = req.body.thingId;
  const thingType = req.body.thingType;
  const oldMainThingId = req.body.oldMainThingId;
  const roomId = req.body.roomId;
  let setter = {};
  setter['mainThingsId.' + thingType] = thingId;

  const callbackFlagMethod = function (err) {
    if (err) {
      console.log('FAILED PUT flagAsMainThing');
      console.log(err);
      res.status(500).send(err.message);
    } else {
      Room.update({ id: roomId }, { $set: setter }, function (err) {
        if (err) {
          console.log('FAILED PUT flagAsMainThing');
          console.log(err);
          res.status(500).send(err.message);
        } else {
          Thing.update({ id: thingId }, { $set: { flaggedAsMain: true } }, function (err) {
            if (err) {
              console.log('FAILED PUT flagAsMainThing');
              console.log(err);
              res.status(500).send(err.message);
            } else {
              console.log('SUCCESS PUT flagged thing ' + thingId + ' as main ' + thingType + ' of room ' + roomId);
              res.status(200).jsonp({ message: 'Thing ' + thingId + ' sucessfully flagged as main ' + thingType + ' of room ' + roomId });
            }
          });
        }
      });
    }
  };

  (!oldMainThingId) ? callbackFlagMethod() : Thing.update({ id: oldMainThingId }, { $set: { flaggedAsMain: false } }, callbackFlagMethod);
}


/***********************************************************************************************/
/***********************************************************************************************/

  // With boardSN, get the stored board info
  const _prepareBoardInfo = function(boardSN, boardPin, thingId, callback) {
    Board.findOne({ serialNumber: boardSN }, function (err, storedBoard) {
      let board;
      // If already existent, modify locally the board. If none, create a new one.
      if (storedBoard) {
        board = storedBoard;
      } else {
        console.log('PROCESS GET linkRoom _prepareBoardInfo Board.findOne not found');
        board = new Board({
          id: 'random',
          model: 'model1',
          serialNumber: boardSN
        });
      }
      // Modify the board with the new info: add thing to the board in given pin boardPin
      board = boardHelper.addThingToPin(board, boardPin, thingId);
      callback(board);
    });
  }

/***********************************************************************************************/
/***********************************************************************************************/

const linkController = {
  linkRoom,
  unlinkRoom,
  flagAsMainThing
};

module.exports = linkController;