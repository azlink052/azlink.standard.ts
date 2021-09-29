/**
 ***********************************************
 *
 * 指定クラスの幅・高さを統一
 * 画像がある場合も読み込みを待って実行
 * ！必須ライブラリ flow.min.js
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2020.04.23
 *
 ***********************************************
 */
(function($) {

  const pluginName = 'adjustSize';
  let options;

  const methods = {
    init: function(params) {
      options = $.extend({
        type: 'normal',
        plus: 0
      }, params);

      methods.adjust.apply(this);

      return this;
    },
    adjust: function() {
      let setHeight = 0,
        count = 0,
        length = this.length,
        target = this;

      this.height('auto');

      this.each(function() {
        let getHeight = 0,
          imgs = new Array,
          flow = false,
          item = $(this);

        $(this).find('img').each(function() {
          imgs.push($(this).attr('src'));
        });

        if (imgs.length) {
          flow = new Flow(imgs.length, callback);

          isImagesLoaded(flow, imgs);
        } else {
          callback();
        }

        function isImagesLoaded(f, imgs) {
          $.each(imgs, function(i, val) {
            $('<img>').attr('src', val);

            var imgPreLoader = new Image();
            imgPreLoader.onload = function() {
              f.pass(val);
            };
            imgPreLoader.onerror = function() {
              f.pass('error');
            };
            imgPreLoader.src = val;
          });
        }

        function callback(err, args) {
          switch (options.type) {
            case 'inner':
              getHeight = item.innerHeight();
              break;
            case 'outer':
              getHeight = item.outerHeight();
              break;
            default:
              getHeight = item.height();
          }

          setHeight = getHeight > setHeight ? getHeight : setHeight;
          count++;
        }
      });

      let timer = setInterval(function() {
        if (count !== length) return;

        switch (options.type) {
          case 'inner':
            target.innerHeight(setHeight + options.plus);
            break;
          case 'outer':
            target.outerHeight(setHeight + options.plus);
            break;
          default:
            target.height(setHeight + options.plus);
        }

        clearInterval(timer);
      }, 50);

      return this;
    },
    destroy: function() {
      switch (options.type) {
        case 'inner':
          this.innerHeight(auto);
          break;
        case 'outer':
          this.outerHeight(auto);
          break;
        default:
          this.height(auto);
      }

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
