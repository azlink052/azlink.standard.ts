/**
 ***********************************************
 *
 * 画像をSP用に差し替え
 * 頭にSP_のついた画像を用意
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2020.04.23
 *
 ***********************************************
 */
(function($) {

  const pluginName = 'replaceImageSP';
  let options;
  let $jq;

  const methods = {
    init: function(params) {
      $jq = this;

      options = $.extend({
        pcName: 'PC_',
        spName: 'SP_',
        breakPoint: 768
      }, params);

      methods.replace.apply(this);

      $(window).on('resize.rplSPImg', methods.replace);

      return this;
    },
    replace: function() {
      return $jq.each(function(i) {
        if (parseInt($(window).width()) >= options.breakPoint) {
          // $this.attr('src', $this.attr('src').replace(options.spName, options.pcName)).css('visibility', 'visible');
          $(this).attr('src', $(this).attr('src').replace(options.spName, options.pcName));
        } else {
          // $this.attr('src', $this.attr('src').replace(options.pcName, options.spName)).css('visibility', 'visible');
          $(this).attr('src', $(this).attr('src').replace(options.pcName, options.spName));
        }
      });
    },
    destroy: function() {
      $(window).off('.rplSPImg');

      return this;
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
