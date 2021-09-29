/**
 * ================================================
 *
 * [javascript Common]
 * 必須ライブラリ : jQuery, velocity, adjustSize
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2020.11.15
 *
 * ================================================
 */
/**
 * global params
 */
$.params = {
  qsParm: new Array(), // GETパラメータ
  userAgent: '',
  browserIE: 0, // IE判定
  browser_v: 0, // IEバージョン番号
  browser_n: '', // browser名
  ua: '', // UA
  isIE: false, // IE判定
  isIE6: false, // IE6判定
  isIE7: false, // IE7判定
  isIE8: false, // IE8判定
  isIE9: false, // IE9判定
  isIE10: false, // IE10判定
  isIE11: false, // IE11判定
  isEdge: false, // Edge判定
  isiPhone: false, // iPhone判定
  isiPad: false, // iPad判定
  isiPod: false, // iPod判定
  isAndroid: false, // Android判定
  isWinPhone: false, // WinPhone判定
  isMobile: false, // Mobile判定 (getMobile結果)
  isNavOpen: false, // メニュー開閉判定(スマフォメニューなどに使用)
  spBreakPoint: 768, // ブレークポイント
  wWidth: 0, // ウィンドウ幅
  wHeight: 0, // ウィンドウ高さ
  wIWidth: 0, // ウィンドウ幅 (innerWidth)
  wIHeight: 0, // ウィンドウ高さ (innerHeight)
  wIWidthCache: 0, // ウィンドウ幅のキャッシュ (innerWidth)
  wIHeightCache: 0, // ウィンドウ高のキャッシュ (innerWidth)
  dspWidth: parseInt(window.parent.screen.width), // 画面の幅
  dspHeight: parseInt(window.parent.screen.height), // 画面の高さ
  isRespMode: false, // レスポンシブ判定
  isChangeWWidth: false, // 画面幅の変更判定
  isChangeWHeight: false, // 画面高の変更判定
  isPageTopShow: false, // pagetop表示判定
  pageTopPoint: 100, // pagetop表示Y座標
  scrTop: 0, // Y軸スクロール量
  scrLeft: 0, // X軸スクロール量
  orgMode: null, // ロード時のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
  currentMode: null, // 現在のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
  isChangeMode: false, // レスポンシブ状態が変更になったらtrue
  viewOriMode: 'landscape', // 画面モード landscape / portrait
  isDebug: false, // デバッグモード判定
  rTimer: {}, // イベント制御用タイマー
  resizeTimer: false, // イベント制御用タイマー
  tmp: {} // 作業用
};
// jQuery不要なパラメータのセット
$.params.tmp.query = window.location.search.substring(1);
$.params.tmp.parms = $.params.tmp.query.split('&');

for (let i = 0; i < $.params.tmp.parms.length; i++) {
  const pos = $.params.tmp.parms[i].indexOf('=');

  if (pos > 0) {
    const key = $.params.tmp.parms[i].substring(0, pos);
    const val = $.params.tmp.parms[i].substring(pos +1);

    $.params.qsParm[key] = val;
  }
}

$.params.wHeight = parseInt(document.documentElement.clientHeight);
$.params.wWidth = parseInt(document.documentElement.clientWidth);
$.params.wIWidth = parseInt(window.innerWidth);
$.params.wIHeight = parseInt(window.innerHeight);
$.params.isRespMode = $.params.wIWidth < $.params.spBreakPoint ? true : false;
$.params.orgMode = $.params.currentMode = $.params.isRespMode ? 2 : 1;

$.params.ua = window.navigator.userAgent.toLowerCase();
$.params.isIE = $.params.ua.indexOf('msie') >= 0 || $.params.ua.indexOf('trident') >= 0;

if ($.params.isIE) {
  a = /(msie|rv:?)\s?([\d\.]+)/.exec($.params.ua);
  v = (a) ? a[2] : '';

  $.params.isIE6 	= v.indexOf('6.', 0) === 0 ? true :false,
  $.params.isIE7 	= v.indexOf('7.', 0) === 0 ? true :false,
  $.params.isIE8 	= v.indexOf('8.', 0) === 0 ? true :false,
  $.params.isIE9 	= v.indexOf('9.', 0) === 0 ? true :false,
  $.params.isIE10 = v.indexOf('10.', 0) === 0 ? true :false,
  $.params.isIE11 = v.indexOf('11.', 0) === 0 ? true :false;
}

$.params.isEdge = $.params.ua.indexOf('edge') >= 0;

if (/*@cc_on!@*/false) {
  $.params.userAgent = window.navigator.userAgent,
  $.params.ua = window.navigator.userAgent.toLowerCase();

  $.params.browserIE = 1;
  $.params.browser_n = 'IE';

  if ($.params.userAgent.match(/MSIE (¥d¥.¥d+)/)) {$.params.browser_v = parseFloat(RegExp.$1);}//IE6.7.8.9

  }
  else if ($.params.ua.indexOf('firefox') > -1) {$.params.browser_n = 'Firefox';}
  else if ($.params.ua.indexOf('opera') > -1) {$.params.browser_n = 'Opera';}
  else if ($.params.ua.indexOf('chrome') > -1) {$.params.browser_n = 'Chrome';}
  else if ($.params.ua.indexOf('safari') > -1) {$.params.browser_n = 'Safari';}
  else {
  $.params.browser_n = 'Unknown';
}

$.params.ua = window.navigator.userAgent.toLowerCase();

$.params.isiPhone 	= $.params.ua.indexOf('iphone') != -1 ? true : false,
$.params.isiPad 	= $.params.ua.indexOf('ipad') != -1 || $.params.ua.indexOf('macintosh') != -1 && 'ontouchend' in document ? true : false,
$.params.isiPod 	= $.params.ua.indexOf('ipod') != -1 ? true : false,
$.params.isAndroid 	= $.params.ua.indexOf('android') != -1 || $.params.ua.indexOf('android') != -1 ? true : false,
$.params.isWinPhone = $.params.ua.indexOf('windows phone') != -1 ? true : false;

$.params.isMobile = $.params.isiPhone || $.params.isiPad || $.params.isiPod || $.params.isAndroid || $.params.isWinPhone ? true : false;
/**
 * functions
 */
$.main = {
  /**
   * 実行
   * OFFにしたいものはfalseを渡す
   * 例) $.main.init({setWb: false})
   * ブレークポイント等パラメータの変更はinitの前に行う
   * $.params.spBreakPoint = 968
   * $.main.init()
   */
  init: function(params) {
    // console.log('setWb' in params)
    params = typeof params === 'undefined' ? {} : params;
    const opts = {
      // setWb: 'setWb' in params && params.setWb === false ? false : true,
      setGETqs: 'setGETqs' in params && params.setGETqs === false ? false : true,
      checkRespMode: 'checkRespMode' in params && params.checkRespMode === false ? false : true,
      // setWbVer: 'setWbVer' in params && params.setWbVer === false ? false : true,
      sScroll: 'sScroll' in params && params.sScroll === false ? false : true,
      getScrPos: 'getScrPos' in params && params.getScrPos === false ? false : true,
      // getMobile: 'getMobile' in params && params.getMobile === false ? false : true,
      roImg: 'roImg' in params && params.roImg === false ? false : true,
      roOpa: 'roOpa' in params && params.roOpa === false ? false : true,
      adjList: 'adjList' in params && params.adjList === false ? false : true,
      pageTop: 'pageTop' in params && params.pageTop === false ? false : true,
      toggleSPTel: 'toggleSPTel' in params && params.toggleSPTel === false ? false : true,
      initDebug: 'initDebug' in params && params.initDebug === false ? false : true
    };
    // console.log(opts)
    // if (opts.setWb) $.main.setWb();
    if (!opts.setGETqs === false) $.main.setGETqs();
    if (!opts.checkRespMode === false) $.main.checkRespMode();
    // if (!opts.setWbVer === false) $.main.setWbVer();
    if (!opts.sScroll === false) $.main.sScroll();
    if (!opts.getScrPos === false) $.main.getScrPos();
    // if (!opts.getMobile === false) $.main.getMobile();
    if (!opts.roImg === false) $.main.roImg();
    if (!opts.roOpa === false) $.main.roOpa();
    if (!opts.adjList === false) $.main.adjList();
    if (!opts.pageTop === false) $.main.pageTop();
    if (!opts.toggleSPTel === false) $.main.toggleSPTel();
    if (!opts.initDebug === false) $.main.initDebug();
    $(window).on('resize.checkRespMode', function() {
      if ($.params.rTimer.checkRespMode !== false) {
				clearTimeout($.params.rTimer.checkRespMode);
			}
			$.params.rTimer.checkRespMode = setTimeout(function() {
        if (!opts.checkRespMode === false) $.main.checkRespMode();
			}, 250);
  	});
    $(window).on('resize.toggleSPTel', function() {
      if ($.params.rTimer.toggleSPTel !== false) {
				clearTimeout($.params.rTimer.toggleSPTel);
			}
			$.params.rTimer.toggleSPTel = setTimeout(function() {
        if (!opts.toggleSPTel === false) $.main.toggleSPTel();
			}, 250);
  	});
    // console.log($._data($(window).get(0), "events"))
    $(window).on('scroll.getScrPos', function() {
      if (!opts.getScrPos === false) $.main.getScrPos();
  	});
    $(window).on('scroll.pageTop', function() {
      if (!opts.pageTop === false) $.main.pageTop();
  	});
  },
	/**
	 * デバッグの準備
	 */
	initDebug: function() {
		if (!$.params.isDebug) return;

		$('<div id="pDebug" />').prependTo('body').css({
			position: 'fixed',
			zIndex: 99999,
			top: 0,
			right: 0,
			backgroundColor: 'rgba(0,0,0,0.8)',
			color: '#FFFFFF',
			padding: 10,
			height: '100%',
			overflow: 'auto'
		});

		$('#pDebug').append('<div><a href="javascript:void(0)" class="toggle" style="color: #FFFFFF;">HIDE</a></div><div class="inner" />');

		$(document).on('click', '#pDebug .toggle', function() {
			$('#pDebug .inner').toggle();
      if ($('#pDebug .inner').is(':visible')) {
        $('#pDebug .toggle').text('HIDE');
      } else {
        $('#pDebug .toggle').text('SHOW');
      }
		});

		$.main.showDebug();

		$(window).on('resize scroll', function() {
			if ($.params.rTimer.debug !== false) {
				clearTimeout($.params.rTimer.debug);
			}

			$.params.rTimer.debug = setTimeout(function() {
				$.main.showDebug();
			}, 500);
		});
	},
	/**
	 * デバッグ情報の出力
	 */
	showDebug: function() {
		let src = '';

		$.each($.params, function(key, val) {
			src += '<div><span style="font-weight: bold;">' + key + '</span> : ' + val + '</div>';
		});

		$('#pDebug .inner').html(src);
	},
	/**
	 * strict対策blank open
	 * @param 開くURL
	 */
	openBlank: function(url) {
		window.open(url);
	},
	/**
	 * 画像の先読み
	 * @param 画像配列
	 */
	preloadImg: function(arguments) {
		if (!arguments) return;

		for(var i = 0; i < arguments.length; i++) {
			$('<img>').attr('src', arguments[i]);
		}
	},
	/**
	 * GET値の取得
	 * @return GET値をセットしたグローバル変数qsParm
	 */
	setGETqs: function() {
		return $.params.qsParm;
	},
	/**
	 * ブラウザ判定
	 */
	setWb: function() {
		$.params.ua = window.navigator.userAgent.toLowerCase();
		$.params.isIE = $.params.ua.indexOf('msie') >= 0 || $.params.ua.indexOf('trident') >= 0;

		if ($.params.isIE) {
			a = /(msie|rv:?)\s?([\d\.]+)/.exec($.params.ua);
			v = (a) ? a[2] : '';

			$.params.isIE6 	= v.indexOf('6.', 0) === 0 ? true :false,
			$.params.isIE7 	= v.indexOf('7.', 0) === 0 ? true :false,
			$.params.isIE8 	= v.indexOf('8.', 0) === 0 ? true :false,
			$.params.isIE9 	= v.indexOf('9.', 0) === 0 ? true :false,
			$.params.isIE10 = v.indexOf('10.', 0) === 0 ? true :false,
			$.params.isIE11 = v.indexOf('11.', 0) === 0 ? true :false;
		}

    $.params.isEdge = $.params.ua.indexOf('edge') >= 0;
	},
	/**
	 * Webブラウザバージョンの取得
	 */
	setWbVer: function() {
		if (/*@cc_on!@*/false) {
			$.params.userAgent = window.navigator.userAgent,
			$.params.ua = window.navigator.userAgent.toLowerCase();

			$.params.browserIE = 1;
			$.params.browser_n = "IE";

			if ($.params.userAgent.match(/MSIE (¥d¥.¥d+)/)) {$.params.browser_v = parseFloat(RegExp.$1);}//IE6.7.8.9

			}
			else if ($.params.ua.indexOf("firefox") > -1) {$.params.browser_n = "Firefox";}
			else if ($.params.ua.indexOf("opera") > -1) {$.params.browser_n = "Opera";}
			else if ($.params.ua.indexOf("chrome") > -1) {$.params.browser_n = "Chrome";}
			else if ($.params.ua.indexOf("safari") > -1) {$.params.browser_n = "Safari";}
			else {
			$.params.browser_n = "Unknown";
		}
	},
	/**
	 * 画像切り替えロールオーバー
	 */
	roImg: function() {
		var imgCache = new Array;

		$(document).on({
			mouseenter: function() {
				if ($.params.isRespMode) return;

				var imgSrc 		= $(this).attr('src'),
					imgSrcDot 	= imgSrc.lastIndexOf('.'),
					imgSrcOver 	= imgSrc.substr(0, imgSrcDot) + '_on' + imgSrc.substr(imgSrcDot, 4);

				imgCache[$(this)] = imgSrc;

				$(this).attr('src', imgSrcOver);
			},
			mouseleave: function() {
				if ($.params.isRespMode) return;

				$(this).attr('src', imgCache[$(this)]);
			}
		}, 'a > .roImg');
	},
	/**
	 * 画像透明度ロールオーバー
	 */
	roOpa: function() {
		$(document).on({
			mouseenter: function() {
				$(this).fadeTo(300, 0.7);
			},
			mouseleave: function() {
				$(this).stop(true, true).fadeTo(300, 1.0);
			}
		}, '.jqHover');
	},
	/**
	 * 単純な高さ合わせ
	 */
	adjList: function() {
		adjust();

		function adjust() {
			$('.adjList').each(function() {
				$(this).children().adjustSize();
			});
		}

		$(window).on('resize', function() {
			if ($.params.rTimer.adjList !== false) {
				clearTimeout($.params.rTimer.adjList);
			}
			$.params.rTimer.adjList = setTimeout(function() {
				adjust();
			}, 500);
		});
	},
	/**
	 * スムーススクロール
	 * @param オフセット値
	 * @param スピード
	 * @param イージング
	 */
	sScroll: function(offset, duration, easing) {
		$(document).on('click.sScroll', 'a[href*="#"].scroll, area[href*="#"].scroll', function() {
			var $anchor = $(this).prop('href'),
				$anchorURL = $anchor.split('#')[0],
				$current = location.href,
				$currentURL = $current.split('#')[0];

			if ($anchorURL === $currentURL) {
				$target = $anchor.split('#'),
				$target = $target.pop(),
				$target = '#' + $target;

				var duration = duration !== 500 && $.isNumeric(duration) ? duration : 500,
					easing = easing !== 'easeInQuad' ? easing : 'easeInQuad';

				$($target).velocity('stop').velocity('scroll', {
					offset: offset,
					duration:duration,
					easing: easing
				});

				return false;
			}
		});
	},
	/**
	 * レスポンシブ状態のチェック
	 * ※画面の内寸で比較するので要素がbody幅を超えている場合結果に注意
	 * その場合は $.params.wWidth < $.params.spBreakPoint などで適宜比較する
	 */
	checkRespMode: function() {
    $.params.wHeight = parseInt(document.documentElement.clientHeight);
    $.params.wWidth = parseInt(document.documentElement.clientWidth);
    $.params.wIWidth = parseInt(window.innerWidth);
    $.params.wIHeight = parseInt(window.innerHeight);
    $.params.isRespMode = $.params.wIWidth < $.params.spBreakPoint ? true : false;

    oldMode = $.params.currentMode;
    $.params.currentMode = $.params.isRespMode ? 2 : 1;
    $.params.isChangeMode = oldMode !== $.params.currentMode ? true : false;

		$('body').removeClass($.params.viewOriMode);
		$.params.viewOriMode = $.params.wIHeight > $.params.wIWidth ? 'portrait' : 'landscape';
		$.params.isChangeWWidth = $.params.wIWidthCache !== $.params.wIWidth ? true : false;
		$.params.isChangeWHeight = $.params.wIHeightCache !== $.params.wIHeight ? true : false;

		$('body').addClass($.params.viewOriMode);
	},
	/**
	 * スクロール位置の取得
	 */
	getScrPos: function() {
		$.params.scrTop = $(window).scrollTop(),
		$.params.scrLeft = $(window).scrollLeft();
	},
	/**
	 * 標準的なpagetop(表示／非表示のみ)
	 * 表示ポイントをpageTopPointに設定
	 * 後から追加する要素には未対応
	 */
	pageTop: function() {
    if (!$('#pageTopVox').get(0)) return;
		if ($.params.scrTop > $.params.pageTopPoint) {
			if (!$.params.isPageTopShow) {
				$.params.isPageTopShow = true;
				$('#pageTopVox').velocity('stop').show().velocity({
					opacity: 1
				}, 100);
			}
		} else {
			if ($.params.isPageTopShow) {
				$.params.isPageTopShow = false;
				$('#pageTopVox').velocity('stop').velocity({
					opacity: 0
				}, 100, function() {
					$(this).hide();
				});
			}
		}
	},
	/**
	 * iPhone / iPad / iPod / Android / winPhone 判定
	 */
	getMobile: function() {
		$.params.ua = window.navigator.userAgent.toLowerCase();

		$.params.isiPhone 	= $.params.ua.indexOf('iphone') != -1 ? true : false,
		$.params.isiPad 	= $.params.ua.indexOf('ipad') != -1 || $.params.ua.indexOf('macintosh') != -1 && 'ontouchend' in document ? true : false,
		$.params.isiPod 	= $.params.ua.indexOf('ipod') != -1 ? true : false,
		$.params.isAndroid 	= $.params.ua.indexOf('android') != -1 || $.params.ua.indexOf('android') != -1 ? true : false,
		$.params.isWinPhone = $.params.ua.indexOf('windows phone') != -1 ? true : false;

		$.params.isMobile = $.params.isiPhone || $.params.isiPad || $.params.isiPod || $.params.isAndroid || $.params.isWinPhone ? true : false;
	},
	/**
	 * SP時電話番号自動リンク
	 * 対象にdata-tel=""で番号指定
	 */
	toggleSPTel: function() {
		if (!$.params.isRespMode) {
			$('.spTel').each(function() {
				if ($(this).parent().is('a')) {
					$(this).unwrap();
				}
			});
		} else {
			$('.spTel').each(function() {
				var tel = $(this).data('tel');
				if (!$(this).parent().is('a')) {
					$(this).wrap('<a href="tel:' + tel + '" />');
				}
			});
		}
	},
	/**
	 * コンテンツを比率に合わせ変形
	 * init時指定パラメータ(配列)
	 * w: 基準とする幅 (int)
	 * bp: 実行する幅を指定 (int)
	 */
	ratioAdjust: {
		params: {
			r: 1,
			h: new Array,
			w: 375,
			bp: $.params.spBreakPoint,
			to: 'left top'
		},
		init: function(options) {
			if (options && options.w) $.main.ratioAdjust.params.w = options['w'];
			if (options && options.bp) $.main.ratioAdjust.params.bp = options['bp'];
			if (options && options.to) $.main.ratioAdjust.params.to = options['to'];

			setTimeout(function() {
				$.main.ratioAdjust.setH();
				$.main.ratioAdjust.adjust();
			}, 1500);

			$(window).on('resize.rAdjust', function() {
				if ($.params.rTimer.ratio !== false) {
					clearTimeout($.params.rTimer.ratio);
				}

				$.params.rTimer.ratio = setTimeout(function() {
					$.main.ratioAdjust.adjust();

					if ($.params.isChangeMode) {
						$.main.ratioAdjust.reset();
					}
				}, 1000);
			});
		},
		setH: function() {
			$('.rAdjust').each(function(i) {
				$(this).height('auto');
				$.main.ratioAdjust.params.h[i] = $(this).height();
			});
		},
		setR: function() {
			ratio = $.params.wWidth < $.main.ratioAdjust.params.bp ? window.innerWidth / $.main.ratioAdjust.params.w : 1,
			$.main.ratioAdjust.params.r = ratio.toFixed(2);
			// console.log($.main.ratioAdjust.params.r);
		},
		adjust: function() {
			$.main.ratioAdjust.setR();

			$('.rAdjust').each(function(i) {
				$(this).css({
					transformOrigin: $.main.ratioAdjust.params.to,
					transform: 'scale(' + $.main.ratioAdjust.params.r + ')'
				});
				if ($.main.ratioAdjust.params.r > 1 || $.main.ratioAdjust.params.r < 1) {
					h = $.params.wWidth < $.main.ratioAdjust.params.bp ? $.main.ratioAdjust.params.h[i] * $.main.ratioAdjust.params.r : 'auto';
				} else {
					h = 'auto';
				}
				$(this).height(h);
			});
		},
		destroy: function() {
			$(window).off('resize.rAdjust');

			$('.rAdjust').css({
				transform: 'scale(1)',
				height: 'auto'
			});
		},
		reset: function() {
			$.main.ratioAdjust.destroy();
			$.main.ratioAdjust.init();
		}
	}
};
