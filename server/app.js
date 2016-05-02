var io = require('socket.io')(8000);
var GPIO = require('onoff').Gpio;
var EventEmitter = require("events").EventEmitter;

var ee = new EventEmitter();

var btnBiased = new GPIO(5, 'in', 'up');
var btnUnbiased = new GPIO(6, 'in', 'up');
// var ledBiased = new GPIO(20, 'out', 'both');
// var ledUnbiased = new GPIO(21, 'out', 'both');
//
// ledBiased.writeSync(1);
// ledUnbiased.writeSync(1);

btnBiased.watch(biasedPressed);
btnUnbiased.watch(unbiasedPressed);


function biasedPressed(err, state) {
  if (state == 1) {
    ee.emit("bias_pressed");
  }
}

function unbiasedPressed(err, state) {
  if (state == 1) {
    ee.emit("unbiased_pressed");
  }
}


// Websocket stuff
var quiz = io
  .of('/quiz')
  .on('connection', function (socket) {
    socket.on('debug_press', function (data) {
      if (data.type == "biased") {
        ee.emit("bias_pressed");
      } else {
        ee.emit("unbiased_pressed");
      }
    });

    ee.on("bias_pressed", debounce(function () {
      socket.emit('selection', {
        type: 'biased'
      });
    }), 1000);
    ee.on("unbiased_pressed", debounce(function () {
      socket.emit('selection', {
        type: 'unbiased'
      });
    }), 1000);
  });


// Source: https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
