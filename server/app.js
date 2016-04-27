var io = require('socket.io')(8000);
var quiz = io
  .of('/quiz')
  .on('connection', function (socket) {
    socket.emit('selection', {
      type: 'biased'
    });
  });
