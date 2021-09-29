/**
 ***********************************************
 * 
 * フィード用jsonを取得
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <http://www.azlink.jp>
 * @final 		2018.05.29
 * 
 ***********************************************
 */
(function($) {

  const pluginName = 'getFeedJson';
  let options;
  let $jq;

  const methods = {
    init: function(params) {
      $jq = this;

      options = $.extend({
        url: '',
        count: '5'
      }, params);

      if (options.url !== '') methods.run;

      return this;
    },
    run: function() {
      $.ajax({
        type: 'GET',
        url: 'https://azlink052.sakura.ne.jp/common/apps/getFeedJson.php',
        data: {
          url: options.url,
          count: options.count
        },
        dataType: 'jsonp',
        jsonpCallback: 'result',
        success: function(json) {
          return json;
        }
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