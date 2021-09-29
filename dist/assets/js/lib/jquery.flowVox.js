/**
 ***********************************************
 *
 * ボックスのフローアニメーション
 * 一度のみ実行するタイプ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2020.05.03
 *
 * animeObjでwrapしないように変更
 *
 ***********************************************
 */
(function($) {

  const pluginName = 'flowVox';

  const params = new Array;
  let time = '';

  const methods = {
    init: function(options) {
      time = Date.now();
      params[time] = {
        time: time,
        options: '',
        flowAnime: new Array,
        isFlowDefault: false
      }
      params[time].options = $.extend({
        className: pluginName, // 名前空間にも使用
        translate: 60,
        duration: 600,
        delay: 300,
        easing: 'easeOutCubic',
        autorun: true, // 自動実行
        per: $.params.wWidth > $.params.wHeight ? 0.6 : 0.95, // 発火タイミング
        zoomIn: 1.2, // zoomの最大サイズ
        zoomInDuration: 300, // zoonの最大サイズへのデュレーション
        zoomOutDuration: 150 // zoonの元サイズへのデュレーション
      }, options);

      console.log(params[time].options)

      this.each(function(i) {
        const mode = $(this).data('flow') ? $(this).data('flow') : 'up';
        const target = $(this).children().length > 1 ? $(this).children() : $(this);

        switch (mode) {
          case 'down':
            target.css({
              visibility: 'visible'
            }).velocity({
              translateY: -params[time].options.translate,
              opacity: 0
            }, 1);
            break;
          case 'left':
            target.css({
              visibility: 'visible'
            }).velocity({
              translateX: params[time].options.translate,
              opacity: 0
            }, 1);
            break;
          case 'right':
            target.css({
              visibility: 'visible'
            }).velocity({
              translateX: -params[time].options.translate,
              opacity: 0
            }, 1);
            break;
          case 'leftdown':
            target.css({
              visibility: 'visible'
            }).velocity({
              translateX: params[time].options.translate,
              translateY: -params[time].options.translate,
              opacity: 0
            }, 1);
            break;
          case 'rightdown':
            target.css({
              visibility: 'visible'
            }).velocity({
              translateX: -params[time].options.translate,
              translateY: -params[time].options.translate,
              opacity: 0
            }, 1);
            break;
          case 'leftup':
            target.css({
              visibility: 'visible'
            }).velocity({
              translateX: params[time].options.translate,
              translateY: params[time].options.translate,
              opacity: 0
            }, 1);
            break;
          case 'rightup':
            target.css({
              visibility: 'visible'
            }).velocity({
              translateX: -params[time].options.translate,
              translateY: params[time].options.translate,
              opacity: 0
            }, 1);
            break;
          case 'zoom':
            target.css({
              visibility: 'visible'
            }).velocity({
              scale: 0
            }, 1);
            break;
          case 'away':
            target.css({
              visibility: 'visible'
            }).velocity({
              opacity: 0
            }, 1);
            break;
          case 'mark':
            // $(this).parent().unwrap();
            break;
          default:
            target.css({
              visibility: 'visible'
            }).velocity({
              translateY: params[time].options.translate,
              opacity: 0
            }, 1);
        }

        const param = {
          pos: $(this).offset().top,
          isDone: false,
          height: $(this).height(),
          mode: mode
        };

        params[time].flowAnime[i] = function() {
          if ($.params.scrTop > param.pos - ($.params.wHeight * params[time].options.per)) {
            if (param.isDone || !$('.' + params[time].options.className).eq(i).is(':visible')) return;

            $('.' + params[time].options.className).eq(i).each(function() {
              const target = $(this).children().length > 1 ? $(this).children() : $(this);

              switch (param.mode) {
                case 'zoom':
                  if (target.length > 1) {
                    target.each(function(j) {
                      $(this).velocity('stop').velocity({
                        scale: params[time].options.zoomIn
                      }, {
                        duration: params[time].options.zoomInDuration,
                        delay: j * params[time].options.delay,
                        easing: 'easeInQuint',
                        complete: function() {
                          $(this).velocity({
                            scale: 1.0
                          }, {
                            duration: params[time].options.zoomOutDuration
                          });
                        }
                      });
                    });
                  } else {
                    target.velocity('stop').velocity({
                      scale: params[time].options.zoomIn
                    }, {
                      duration: params[time].options.zoomInDuration,
                      easing: 'easeInQuint',
                      complete: function() {
                        $(this).velocity({
                          scale: 1.0
                        }, {
                          duration: params[time].options.zoomOutDuration
                        });
                      }
                    });
                  }
                  break;
                case 'away':
                  if (target.length > 1) {
                    target.each(function(j) {
                      $(this).velocity('stop').velocity({
                        opacity: 1
                      }, {
                        duration: params[time].options.duration,
                        delay: j * params[time].options.delay,
                        easing: params[time].options.easing
                      });
                    });
                  } else {
                    target.velocity('stop').velocity({
                      opacity: 1
                    }, {
                      duration: params[time].options.duration,
                      easing: params[time].options.easing
                    });
                  }
                  break;
                case 'mark':
                  // var target = $(this).parent();
                  // if (options.autodestroy) $(this).children().unwrap();
                  if (target.length > 1) {
                    target.each(function(j) {
                      $(this).delay(j * params[time].options.delay).queue(function() {
                        $(this).addClass('flowActive');
                      });
                    });
                  } else {
                    target.addClass('flowActive');
                  }
                  break;
                default:
                  if (target.length > 1) {
                    target.each(function(j) {
                      $(this).velocity('stop').velocity({
                        translateX: 0,
                        translateY: 0,
                        opacity: 1
                      }, {
                        duration: params[time].options.duration,
                        delay: j * params[time].options.delay,
                        easing: params[time].options.easing
                      });
                    });
                  } else {
                    target.velocity('stop').velocity({
                      translateX: 0,
                      translateY: 0,
                      opacity: 1
                    }, {
                      duration: params[time].options.duration,
                      easing: params[time].options.easing
                    });
                  }
              }
            });

            param.isDone = true;
          }
        };

        if (params[time].options.autorun) methods.run(params[time].flowAnime[i]);
      });

      params[time].isFlowDefault = false;

      return this;
    },
    run: function(fa) {
      // 対象の指定がない場合、flowAnime(配列)に対して行う
      const event = 'scroll.' + params[time].options.className;
      if (fa) {
        $(window).on('scroll.' + params[time].options.className, fa).scroll();
      } else {
        $.each(params[time].flowAnime, function() {
          $(window).on('scroll.' + params[time].options.className, this).scroll();
        });
      }

      return this;
    },
    destroy: function() {
      $(window).off('scroll.' + params[time].options.className);

      return this.each(function(i) {
        $(this).removeClass('flowActive');
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
