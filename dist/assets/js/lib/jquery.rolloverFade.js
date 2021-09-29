/**
 ***********************************************
 * 
 * ホバーでフェードするアニメーション
 * _off, _on の画像を用意
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <http://www.azlink.jp>
 * @final 		2017.07.30
 * 
 ***********************************************
 */
(function($) {

	var pluginName = 'rolloverFade';
	var options;

	var methods = {
		init: function(params) {
			options = $.extend({
				durationOver: 300,
				durationOut: 200
			}, params);

			return methods.fade.apply(this);
		},
		fade: function() {
			return this.each(function(i) {
				if (!$.params.isIE6 && !$.params.isIE7 && !$.params.isIE8) {
					if (this.src.match('_off')) {
						this.rollOverImg = new Image();
						this.rollOverImg.src = this.getAttribute('src').replace('_off', '_on');
						$(this.rollOverImg).css({
							position: 'absolute',
							opacity: 0
						}).addClass('rofImg');
						$(this).before(this.rollOverImg);

						$(this.rollOverImg).on({
							'mouseenter.roFadeImg': function() {
								$(this).stop().animate({
									opacity: 1
								}, {
									duration: options.durationOver,
									queue: false
								});
							},
							'mouseleave.roFadeImg': function() {
								$(this).stop().animate({
									opacity: 0
								}, {
									duration: options.durationOut,
									queue: false
								});
							}
						});
					}
				} else {
					$(this).on({
						'mouseenter.roFadeImg': function() {
							var imgSrcOver = $(this).attr('src').replace('_off', '_on');
							$(this).attr('src', imgSrcOver);
						},
						'mouseleave.roFadeImg': function() {
							var imgSrcOut = $(this).attr('src').replace('_on', '_off');
							$(this).attr('src', imgSrcOut);
						}
					});
				}
			});
		},
		destroy: function() {
			return this.each(function(i) {
				$(window).off('.roFadeImg');
				$('.rofImg').remove();
			});
		}
	};

	$.fn[pluginName] = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
			return this;
		}
	};

}(jQuery));