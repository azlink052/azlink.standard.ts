/**
 ***********************************************
 *
 * Instagramのfeedを表示する
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2021.05.07
 *
 ***********************************************
 */
(function($) {

	const pluginName = 'instaFeed';
	let options;

	const methods = {
		init: function(params) {
			options = $.extend({
        igID: '', // InstagramビジネスアカウントID
        count: 0, // 最大表示件数
        token: '', // トークン
				version: '', // Graph API バージョン
        elem: this,
				onComplete: false
			}, params);

      if (!options.igID || !options.token) return false;
      if (!options.count) options.count = 5;
      if (!options.version) options.version = '3.0';

      methods.run.apply(this);

			return this;
		},
		run: function() {
			console.log(options.igID)
      $.ajax({
    		type: 'GET',
    		url: 'https://graph.facebook.com/v' + options.version + '/' + options.igID + '?fields=name%2Cmedia.limit(' + options.count + ')%7Bcaption%2Clike_count%2Cmedia_url%2Cpermalink%2Cmedia_type%2Cthumbnail_url%2Ctimestamp%2Cusername%7D&access_token=' + options.token,
    		dataType: 'json',
        cache: false,
        beforeSend: function() {
        }
      }).done(function(data) {
        // console.log(data)
        if (data.media.data.length > 1) {
          let src = '';
          const insta = data.media.data;
          for (let i = 0; i < insta.length; i++) {
						if (insta[i].media_type !== 'VIDEO') {
							src += '<div class="instaItem"><a href="' + insta[i].permalink + '" target="_blank"><img src="' + insta[i].media_url + '"></a></div>';
						} else {
							src += '<div class="instaItem"><a href="' + insta[i].permalink + '" target="_blank"><img src="' + insta[i].thumbnail_url + '"></a></div>';
						}
          }
          options.elem.append(src);

					if (typeof options.onComplete === 'function') {
		        options.onComplete();
		      }
        }
      });

			return this;
		},
		destroy: function() {
			$(elem).empty();

      return this;
		}
	};

	$.fn[pluginName] = function(method) {
		if ( methods[method] ) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
			return this;
		}
	};

}(jQuery));
