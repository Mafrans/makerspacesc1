var json = {"equipment":["Dator 1","Dator 2","Dator 3","3d Skrivare 1","3d Skrivare 2"],"bookings":[{"equipment":"Dator 1","author":"En Person1","timeStart":20,"timeEnd":100},{"equipment":"Dator 2","author":"En Person3","timeStart":20,"timeEnd":100},{"equipment":"Dator 3","author":"En Person4","timeStart":40,"timeEnd":100}]}
var columns = 8;
var startHour = 8;
var restUrl = "https://ljhfuiuhpqwiiqqlqatvpyyydolrsw.herokuapp.com/";

var colors = ["#DD0890", "#4B0082", "#0DE1EC", "#200C9C"]
var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "Oktober", "November", "December"]

$(document).ready(function() {
    
    var rowAmount = json.equipment.length;
    
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
    
    for(var i = 0; i < columns; i++) {
        var elem = $($.parseHTML(
            `
            <div class='cell'>
            </div>
            `
        ));
        elem.css("width", 100/columns + "%");
        //elem.css("left", 100/columns*i + "%");
        $(".schedule-row").append(elem);
    }
    
    $(".time-container").css("width", $(".column").width()*(columns+1));
    $(".time-container").css("left", $(".column").width()/2);
    
	runTimer();
	setInterval(function() {
		runTimer();
	}, 300000);
	
	updateTime();
	updateMotd();
	setTimeout(updateTime, 60000);
	setTimeout(updateMotd, 600000);
});

function runTimer() {
	httpGetAsync(restUrl, updateSchedule);
}

function updateSchedule(input) {
    json = input;
    
	$(".booking").remove();
	if(json.bookings === undefined) return;
	
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
		elem.css("margin-left", (100/columns/60)*booking.timeStart + "%");
		elem.css("width", (100/columns/60)*(booking.timeEnd - booking.timeStart) + "%");
		var color = colors[Math.round(random(booking.author) * (colors.length-1))];
		elem.css("background", color);
		
        $($(".schedule-row")[index]).append(elem);
    }
}

function updateTime() {
	var time = new Date();

	$(".clock").text(time.toLocaleTimeString().substring(0, 5));
	$(".date").text(time.getDate() + " " + months[time.getMonth()].toUpperCase());
	
	setTimeout(updateTime, 60000);
}

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

function random(sseed) {
	var seed = 0;
	for(var i = 0; i < sseed.length; i++) {
		seed += sseed.charCodeAt(i);
	}
	
    var x = Math.sin(seed++);
    return x - Math.floor(x);
}

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}
