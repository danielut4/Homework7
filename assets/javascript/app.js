  var config = {
    apiKey: "AIzaSyABHDI2IHJf5MtHRjW_rioiYRpcrQoHG6U",
    authDomain: "homework7-714fa.firebaseapp.com",
    databaseURL: "https://homework7-714fa.firebaseio.com",
    projectId: "homework7-714fa",
    storageBucket: "homework7-714fa.appspot.com",
    messagingSenderId: "985772173965"
  };
  firebase.initializeApp(config);
  database = firebase.database();

function calcNextArrival(time, freq) {
	var mTime = moment(time,'H:mm');	
	console.log(moment(mTime).format('h:mm'));
	while (mTime.diff(moment(), 'm') <= 0) {
		mTime.add(freq, 'm');
	}
	return mTime;
}

function calcMinuteAway(mArrival) {
	return(moment(mArrival).diff(moment(), 'm'));	
}

$(document).ready(function() {

database.ref().on("child_added", function(snapshot, prevChildKey) {
	var name = snapshot.val().name;
	var dest = snapshot.val().dest;
	var firstTrainTime = snapshot.val().firstTrainTime;
	var frequency = snapshot.val().frequency;
	updateTable(name, dest, firstTrainTime, frequency );

});

function updateTable(name, dest, firstTime, freq ) {
	var entry;
	var mNextArrival = calcNextArrival(firstTime, freq);
	var minuteAway = calcMinuteAway(mNextArrival);
	var arrivalString = moment(mNextArrival).format("h:mmA");
	entry = `<tr><td>${name}</td><td>${dest}</td><td class="td-freq">${freq}</td><td class="td-arrival">${arrivalString}</td><td class="td-away">${minuteAway}</td></tr>`;
	$('#table-schedule > tbody').append(entry);

}

$('#add-train-btn').on('click', function(event) {
	event.preventDefault();
	var name;
	var dest;
	var firstTrainTime;
	var frequency;
	var entry;

	name = $('#train-name-input').val().trim();
	dest = $('#train-dest-input').val().trim();
	firstTrainTime = $('#train-time-input').val().trim();
	frequency = parseInt($('#train-freq-input').val().trim());

	var newTrain = {
		name: name,
		dest: dest,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	};
	database.ref().push(newTrain);
}); 

function updateRowTable() {
	var rowCount = $('#table-schedule >tbody >tr').length;
	$('#table-schedule >tbody >tr').each(function() {
		var away = $(this).find(".td-away").html();
		if (away > 0) {
			$(this).find(".td-away").html(--away);
		}
		else {
			var freq = $(this).find(".td-freq").html();
			$(this).find(".td-away").html(freq);
			//get new arrival time
			var arrival = $(this).find(".td-arrival").html();
			var mNextArrival = calcNextArrival(arrival, freq);
			$(this).find(".td-arrival").html(moment(mNextArrival).format("h:mmA"));
		}
	});
}

var interval = setInterval(updateRowTable, 60000);

});