$(function () {
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "3500",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

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

// // function for user prompt
//   function promptUser() {
//     var thinksBiased = prompt("Do you think the large blue phrase is biased? Enter y for yes and n for no", "");
//     // They think it's biased
//     if (thinksBiased.indexOf("y") != -1) {
//       var biasedBool = true;
//     }
//     else {
//       var biasedBool = false;
//     }
//     return biasedBool;
//   }
  var socket = io.connect('http://localhost:8000/quiz');

  var $status = $("#status");
  var $log = $("#log");

  var $btnBiased = $("#btnBiased");
  var $btnUnbiased = $("#btnUnbiased");

  var connectionAttempts = 0;
  var quizPos = 0;

  function setControlsDisabled(state) {
    $btnBiased.prop("disabled", state);
    $btnUnbiased.prop("disabled", state);
  }

  setControlsDisabled(true);

  function startQuiz() {
    setControlsDisabled(false);
    var el = $(allSentimentBlocks).get(0);
    var $el = $(el);
    $($el).show();
    $($el).addClass('current');
  }

  /**
   * Starts iterating through MPQASENT blocks
   */
  function progressQuiz(biasedBool) {
    var el = $(allSentimentBlocks).get(quizPos);
    var elNext = $(allSentimentBlocks).get(quizPos + 1);
    var $el = $(el);
    var $elNext = $(elNext);

    if (!el) {
      return false;
    }

    var prompt = "";
    if (isObjective($el)) {
      if (!biasedBool) {
        prompt = "You and the algorithm agree, ";
        toastr["success"](prompt + "it labels this is as objective!");
      }
      else {
        prompt = "You and the algorithm disagree, ";
        toastr["error"](prompt + "it labels this is as objective!");

      }
      $el.removeClass('current');
      $el.addClass('unbiased');
    }
    else {
      if (biasedBool) {
        prompt = "You and the algorithm agree, ";
        toastr["success"](prompt + " it labels this as biased!");
      }
      else {
        prompt = "You and the algorithm disagree, ";
        toastr["error"](prompt + " it labels this as biased!");
      }
      $el.removeClass('current');
      $el.addClass('biased');
    }
    quizPos++;
    if (elNext) {
      $elNext.show();
      $elNext.addClass('current');
    } else {
      setControlsDisabled(true);
    }
  }

  socket.on('connect', function () {
    startQuiz();
    $status.text("Connected");
  });
  socket.on('error', function () {
    $status.text("Failed to connect");
  });
  socket.on('disconnect', function () {
    $status.text("Connection dropped");
    setControlsDisabled(true);
    connectionAttempts = 0;
  });
  socket.on('reconnect_attempt', function () {
    connectionAttempts++;
    $status.text("Reattempting connection... " + connectionAttempts);
  });

  var _BIASED = "biased";
  var _UNBIASED = "unbiased";
  socket.on('selection', debounce(function (data) {
    if (data.type == _BIASED) {
      console.log("Got biased");
      progressQuiz(true);
    } else {
      console.log("Got unbiased");
      progressQuiz(false);
    }
  },50));

  $btnBiased.on('click', function () {
    socket.emit('debug_press', {type: 'biased'});
  });

  $btnUnbiased.on('click', function () {
    socket.emit('debug_press', {type: 'unbiased'});
  });
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
    func.apply(context, args);
  };
}
