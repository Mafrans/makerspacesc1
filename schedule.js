// Default json shown if no response is received from the API
var json = 
{
  "equipment": [
    "Dator 1",
    "Dator 2",
    "Dator 3",
    "3d Skrivare 1",
    "3d Skrivare 2"
  ],
  "bookings": [
    {
      "equipment": "Dator 1",
      "author": "API-Fel ",
      "timeStart": 0,
      "timeEnd": 100
    },
    {
      "equipment": "Dator 2",
      "author": "API-Fel ",
      "timeStart": 100,
      "timeEnd": 200
    },
    {
      "equipment": "Dator 3",
      "author": "API-Fel ",
      "timeStart": 200,
      "timeEnd": 300
    },
    {
      "equipment": "3d Skrivare 1",
      "author": "API-Fel ",
      "timeStart": 300,
      "timeEnd": 400
    },
    {
      "equipment": "3d Skrivare 2",
      "author": "API-Fel ",
      "timeStart": 400,
      "timeEnd": 480
    }
  ]
}


// Amount of columns
var columns = 8;

// The hour in which to start the table, every column is one hour
var startHour = 8;

// The api url to communicate with
var restUrl = "https://ljhfuiuhpqwiiqqlqatvpyyydolrsw.herokuapp.com/";

// The colors that are randomly assigned to every individual author.
var colors = ["#DD0890", "#4B0082", "#200C9C"];

// Months of the year, self explanatory
var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "Oktober", "November", "December"]

$(document).ready(function() {
    
    generateRows();
    generateColumns();
    generateCells();
    
    // Move the column container slightly left, to keep the columns in position
    $(".time-container").css("width", $(".column").width()*(columns+1));
    $(".time-container").css("left", $(".column").width()/2);
    
	// Run the different timers, these are recursive and automatically puts themselves on a timer
	updateBookings();
	updateTime();
	updateMotd();
});

    
// Generate the row elements
// One row is generated per device found in "equipment"
// On top of that there is also one row containing the numbers displayed above the table
function generateRows() {
	var rowAmount = json.equipment.length;
    
	// Generate the main rows responsible for containing the table
    for(var i = 0; i < rowAmount; i++) {
        var elem = $($.parseHTML(
            `
            <div class='row'>
                <span class='row-name soleto-light'>` + json.equipment[i] + `</span>
                <div class='schedule-row'>
                </div>
            </div>
            `
        ));
        
        if(i % 2 == 0) {
            elem.find(".schedule-row").addClass("granitegray-fill");
        }
        
        $(".row-container").append(elem);
    }
	
	
}


// Generate columns at the top of the table
// These are responsible for holding the time indicators
function generateColumns() {
	for(var i = 0; i < columns+1; i++) {
        var elem = $($.parseHTML(
            `
            <div class='column'>
                <span class='column-name soleto-light'>` + (startHour + i) + `</span>
            </div>
            `
        ));
        elem.css("width", $(".schedule-row").width()/columns);
        $(".time-container").append(elem);
    }
}


// Generate the cells populating the schedule rows.
// These cells have borders on each side and are purely for aesthetic purposes
function generateCells() {
	for(var i = 0; i < columns; i++) {
        var elem = $($.parseHTML(
            `
            <div class='cell'>
            </div>
            `
        ));
        elem.css("width", 100/columns + "%");
        $(".schedule-row").append(elem);
    }
}


// Updates the API
function updateBookings() {
	httpGetAsync(restUrl, updateSchedule);
	setTimeout(updateBookings, 300000);
}

// Takes input received from the api and parses it'
// Names are truncated to save space
function updateSchedule(input) {
	if(input.bookings !== undefined) {
		json = input;
	}
    
	$(".booking").remove();
	
    for(var i = 0; i < json.bookings.length; i++) {
        var booking = json.bookings[i];
        var index = json.equipment.indexOf(booking.equipment);
		
		var authorTruncated = booking.author.split(" ")[0] + " " + booking.author.split(" ")[1].substring(0, 1);
		
        var elem = $($.parseHTML(
            `
            <div class='booking'>
                <span class='author soleto-regular'>` + authorTruncated + `</span>
            </div>
            `
        ));
		elem.css("left", $($(".schedule-row")[index]).position.left);
		elem.css("margin-left", (100/columns/60)*booking.timeStart*($(".schedule-row").width()/100));
		elem.css("width", (100/columns/60)*(booking.timeEnd - booking.timeStart)*($(".schedule-row").width()/100));
		var color = colors[Math.round(random(booking.author) * (colors.length-1))];
		elem.css("background", color);
		
        $($(".schedule-row")[index]).append(elem);
    }
}

// Updates the various timestamps on the page
function updateTime() {
	var time = new Date();

	$(".clock").text(time.toLocaleTimeString().substring(0, 5));
	$(".date").text(time.getDate() + " " + months[time.getMonth()].toUpperCase());
	
	setTimeout(updateTime, 60000);
}

// Updates the message shown at the bottom of the page
function updateMotd() {
	var messages = [
		"\"You’re off to great places, today is your day. Your mountain is waiting, so get on your way.\"<br/><i>- Dr. Seuss</i>",
		"\"No one is perfect - that’s why pencils have erasers.\"<br/><i>- Wolfgang Riebe</i>",
		"\"It always seems impossible until it is done.\"<br/><i>- Nelson Mandela</i>",
		"\"The only time you fail is when you fall down and stay down.\"<br/><i>- Stephen Richards</i>",
		"\"Computers are bicycle for our minds.\"<br/><i>- Steve Jobs</i>",
		"\"If opportunity doesn’t knock, build a door.\"<br/><i>- Milton Berle</i>",
		"\"The way I see it, if you want the rainbow, you gotta put up with the rain.\"<br/><i>- Dolly Parton</i>",
	]
	
	$(".motd").html(messages[Math.round(Math.random()*(messages.length-1))]);
	setTimeout(updateMotd, 600000);
}

// Generates a random number between 0 and 1
// Takes a seed argument, use Math.random() to get a random number without a seed
// Relatively performance heavy, use with care
function random(seed) {
	var iseed = 1;
	for(var i = 0; i < seed.length; i++) {
		iseed += seed.charCodeAt(i);
	}
	
    var x = Math.sin(iseed++);
    return x - Math.floor(x);
}

// Async http GET request function
// Found on stackoverflow, thanks <3
function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}
