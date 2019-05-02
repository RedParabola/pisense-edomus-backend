const usbDetect = require('usb-detection');

function _initListening() {
  usbDetect.startMonitoring();
  
  // Detect add/insert
  usbDetect.on('add', function(device) { console.log('add', device); });
  usbDetect.on('add:vid', function(device) { console.log('add', device); });
  usbDetect.on('add:vid:pid', function(device) { console.log('add', device); });
  
  // Detect remove
  usbDetect.on('remove', function(device) { console.log('remove', device); });
  usbDetect.on('remove:vid', function(device) { console.log('remove', device); });
  usbDetect.on('remove:vid:pid', function(device) { console.log('remove', device); });
  
  // Detect add or remove (change)
  usbDetect.on('change', function(device) { console.log('change', device); });
  usbDetect.on('change:vid', function(device) { console.log('change', device); });
  usbDetect.on('change:vid:pid', function(device) { console.log('change', device); });
  
  // // Get a list of USB devices on your system, optionally filtered by `vid` or `pid`
  // usbDetect.find(function(err, devices) { console.log('find', devices, err); });
  // usbDetect.find(vid, function(err, devices) { console.log('find', devices, err); });
  // usbDetect.find(vid, pid, function(err, devices) { console.log('find', devices, err); });
  // // Promise version of `find`:
  // usbDetect.find().then(function(devices) { console.log(devices); }).catch(function(err) { console.log(err); });
  
  // Allow the process to exit
  //usbDetect.stopMonitoring()
}

module.exports.initListening = _initListening;