"use strict";var socket=io.connect("http://localhost:8000/quiz"),$status=$("#status"),$log=$("#log"),connectionAttempts=0;socket.on("connect",function(){$status.text("Connected")}),socket.on("error",function(){$status.text("Failed to connect")}),socket.on("disconnect",function(){$status.text("Connection dropped"),connectionAttempts=0}),socket.on("reconnect_attempt",function(){connectionAttempts++,$status.text("Reattempting connection... "+connectionAttempts)}),socket.on("selection",function(t){console.log(t),$log.append("<p>Pressed: "+t.type+"</p>")});