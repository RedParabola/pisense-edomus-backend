const thingHelper = require('../helpers/thing.helper.js'),
      shellScriptService = require('../providers/scripts/shell.service.js'),
      mqttService = require('../providers/mqtt/mqtt.service.js'),
      Thing = require('../models/thing.model.js'),
      Room = require('../models/room.model.js');

//POST '/' - Link a thing to a room.
const linkRoom = function (req, res) {
  const {thingId, thingModel, roomId, boardModelId, boardPin} = req.body;
  const reject = function(err) {
    console.log(err);
    res.status(500).send(err);
  }
  // Call to compile the needed scripts and upload them to the board
  shellScriptService.compileAndUploadToBoard(thingId, thingModel, boardModelId, boardPin, function (err) {
    if (err) {
      reject(err);
    } else {
      // If all that worked, then finish this
      Thing.findOneAndUpdate({ id: thingId }, { $set: { linkedRoomId: roomId } }, function (err, thing) {
        if (err) {
          console.log('FAILED POST linkRoom Thing.update');
          reject(err.message);
        } else {
          const subscriptionData = thingHelper.generateSubscriptionData(thing);
          mqttService.addSubscription(
            subscriptionData.answer.thingId,
            subscriptionData.answer.endpoint,
            subscriptionData.answer.callback
          );
          mqttService.addSubscription(
            subscriptionData.status.thingId,
            subscriptionData.status.endpoint,
            subscriptionData.status.callback
          );
          Room.update({ id: roomId }, { $push: { things: thingId } }, function (err, room) {
            if (err) {
              console.log('FAILED POST linkRoom Room.update');
              reject(err.message);
            } else {
              console.log('SUCCESS POST linkRoom thing ' + thingId + ' to room ' + roomId);
              res.status(200).jsonp({ message: 'Thing ' + thingId + ' sucessfully linked to room ' + roomId});
            }
          });
        }
      });
    }
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
              mqttService.removeSubscription(thingId, 'status');
              mqttService.removeSubscription(thingId, 'answer');
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

  (!oldMainThingId) ? callbackFlagMethod() :
    Thing.update({ id: oldMainThingId }, { $set: { flaggedAsMain: false } }, callbackFlagMethod);
}


/***********************************************************************************************/
/***********************************************************************************************/


/***********************************************************************************************/
/***********************************************************************************************/

const linkController = {
  linkRoom,
  unlinkRoom,
  flagAsMainThing
};

module.exports = linkController;