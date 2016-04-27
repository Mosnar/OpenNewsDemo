var socket = io.connect('http://localhost:8000/quiz');

var $status = $("#status");
var $log = $("#log");

var connectionAttempts = 0;

socket.on('connect', function() {
  $status.text("Connected");
});
socket.on('error', function() {
  $status.text("Failed to connect");
});
socket.on('disconnect', function() {
  $status.text("Connection dropped");
  connectionAttempts = 0;
});
socket.on('reconnect_attempt', function() {
  connectionAttempts++;
  $status.text("Reattempting connection... "+ connectionAttempts);
});


var _BIASED = "biased";
var _UNBIASED = "unbiased";
socket.on('selection', function (data) {
  if(data.type == _BIASED) {
    // do biased logic...
  } else {
    // do unbiased logic...
  }
  $log.append("<p>Pressed: "+data.type+"</p>");
});
