var time = 5000;
////Preload images first
//$.fn.preload = function () {
//    this.each(function () {
//        $('<img/>')[0].src = this;
//    });
//};
//var images = Array("http://93c197a7423402d9ce14-d9cc0eab97f83302f154a23cc39c71c1.r97.cf1.rackcdn.com/mobile_karaoke_lp_1.jpg",
//    "http://93c197a7423402d9ce14-d9cc0eab97f83302f154a23cc39c71c1.r97.cf1.rackcdn.com/mobile_karaoke_lp_2.jpg",
//    "http://93c197a7423402d9ce14-d9cc0eab97f83302f154a23cc39c71c1.r97.cf1.rackcdn.com/mobile_karaoke_lp_3.jpg");
//
//$([images[0], images[1], images[2]]).preload();
//
//// Usage:
//var currimg = 0;
//var time = 5000;
//function loadimg() {
//    //console.log('loadimg');
//    cycleImages();
//    $('#bg').animate({opacity: 1}, 500, function () {
//
//        //finished animating, minifade out and fade new back in
//        $('#bg').animate({opacity: 0.7}, 100, function () {
//            currimg++;
//            if (currimg > images.length - 1) {
//                currimg = 0;
//            }
//            var newimage = images[currimg];
//
//            //swap out bg src
//            $('#bg').css("background-image", "url(" + newimage + ")");
//
//            //animate fully back in
//            $('#bg').animate({opacity: 1}, 400, function () {
//                //set timer for next
//                setTimeout(loadimg, time);
//            });
//
//        });
//
//    });
//
//}

function cycleImages() {
    cycleImagesAction('background_cycler');
    cycleImagesAction('mob_img_box');
}
function cycleImagesAction(id) {
    var $active = $('#' + id + ' .active');
    var $next = ($('#' + id + ' .active').next().length > 0) ? $('#' + id + ' .active').next() : $('#' + id + ' img:first');
    $next.css('z-index', 2);//move the next image up the pile
    $active.fadeOut(1500, function() {//fade out the top image
        $active.css('z-index', 1).show().removeClass('active');//reset the z-index and unhide the image
        $next.css('z-index', 3).addClass('active');//make the next image the top one
    });
}


$(document).ready(function () {

    //loadimg();

    $('#background_cycler').fadeIn(1500);
    setInterval('cycleImages()', time);

    $("a.kep img.kep").hover(function (i) {//console.log(i + 'hover');
        $(this).attr("src", $(this).attr("src").replace('normal', 'hover'));
    }, function (i) {//console.log(i + 'hover e');
        $(this).attr("src", $(this).attr("src").replace('hover', 'normal'));
    });

});