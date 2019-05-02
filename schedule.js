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
  "bookings": []
}


// Amount of columns
var columns = 8;

// The hour in which to start the table, every column is one hour
var startHour = 8;

//TODO change url to server host when server is up.
// The api url to communicate with
var restUrl = "http://makerspace.umea-ntig.se/api/booking";

// Months of the year, self explanatory
var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "Oktober", "November", "December"]

$(document).ready(function() {
	// Run the different timers, these are recursive and automatically puts themselves on a timer
	updateBookings();
	updateTime();

    // Move the column container slightly left, to keep the columns in position
    $(".time-container").css("width", $(".column").width()*(columns+1));
    $(".time-container").css("left", $(".column").width()/2);

    setTimeout(function () {
		location.reload();
	}, 60000000);
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
            elem.find(".schedule-row").addClass("granitegray-fill-50");
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
        elem.css("left", $(".schedule-row").width()/columns*1.5);
        $(".time-container").css("width", 1080)
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
	setTimeout(updateBookings, 60000);
}

// Takes input received from the api and parses it'
// Names are truncated to save space
function updateSchedule(input) {
	console.log(input);
	console.log(restUrl);
	json = JSON.parse(input);
	$(".row-container").html('<div class="time-container"></div>');
    generateRows();
    generateColumns();
    generateCells();
	$(".booking").remove();
	
	if(json.bookings === undefined) return;
	
    for(var i = 0; i < json.bookings.length; i++) {
        var booking = json.bookings[i];
        var index = json.equipment.indexOf(booking.equipment);
		
		var authorTruncated = booking.name.substring(0, booking.name.indexOf(" ") + 2);
		
        var elem = $($.parseHTML(
            `
            <div class='booking'>
                <span class='author soleto-regular'>` + authorTruncated + `</span>
            </div>
            `
        ));
		elem.css("left", $($(".schedule-row")[index]).position.left);
		elem.css("margin-left", (100/columns/60)*booking.start*($(".schedule-row").width()/100));
		elem.css("width", (100/columns/60)*(booking.end - booking.start)*($(".schedule-row").width()/100));

		//var color = colors[Math.round(random(booking.name) * (colors.length-1))];
		var color = "rgb(" + (221 - Math.round(random(booking.name) * 100)) + "," + 8 + "," + (144 + Math.round(random(booking.name) * 100)) + ")";
		elem.css("background", color);
		
        $($(".schedule-row")[index]).append(elem);
    }
	// Update time to position time bar
	updateTime();
}

// Updates the various timestamps on the page
function updateTime() {
	var time = new Date();

	$(".clock").text(time.toLocaleTimeString().substring(0, 5));
	$(".date").text(time.getDate() + " " + months[time.getMonth()].toUpperCase());
	
	$(".time-bar").css("height", $(".row-container").height() - 10);
	$(".time-bar").css("margin-top", 10);
	
	var currentDate = new Date();
	var oldDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0);
	
	if($(".schedule-row").position() !== undefined) {
		$(".time-bar").css("left", $(".schedule-row").position().left + (100/columns/60)*((currentDate-oldDate)/60000)*($(".schedule-row").width()/100));
		if((100/columns/60)*((currentDate-oldDate)/60000) > 100 || (100/columns/60)*((currentDate-oldDate)/60000) < 0) {
			$(".time-bar").hide();
		}
		else {
			$(".time-bar").show();
		}
	}
	
	setTimeout(updateTime, 10000);
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
    };
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}
