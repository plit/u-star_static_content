

var rsBanners = (function ($) {
	var jQuery = $;
	var my = {};

	/**
	 * get banner
	 */
	my.getBanner = function(position) {
		cln('rsBanners - getBanner - ' + position);
		try {
			if (typeof position == "undefined") {
				cl('position?');
				return '';
			}
			jQuery.ajax({
				type: 'GET',
				//url: _SITE_URL + 'rsbanners/showBannerPosition?position=' + position, // szazalekos
				url: _SITE_URL + 'rsbanners/showBanner/' + position,	// sulyozos
				//data: {'fid':fid,'mode':mode},
				cache: false,
				success: function(response)
				{
					$('#showBannerPosition_' + position).html(response);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#message-new').html(errorThrown);
					cle(errorThrown);
				}
			});
		} catch(e) {cle(e);}
	};

	my.changeRotatingBannerType = function(_this) {
		cln('rsBanners - changeRotatingBannerType' + $("#rotating_type_selector").val());
		if($("#rotating_type_selector").val() == "thin") {
			$('#text_or_performance_performance').prop('disabled',true);
			$('#text_or_performance_bubble').removeAttr('disabled');
			$('#text_or_performance_text').attr('checked','checked');
		} else {
			$('#text_or_performance_performance').removeAttr('disabled');
			$('#text_or_performance_bubble').prop('disabled',true);
			$('#text_or_performance_text').removeAttr('checked');
			$('#text_or_performance_text').attr('checked','checked');
		}
	};

	/**
	 * using
	 *
	 * <div id="competition_bs_banner"></div>
	 * <script type="text/javascript">rsBanners.getBsBanner('competition_<?=$competitionData['competition_id'];?>_PH', 'competition_bs_banner');</script>
	 *
	 * or
	 *
	 * <div id="competition_bs_banner" style="display: none;"></div>
	 <script type="text/javascript">
	 rsBanners.getBsBanner('competition_<?=$competitionData['competition_id'];?>_PH')
	 .done(function (banner) {
					$('#competition_bs_banner').html(banner).show();
				});
	 </script>
	 *
	 */
	my.getBsBanner = function(position, div_id) {
		cln('rsBanners - getBsBanner - ' + position + ', ' + div_id);
		try {
			if (typeof position == "undefined") {
				cl('position?????');
				return '';
			}
			var is_id = typeof div_id != "undefined"

			var ajax = jQuery.ajax({
				type: 'GET',
				url: _SITE_URL + 'rsbanners/showBsPosition/' + position,
				//data: {'fid':fid,'mode':mode},
				cache: false,
				success: function(response)
				{
					if (is_id) {
						$('#' + div_id).html(response);
						if (response != '') {
							$('#' + div_id).show();
						}
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					cle(errorThrown);
				}
			});
			if (!is_id) {
				return ajax;
			}
		} catch(e) {cle(e);}
	};

	my.getBsBannerAdmin = function() {
		cln('rsBanners - getBsBannerAdmin');
		try {
			jQuery.ajax({
				type: 'GET',
				url: _SITE_URL + 'rsbanners/bsAdminPanel/',
				//data: {'fid':fid,'mode':mode},
				cache: false,
				success: function(response)
				{
					$('body').append(response);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					cle(errorThrown);
				}
			});
		} catch(e) {cle(e);}
	};

	my.loadPrBannerAdmin = function() {
		cln('rsBanners.loadPrBannerAdmin');
		try {
			jQuery.ajax({
				type: 'GET',
				url: _SITE_URL + 'rsbanners/prAdminPanel/',
				//data: {'fid':fid,'mode':mode},
				cache: false,
				success: function(response)
				{
					$('body').append(response);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					cle(errorThrown);
				}
			});
		} catch(e) {cle(e);}
	};

	return my;
}(jQuery));

$(document).ready(function() {

	$('#rotating_type_selector').on('change',function(){
		rsBanners.changeRotatingBannerType($(this));
	});


});








