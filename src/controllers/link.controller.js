const mongoose = require('mongoose'),
      Thing = require('../models/thing.model.js'),
      Room = require('../models/room.model.js');

//POST '/' - Link a thing to a room.
const linkRoom = function (req, res) {
  const thingId = req.body.thingId;
  const roomId = req.body.roomId;
  let session = null;
  mongoose.startSession()
    .then(_session => {
      session = _session;
      session.startTransaction();
      return Thing.update({ id: thingId }, { $set: { linkedRoomId: roomId } }).session(session);
    })
    .then(() => Room.update({ id: roomId }, { $push: { things: thingId } }).session(session))
    .then(() => session.commitTransaction())
    .then(() => {
      console.log('SUCCESS PUT TRANSACTION linkRoom thing ' + thingId + ' to room ' + roomId);
      res.status(200).jsonp({ message: 'Thing ' + thingId + ' sucessfully linked to room ' + roomId });
    })
    .catch((error) => {
      console.log('FAILED Transaction at linkRoom');
      console.log(error);
      session.abortTransaction();
      res.status(500).send(error.message);
    });
};

//DELETE '/' - Unlink a thing from its room.
//           - Update the given room accordingly.
const unlinkRoom = function (req, res) {
  const thingId = req.body.thingId;
  let roomId = req.body.roomId;
  let thingType = null;
  let setter = {};
  let session = null;
  mongoose.startSession()
    .then(_session => {
      session = _session;
      session.startTransaction();
      return Room.findOne({ id: roomId }).session(session);
    })
    .then((room) => {
      const otherThings = room.things.filter((thing) => { return thing !== thingId });
      setter.things = otherThings;
      // TODO: remove it from main type too if necessary
      thingType = Object.keys(room.mainThingsId).find(type => {
        return room.mainThingsId[type] === thingId;
      });
      if (thingType) {
        setter['mainThingsId.' + thingType] = undefined;
      }
      return Room.update({ id: roomId }, { $set: setter }).session(session);
    })
    .then(() => {
      return Thing.update({ id: thingId }, { $set: { linkedRoomId: undefined, flaggedAsMain: false } }).session(session);
    })
    .then(() => session.commitTransaction())
    .then(() => {
      console.log('SUCCESS DELETE TRANSACTION unlinkRoom ' + thingId);
      res.status(200).jsonp({ message: 'Thing ' + thingId + ' unlinked sucessfully from room ' + roomId });
    })
    .catch((error) => {
      console.log('FAILED Transaction at unlinkRoom');
      console.log(error);
      session.abortTransaction();
      res.status(500).send(error.message);
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
  let session = null;
  mongoose.startSession()
    .then(_session => {
      session = _session;
      session.startTransaction();
      return (!oldMainThingId) ? Promise.resolve() : Thing.update({ id: oldMainThingId }, { $set: { flaggedAsMain: false } }).session(session);
    })
    .then(() => Room.update({ id: roomId }, { $set: setter }).session(session))
    .then(() => Thing.update({ id: thingId }, { $set: { flaggedAsMain: true } }).session(session))
    .then(() => session.commitTransaction())
    .then(() => {
      console.log('SUCCESS PUT TRANSACTION flagged thing ' + thingId + ' as main ' + thingType + ' of room ' + roomId);
      res.status(200).jsonp({ message: 'Thing ' + thingId + ' sucessfully flagged as main ' + thingType + ' of room ' + roomId });
    })
    .catch((error) => {
      console.log('FAILED Transaction at flagAsMainThing');
      console.log(error);
      session.abortTransaction();
      res.status(500).send(error.message);
    });

}

const linkController = {
  linkRoom,
  unlinkRoom,
  flagAsMainThing
};

module.exports = linkController;