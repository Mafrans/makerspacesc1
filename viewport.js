$(document).ready(function () {
    setTimeout(function() {
        location.reload();
    }, 3600000);
    update();
});

$(window).resize(function () {
    update();
});

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
