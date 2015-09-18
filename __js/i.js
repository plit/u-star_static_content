var time = 5000;

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

function loadAndReplaceContent(id, url, callback) {
    console.log('loadAndReplaceContent', id, url);
    //$( "#" +id ).load( url, function( response, status, xhr ) {
    //    if ( status == "error" ) {
    //        var msg = "Sorry but there was an error: ";
    //        $("#error").html(msg + xhr.status + " " + xhr.statusText);
    //    }
    //    $("#" + id).replaceWith(response);
    //    callback()
    //});

    $.ajax({
        url: url,
        cache: false,
        dataType: "html",
        success: function(response) {
            $("#" + id).replaceWith(response);
            callback();
        }
    });

}

var loadPage = (function ($) {
    var jQuery = $;
    var my = {},
        privateVariable = 1;

    function privateMethod() {
        // ...
    }

    my.moduleProperty = 1;
    my.moduleMethod = function () {
        // ...
        //privateMethod();
    };

    function loadNav() {
        loadAndReplaceContent('nav', '__ajax/i_nav.html', function() {
            $("a.kep img.kep").hover(function (i) {//console.log(i + 'hover');
                $(this).attr("src", $(this).attr("src").replace('normal', 'hover'));
            }, function (i) {//console.log(i + 'hover e');
                $(this).attr("src", $(this).attr("src").replace('hover', 'normal'));
            });
        });
    }

    function loadBg() {
        loadAndReplaceContent('background_cycler_box', '__ajax/i_bg.html', function(){
            $('#background_cycler').css('opacity', 0);
            $('#background_cycler').fadeTo( "slow" , 1, function() {
                // Animation complete.
                $('#background_cycler').fadeIn(1500);
                setInterval('cycleImages()', time);
            });


        });
    }

    function loadFooter() {
        loadAndReplaceContent('footer', '__ajax/i_footer.html', function(){
        });
    }

    function loadContent(ajax, callback) {
        ajax = ajax || '__ajax/i_content_home.html';
        loadAndReplaceContent('content', ajax, callback);
    }

    my.home = function() {
        loadNav();
        loadBg();
        loadContent();
        loadFooter();
    };

    my.who_we_are = function() {
        $('body').css('background', 'rgba(0, 0, 0, 0) url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/'+
            'tv5_comp_lp/homepage/background.jpg") no-repeat fixed center center / cover ');
        loadNav();
        //loadBg();
        loadContent('__ajax/i_content_who_we_are.html');
        loadFooter();
    };

    my.contact = function() {
        loadNav();
        loadBg();
        loadContent('__ajax/i_content_contact.html');
        loadFooter();
    };




    return my;
}(jQuery));






function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    //console.log('Query Variable ' + variable + ' not found');
}

$(document).ready(function () {

    //loadimg();



    var file = location.pathname.substring(location.pathname.lastIndexOf('/')+1);
    console.log(file);

    if (file.indexOf('i_who_we_are') != -1 || getQueryVariable('go') == 'who_we_are') {
        loadPage.who_we_are();
    }
    else if (file.indexOf('contact') != -1 || getQueryVariable('go') == 'contact') {
        loadPage.contact();
    }
    else {
        loadPage.home();
    }

});