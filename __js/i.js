var is_cl = false;
var time = 5000;
var intervalId;

function startBgRotate() {
	//return;
	is_cl && console.log('startBgRotate');
	$('#background_cycler_I').css('opacity', 0);
	$('#background_cycler_I').fadeTo("slow", 1, function () {
		// Animation complete.
		$('#background_cycler_I').fadeIn(1500);
		intervalId = setInterval(function () {
			cycleImagesI_()
		}, time);
	});
}

function stopBgRotate() {
	is_cl && console.log('stopColor', intervalId);
	clearInterval(intervalId);
}
function changeBgRotate(index) {
	is_cl && console.log('changeBgRotate', index);
	stopBgRotate();
	$('#background_cycler_I .active').css('z-index', '1');
	$('#background_cycler_I .active').removeClass('active');
	$('#mob_img_box_I .active').removeClass('active');
	$('#background_cycler_I img:eq(' + index + ')').addClass('active').css('z-index', '2');
	$('#mob_img_box_I img:eq(' + index + ')').addClass('active');
	startBgRotate();
}
function cycleImagesI_() {
	cycleImagesI_Action('background_cycler_I');
	cycleImagesI_Action('mob_img_box_I');
}
function cycleImagesI_Action(id) {
	is_cl && console.log('cycleImagesI_Action', id);
	var $active = $('#' + id + ' .active');
	var $next = ($('#' + id + ' .active').next().length > 0) ? $('#' + id + ' .active').next() : $('#' + id + ' img:first');
	$next.css('z-index', 2);//move the next image up the pile
	$active.fadeOut(1500, function () {//fade out the top image
		$active.css('z-index', 1).show().removeClass('active');//reset the z-index and unhide the image
		$next.css('z-index', 3).addClass('active');//make the next image the top one
	});
}

function loadAndReplaceContent(id, url, callback) {
	is_cl && console.log('loadAndReplaceContent', id, url);
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
		success: function (response) {
			$("#" + id).replaceWith(response);
			callback && callback();
		}
	});

}

var youtube = function ($) {
	var jQuery = $;
	var my = {},
		is_mobile = window.innerWidth < 768;

	function privateMethod() {
		// ...
	}

	my.init = function () {
		cln('youtube.init');
		var simple = 'YouTube-icon-dark_o5';
		var hover = 'YouTube-icon-full_color_o7';
		$('.y_img_box').hover(
			function () {
				$('.y_img_box .play').attr('src', $('.y_img_box .play').attr('src').replace(simple, hover));
			},
			function () {
				$('.y_img_box .play').attr('src', $('.y_img_box .play').attr('src').replace(hover, simple));
			}
		);

		$('.y_img_box').click(function (event) {
			cl('.y_img_box click');
			youtube.alertVideo($(this).find('.youtube_video_img'))
		})
	};

	my.alertVideo = function (c_this) {
		cln('youtube.alertVideo');
		// http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
		// src = http://img.youtube.com/vi/pDxWewLpGVk/0.jpg| hqdefault | hqdefault
		var youtube_key = $(c_this).attr('src').match(/\/vi\/(.*?)\//)[1];
		youtube_key = youtube_key || 'pDxWewLpGVk';

		var winHeighth = document.documentElement.clientHeight;
		var winWidth = document.documentElement.clientWidth;
		var alertWidth = winWidth > 768 && winWidth < 1000 ? 768 : (winWidth > 1000 ? 900 : winWidth * 0.8);
		//alert(alertWidth);
		var arany = 0.58;

		AlertShowX(
			'<div class="y_video_box">' +
			'	<img class="loader1" src="http://media.apnarm.net.au/128.6/tc/base/img/miscSize/ajaxSpinner.gif" alt="loading gif"/>' +
			'	<iframe style="width: 100%; height: 313px;" src="https://www.youtube.com/embed/' + youtube_key + '?autoplay=1" frameborder="0" allowfullscreen></iframe>' +
			'</div>',
			alertWidth * arany
		);
		//$('#fullscreen').css('top', '-'+ winHeighth * 1.5 +'px');
		$('#fullscreen div.alert div.text').css('padding-bottom', 0);
		$('#alertId').css('padding', '20px');
		if (winWidth > 768) {
			$('#alertId').css('width', alertWidth + 'px');
			$('#alertId').css('left', '50%');
			$('#alertId').css('margin-left', '-' + Math.round(alertWidth / 2) + 'px');
		}

		$('.y_video_box iframe').css('height', $('#alertId').css('height').split('p')[0] - 40 + 'px');

		$('.y_video_box iframe').on('load', function () {
			$('.loader1').hide();
		});
	};


	return my;

}(jQuery);


var loadPage = (function ($) {
	var jQuery = $;
	var my = {},
		privateVariable = 1,
		is_mobile = window.innerWidth < 768;

	function privateMethod() {
		// ...
	}

	my.moduleProperty = 1;
	my.moduleMethod = function () {
		// ...
		//privateMethod();
	};

	function loadNav(func) {
		loadAndReplaceContent('nav', '__ajax/i/i_nav.html', function () {
			$("a.kep img.kep").hover(function (i) {//is_cl && console.log(i + 'hover');
				$(this).attr("src", $(this).attr("src").replace('normal', 'hover'));
			}, function (i) {//is_cl && console.log(i + 'hover e');
				$(this).attr("src", $(this).attr("src").replace('hover', 'normal'));
			});
			func && func();
		});
	}

	function loadBg() {
		loadAndReplaceContent('background_cycler_box', '__ajax/i/i_bg.html', function () {

			startBgRotate();

		});
	}

	function loadFooter(func) {
		loadAndReplaceContent('footer', '__ajax/i/i_footer.html', function () {
			$('.c_body').css('min-height', (window.innerHeight - 95) + 'px');
			func && func();
		});
	}

	function loadContent(ajax, callback) {
		ajax = ajax || '__ajax/i/i_content_home.html';
		loadAndReplaceContent('content', ajax, callback);
	}


	my.home = function () {
		loadNav(function () {
			$('.navbar').addClass('navbar-fixed-top')
		});
		loadBg();
		loadContent(undefined, function () {
			is_mobile && $('section.bc_b06').css('margin-top', (Math.round(window.innerWidth * 0.5625) - 65) + 'px');
		});
		loadFooter(function () {
			// $('footer.bc_b06').css('position', 'fixed');
			is_mobile && $('footer').css('margin-top', '6em');
		});
	};

	my.about = function () {
		loadPage.body_bg('#1F5D68 url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/img/backgrounds/bg_about.jpg")' +
		' no-repeat fixed center 3.5em / cover');
		loadNav();
		//loadBg();
		loadContent('__ajax/i/i_content_about2.html');
		loadFooter();
	};

	my.first_season = function () {
		loadPage.body_bg('#1A4168 url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/img/backgrounds/bg_first_season.jpg")' +
		' no-repeat  fixed center 3.5em ');
		loadNav();
		//loadBg();
		loadContent('__ajax/i/i_content_first_season2.html');
		loadFooter();
	};

	my.terms = function () {
		$('body').css('background', 'rgba(0, 0, 0, 0) url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/' +
		'tv5_comp_lp/homepage/background.jpg") no-repeat fixed center center / cover ');
		loadNav();
		//loadBg();
		loadContent('__ajax/i/i_content_terms.html');
		loadFooter();
	};

	my.privacy = function () {
		$('body').css('background', 'rgba(0, 0, 0, 0) url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/' +
		'tv5_comp_lp/homepage/background.jpg") no-repeat fixed center center / cover ');
		loadNav();
		//loadBg();
		loadContent('__ajax/i/i_content_privacy.html');
		loadFooter();
	};

	my.press = function () {
		loadPage.body_bg('#fff url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/img/backgrounds/bg_press.jpg")' +
		' no-repeat fixed center top / cover');
		//' no-repeat  top center fixed');
		loadNav();
		//loadBg();
		loadContent('__ajax/i/i_content_press2.html');
		loadFooter();
	};

	my.contact = function () {
		loadNav();
		loadBg();
		loadContent('__ajax/i/i_content_contact.html');
		loadFooter();
	};

	my.app = function () {
		loadPage.body_bg('#ECEFDC url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/img/backgrounds/bg_mob_app.jpg")' +
		' no-repeat  fixed center 3.5em ');
		loadNav();
		//loadBg();
		loadContent('__ajax/i/i_content_app.html');
		loadFooter();
	};

	my.app2 = function () {
		loadPage.body_bg('#fff url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/img/backgrounds/bg_mob_app2.jpg")' +
		' no-repeat  fixed center 3.5em ');
		loadNav();
		//loadBg();
		loadContent('__ajax/i/i_content_app2.html');
		loadFooter();
	};

	my.app3 = function () {
		loadPage.body_bg('#fff url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/img/backgrounds/bg_mob_app5.jpg")' +
		' no-repeat  fixed center 3.5em ');
		loadNav();
		//loadBg();
		loadContent('__ajax/i/i_content_app3.html');
		loadFooter();
	};

	my.body_bg = function (value) {
		$('body').css('background', value);
	};


	return my;
}(jQuery));


function validateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}


function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	//is_cl && console.log('Query Variable ' + variable + ' not found');
}


//$(document).ready(function () {

//loadimg();


var file = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
is_cl && console.log(file);

if (file.indexOf('i_about') != -1 || getQueryVariable('go') == 'about') {
	loadPage.about();
}
else if (file.indexOf('contact') != -1 || getQueryVariable('go') == 'contact') {
	loadPage.contact();
}
else if (file.indexOf('first_season') != -1 || getQueryVariable('go') == 'first_season') {
	loadPage.first_season();
}
else if (file.indexOf('term') != -1 || getQueryVariable('go') == 'terms') {
	loadPage.terms();
}
else if (file.indexOf('privacy') != -1 || getQueryVariable('go') == 'privacy') {
	loadPage.privacy();
}
else if (file.indexOf('press') != -1 || getQueryVariable('go') == 'press') {
	loadPage.press();
}
else if (file.indexOf('app2') != -1 || getQueryVariable('go') == 'app2') {
	loadPage.app2();
}
else if (file.indexOf('app3') != -1 || getQueryVariable('go') == 'app3') {
	loadPage.app3();
}
else if (file.indexOf('app') != -1 || getQueryVariable('go') == 'app') {
	loadPage.app();
}
else {

	loadPage.home();
}

//});