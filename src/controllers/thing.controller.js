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
  Thing.findOne({ id: req.params.id }, '-_id, -__v', function (err, thing) {
    if (err) {
      console.log('FAILED GET getThingById ' + req.params.id);
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS GET getThingById ' + req.params.id);
      res.status(200).jsonp(thing);
    }
  });
};

//DELETE '/:id' - Delete a thing with specified ID
const deleteThing = function (req, res) {
  Thing.deleteOne({ id: req.params.id }, function (err) {
    if (err) {
      console.log('FAILED DELETE deleteThing ' + req.params.id);
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS DELETE deleteThing ' + req.params.id);
      res.status(200).jsonp({message: 'Thing ' + req.params.id + ' deleted sucessfully'});
    }
  });
};

//PUT '/rename/:id' - Rename a thing with specified ID
const renameThing = function (req, res) {
  Thing.update({ id: req.params.id }, { $set: { customName: req.body.newName } }, function (err) {
    if (err) {
      console.log('FAILED PUT renameThing ' + req.params.id);
      res.status(500).send(err.message);
    } else {
      console.log('SUCCESS PUT renameThing ' + req.params.id);
      res.status(200).jsonp({message: 'Thing ' + req.params.id + ' renamed sucessfully'});
    }
  })
};

//PUT '/command/:id' - Process a command for a thing with specified ID
const processCommand = function (req, res) {
  const thingId = req.params.id;
  const commandString = req.body.command;
  const requestedValue = req.body.value;

  Thing.findOne({ id: thingId }, '-_id, -__v', function (err, thing) {
    if (err) {
      console.log('FAILED PUT processCommand Thing.findOne ' + req.params.id);
      res.status(500).send(err.message);
    } else {
      const thingControllerInstance = thingHelper.getThingControllerInstance(thing.type);
      thingControllerInstance && thingControllerInstance.processRequest(commandString, requestedValue);
      console.log('SUCCESS PUT processCommand ' + req.params.id);
      res.status(200).jsonp(thing);
    }
  });

  // Identify what to do
  const action = thingHelper.translateCommand(commandString, requestedValue);
  // Launch action to thing
  
  // Depending on result, store the change
  // Depending on result, answer the request
  let commandAnswer = {
    commandRequest: req.body,
    answer: 'Command ' + req.params.id + ' processed sucessfully'
  }
  res.status(200).jsonp(commandAnswer);
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