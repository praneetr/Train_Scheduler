// Initializes Firebase
  var config = {
    apiKey: "AIzaSyA4N7fiw-OumIRZxOkqSM9YvL9yXjlBm9o",
    authDomain: "train-scheduler-homework-e6b85.firebaseapp.com",
    databaseURL: "https://train-scheduler-homework-e6b85.firebaseio.com",
    projectId: "train-scheduler-homework-e6b85",
    storageBucket: "train-scheduler-homework-e6b85.appspot.com",
    messagingSenderId: "190588392475"
  };
  firebase.initializeApp(config);

// VARIABLES
var database = firebase.database();
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;


// click function to add inputs
$("#addTrain").on("click", function() {

  //Prevents the page from reloading.
  event.preventDefault();

  trainName = $('#nameInput').val().trim();
  destination = $('#destinationInput').val().trim();
  firstTrainTime = $('#firstTrainInput').val().trim();
  frequency = $('#frequencyInput').val().trim();

  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  //Pushes the individual entry to firebase. Push adds it as one 
  //item with a single unique id.

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency

  
  });
  // clears input boxes after submit button is clicked
    $("#nameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");
});


// function to add train info to train schedule table
  database.ref().on("child_added", function(snapshot) {
  console.log(snapshot.val());

  // updates the variable with data from the database
  trainName = snapshot.val().trainName;
  destination = snapshot.val().destination;
  firstTrainTime = snapshot.val().firstTrainTime;
  frequency = snapshot.val().frequency;

  // to calculate minutes away for next train
  var firstTrainMoment = moment(firstTrainTime, 'HH:mm');
  var nowMoment = moment();

  var minutesSinceFirstArrival = nowMoment.diff(firstTrainMoment, 'minutes');

  // use modulo "remainder" operator
  var minutesSinceLastArrival = minutesSinceFirstArrival % frequency;
  var minutesAway = frequency - minutesSinceLastArrival;
  var nextArrival = nowMoment.add(minutesAway, 'minutes');
  var formatNextArrival = nextArrival.format("HH:mm");

  // to display each train
  $('#newTrains').append("<tr>" + 
    "<td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency +
    "</td><td>" + formatNextArrival + "</td><td>" + minutesAway + "</td></tr>");

  }, function (errorObject) {

  // In case of error this will print the error
    console.log("The read failed: " + errorObject.code);

});


