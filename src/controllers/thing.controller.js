const Thing = require('../models/thing.model.js'),
  thingHelper = require('../helpers/thing.helper.js');

const initializeThings = function () {
  // TODO. Still nothing needed.
}

const getThingsByRoom = function (linkedRoomId, successCallback) {
  Thing.find({ linkedRoomId }, function (err, things) {
    err ? successCallback([]) : successCallback(things);
  });
}

const thingDaemon = function () {
  // TODO. Still nothing needed.
}

//GET '/' - Return all things in the DB
const getAllThings = function (req, res) {
  Thing.find({}, '-_id, -__v', function (err, things) {
    if (err) {
      console.log('FAILED GET getAllThings');
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS GET getAllThings');
      res.status(200).jsonp(things);
    }
  });
};

//POST '/' - Insert a new thing in the DB
const addThing = function (req, res) {
  const generatedId = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  const thingProperties = thingHelper.getModelStructure(req.body.type, req.body.model);
  let thing = new Thing({
    id: 'thing' + generatedId,
    customName: req.body.customName + ' ' + generatedId,
    type: req.body.type,
    model: req.body.model,
    typeProperties: thingProperties
  });
  thing.save(function (err, thing) {
    if (err) {
      console.log('FAILED POST addThing ' + thing.id);
      res.status(500).send(err.message);
    } else {
      const object = thing.toObject();
      delete object._id;
      delete object.__v;
      console.log('SUCCESS POST addThing ' + thing.id);
      res.status(200).jsonp(object);
    }
  });
};

//GET '/:id' - Return a thing with specified ID
const getThingById = function (req, res) {
  const thingId = req.params.id;
  Thing.findOne({ id: thingId }, '-_id, -__v', function (err, thing) {
    if (err) {
      console.log('FAILED GET getThingById ' + thingId);
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS GET getThingById ' + thingId);
      res.status(200).jsonp(thing);
    }
  });
};

//DELETE '/:id' - Delete a thing with specified ID
const deleteThing = function (req, res) {
  const thingId = req.params.id;
  Thing.deleteOne({ id: thingId }, function (err) {
    if (err) {
      console.log('FAILED DELETE deleteThing ' + thingId);
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS DELETE deleteThing ' + thingId);
      res.status(200).jsonp({message: 'Thing ' + thingId + ' deleted sucessfully'});
    }
  });
};

//PUT '/rename/:id' - Rename a thing with specified ID
const renameThing = function (req, res) {
  const thingId = req.params.id;
  Thing.update({ id: thingId }, { $set: { customName: req.body.newName } }, function (err) {
    if (err) {
      console.log('FAILED PUT renameThing ' + thingId);
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS PUT renameThing ' + thingId);
      res.status(200).jsonp({message: 'Thing ' + thingId + ' renamed sucessfully'});
    }
  })
};

//PUT '/command/:id' - Process a command for a thing with specified ID
const processCommand = function (req, res) {
  const thingId = req.params.id;
  const commandRequest = req.body;

  // Identify the thing type
  Thing.findOne({ id: thingId }, '-_id, -__v', function (err, thing) {
    if (err) {
      console.log('FAILED PUT processCommand Thing.findOne ' + thingId);
      res.status(500).send(err.message);
    } else {
      // Launch action to thing
      const thingControllerInstance = thingHelper.getThingControllerInstance(thing.type);
      thingControllerInstance && thingControllerInstance.processRequest(thing, commandRequest, function () {
        // Depending on result, store the change
        // Depending on result, answer the request
        let commandAnswer = {
          commandRequest: req.body,
          answer: 'Command ' + thingId + ' processed sucessfully'
        }
        res.status(200).jsonp(commandAnswer);
      }, function () {
        console.log('FAILED PUT processCommand processRequest ' + thingId);
        res.status(500).send('FAILED PUT processCommand processRequest ' + thingId);
      });
    }
  });
  

};

const thingController = {
  initializeThings,
  getThingsByRoom,
  thingDaemon,
  addThing,
  getAllThings,
  getThingById,
  deleteThing,
  renameThing,
  processCommand
};

module.exports = thingController;