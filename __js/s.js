var time = 5000;

function cycleImages() {
	cycleImagesAction('background_cycler');
	cycleImagesAction('mob_img_box');
}
function cycleImagesAction(id) {
	var $active = $('#' + id + ' .active');
	var $next = ($('#' + id + ' .active').next().length > 0) ? $('#' + id + ' .active').next() : $('#' + id + ' img:first');
	$next.css('z-index', 2);//move the next image up the pile
	$active.fadeOut(1500, function () {//fade out the top image
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

	function loadNav(callback) {
		loadAndReplaceContent('nav', '__ajax/s/nav.html', function () {
			$("a.kep img.kep").hover(function (i) {//console.log(i + 'hover');
				$(this).attr("src", $(this).attr("src").replace('normal', 'hover'));
			}, function (i) {//console.log(i + 'hover e');
				$(this).attr("src", $(this).attr("src").replace('hover', 'normal'));
			});
			callback && callback();
		});
	}

	function loadBg() {
		loadAndReplaceContent('background_cycler_box', '__ajax/i/i_bg.html', function () {
			$('#background_cycler').css('opacity', 0);
			$('#background_cycler').fadeTo("slow", 1, function () {
				// Animation complete.
				$('#background_cycler').fadeIn(1500);
				setInterval('cycleImages()', time);
			});


		});
	}

	function loadFooter(callback) {
		loadAndReplaceContent('footer', '__ajax/s/footer.html', function () {
			$('.c_body').css('min-height', (window.innerHeight - 95) + 'px');
			callback && callback();

		});
	}

	function loadContent(ajax, callback) {
		ajax = ajax || '__ajax/s/home.html';
		loadAndReplaceContent('content', ajax, callback);
	}


	my.home = function () {
		//$('body').css('background', 'rgba(0, 0, 0, 0) url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/' +
		//	'img/backgrounds/bg_s_home2.jpg") no-repeat fixed center center / cover ');
		loadNav(function () {
			//$('.navbar').addClass('navbar-fixed-top')
		});
		//loadBg();
		loadContent(undefined, function () {
			is_mobile && $('section.bc_b06').css('margin-top', (Math.round(window.innerWidth * 0.5625) - 65) + 'px');
			//$('body').css('background', 'rgba(0, 0, 0, 0) url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/'+
			//	'img/backgrounds/shine.png") no-repeat fixed center center / cover ');
		});
		loadFooter(function () {
			// $('footer.bc_b06').css('position', 'fixed');
			is_mobile && $('footer').css('margin-top', '6em');
		});
	};

	my.contact = function () {
		//$('body').css('background', 'rgba(0, 0, 0, 0) url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/'+
		//	'img/backgrounds/shine.png") no-repeat fixed center center / cover ');
		loadNav();
		loadBg();
		loadContent('__ajax/i_content_contact.html');
		loadFooter();
	};

	my.universalLoadContent = function (file_name, settings) {
		loadNav();
		if (settings['loadBg'] == 'true') {
			loadBg();
		}
		if (settings['body_css_bg_img']) {
			$('body').css('background', settings['body_css_bg_img']);
		}
		loadContent('__ajax/s/' + file_name + '.' + settings['file_type']);
		loadFooter();
	};


	return my;
}(jQuery));


function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	//console.log('Query Variable ' + variable + ' not found');
}

var sites_settings = {
	"episodes": {
		"file_type": 'php'
	},
	"hosts_and_judges": {
		"file_type": 'php'
	},
	"gallery": {
		"file_type": 'php'
	},
	"contestants": {
		"file_type": 'php'
	},
	"app": {
		"file_type": 'html'
	},
	"first_season": {
		"file_type": 'html',
		"body_css_bg_img": 'silver url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/'+
			'img/backgrounds/shine.png") no-repeat  center center fixed'
	},
	"press": {
		"file_type": 'html',
		"body_css_bg_img": 'silver url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/'+
			'img/backgrounds/shine.png") no-repeat  center center fixed'
	},
	"home2": {
		"file_type": 'html',
		"body_css_bg_img": 'rgba(0, 0, 0, 0) url("http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/' +
		'img/backgrounds/bg_s_home2.jpg") no-repeat fixed center center / cover'
	},
	"home": {
		"file_type": 'html'
	}
};
$(document).ready(function () {

	//loadimg();


	var file = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
	//console.log(file);

	if (file.indexOf('i_who_we_are') != -1 || getQueryVariable('go') == 'who_we_are') {
		loadPage.who_we_are();
	}
	else if (file.indexOf('contact') != -1 || getQueryVariable('go') == 'contact') {
		loadPage.contact();
	}
	else {

		if (!getQueryVariable('go')) {
			var file_name = 'home2';
			loadPage.universalLoadContent(file_name, sites_settings[file_name]);
		}

		if (getQueryVariable('go') && sites_settings[getQueryVariable('go')]) {
			var file_name = getQueryVariable('go');
			loadPage.universalLoadContent(file_name, sites_settings[file_name]);
		} else {
			loadPage.home();
		}

	}

});