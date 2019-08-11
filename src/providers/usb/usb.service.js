const usbDetect = require('usb-detection');

let connectedUSBDevices = {};
let currentConnectedUSB;

function initListening() {
  usbDetect.startMonitoring();
  
  // Detect add/insert
  usbDetect.on('add', function(device) {
    console.log('add', device);
    connectedUSBDevices[device.serialNumber] = device;
    currentConnectedUSB = device;
  });
  
  // Detect remove
  usbDetect.on('remove', function(device) {
    console.log('remove', device);
    const storedDevice = connectedUSBDevices[device.serialNumber];
    if (storedDevice) {
      connectedUSBDevices[device.serialNumber] = undefined;
    }
    currentConnectedUSB = undefined;
  });

}

// Allow the process to exit
function stopListening() {
  usbDetect.stopMonitoring();
}

function getCurrentConnectedUSB() {
  return currentConnectedUSB;
}

// // Detect add/insert
// usbDetect.on('add:vid', function(device) { console.log('add', device); });
// usbDetect.on('add:vid:pid', function(device) { console.log('add', device); });

// // Detect remove
// usbDetect.on('remove:vid', function(device) { console.log('remove', device); });
// usbDetect.on('remove:vid:pid', function(device) { console.log('remove', device); });

// // Detect add or remove (change)
// usbDetect.on('change', function(device) { console.log('change', device); });
// usbDetect.on('change:vid', function(device) { console.log('change', device); });
// usbDetect.on('change:vid:pid', function(device) { console.log('change', device); });

// // Get a list of USB devices on your system, optionally filtered by `vid` or `pid`
// usbDetect.find(function(err, devices) { console.log('find', devices, err); });
// usbDetect.find(vid, function(err, devices) { console.log('find', devices, err); });
// usbDetect.find(vid, pid, function(err, devices) { console.log('find', devices, err); });
// // Promise version of `find`:
// usbDetect.find().then(function(devices) { console.log(devices); }).catch(function(err) { console.log(err); });



const usbService = {
  initListening,
  stopListening,
  getCurrentConnectedUSB,
}

module.exports = usbService;