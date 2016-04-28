var socket = io.connect('http://localhost:8000/quiz');

var $status = $("#status");
var $log = $("#log");

var connectionAttempts = 0;

socket.on('connect', function () {
  $status.text("Connected");
});
socket.on('error', function () {
  $status.text("Failed to connect");
});
socket.on('disconnect', function () {
  $status.text("Connection dropped");
  connectionAttempts = 0;
});
socket.on('reconnect_attempt', function () {
  connectionAttempts++;
  $status.text("Reattempting connection... " + connectionAttempts);
});


var _BIASED = "biased";
var _UNBIASED = "unbiased";
socket.on('selection', function (data) {
  if (data.type == _BIASED) {
    // do biased logic...
  } else {
    // do unbiased logic...
  }
  $log.append("<p>Pressed: " + data.type + "</p>");
});


$(function () {
  var objective_statements = $("[autoclass2=obj]");
  var subjective_statements = $("[autoclass2=subj]");
  var allSentimentBlocks = $("MPQASENT");

  function isObjective(statement) {
    var isObjective = false;
    $(objective_statements).each(function (index) {
      var text1 = statement.text().trim();
      var text2 = $(this).text().trim();
      if (text1 == text2) {
        isObjective = true;
        return false;
      }
    });
    return isObjective;
  }

// function for user prompt
  function promptUser() {
    var thinksBiased = prompt("Do you think the large blue phrase is biased? Enter y for yes and n for no", "");
    // They think it's biased
    if (thinksBiased.indexOf("y") != -1) {
      var biasedBool = true;
    }
    else {
      var biasedBool = false;
    }
    return biasedBool;
  }

  /**
   * Starts iterating through MPQASENT blocks
   */
  function startQuiz() {
    $(allSentimentBlocks).each(function (index) {
      $(this).show();
      $(this).addClass('current');


      // Call function to ask for userprompt
      var biasedBool = promptUser();
      // give appropritate response

      if (isObjective($(this))) {
        if (!biasedBool) {
          var prompt = "You and the algorithm agree, ";
        }
        else {
          var prompt = "You and the algorithm disagree, ";

        }
        alert(prompt + "it labels this is as objective!");
        $(this).removeClass('current');
        $(this).addClass('unbiased');
      }
      else {
        if (biasedBool) {
          var prompt = "You and the algorithm agree, ";
        }
        else {
          var prompt = "You and the algorithm disagree, ";

        }
        alert(prompt + " it labels this as biased!");

        $(this).removeClass('current');
        $(this).addClass('biased');
      }
    });
  }
  startQuiz();
});
