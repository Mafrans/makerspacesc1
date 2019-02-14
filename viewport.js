let page = 0;
let page_amount = 2;

$(document).ready(function () {
	switchPage();
    setTimeout(function() {
        location.reload();
    }, 3600000);
	
    setTimeout(function run() {
		switchPage();
		setTimeout(run, 10000);
    }, 10000);
    update();
});

$(window).resize(function () {
    update();
});


function switchPage() {	
	page++;
	console.log(page);
	if(page >= page_amount) page = 0;
	
	for(var i = 0; i < page_amount; i++) {
		if(i == page) continue;
		$(".page-" + i).hide();
	}
	
	$(".page-" + page).show();	
}


function update() {
    let wHeight = $(window).height();
    let wWidth = $(window).width();

    if(wHeight/wWidth > 1) { // Portrait mode
        $(".landscape").hide();
        $(".portrait").show();
    }
    else {
        $(".portrait").hide();
        $(".landscape").show();
    }


    let objx = $(".centered-x").filter(":visible");
    objx.css("left", wWidth/2 - objx.width()/2);

    let objy = $(".centered-y").filter(":visible");
    objy.css("top", wHeight/2 - objy.height()/2);
	
}
