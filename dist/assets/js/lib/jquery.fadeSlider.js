/**
 ***********************************************
 *
 * フェード効果のあるスライダ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <http://www.azlink.jp>
 * @final 		2020.09.14
 *
 ***********************************************
 */
(function($) {

  const pluginName = 'fadeSlider';

  const params = new Array;
  let time = '';

  const methods = {
    init: function(options) {
      time = Date.now();
      params[time] = {
        time: time,
        options: '',
        elem: this,
        current: 0,
        count: 0,
        isAllowSlide: false,
        timer: false,
      }
      params[time].options = $.extend({
        isAuto: true,
        isLoop: true,
        isChangeOpacity: true,
        pause: 5000,
        speed: 500,
        easing: 'easeInCubic',
        ctrl: false,
        pager: false,
        wrapper: params[time].elem.parent(),
        activeIndexInt: 52,
        oldIndexInt: 51,
        etcIndexInt: 50,
        onSliderLoad: false,
        onSlideBefore: new Array, // oldIndex, newIndex
        onSlideAfter: new Array // oldIndex, newIndex
      }, options);
      if (params[time].options.pause < params[time].options.speed) {
        params[time].options.speed = params[time].options.pause - 1;
      }
      params[time].count = params[time].elem.children().length;
      params[time].elem.css({
        position: 'relative'
      });
      // console.log(params[time])
      params[time].elem.children().css({
        opacity: params[time].options.isChangeOpacity ? 0 : 1,
        zIndex: params[time].options.etcIndexInt,
        position: 'absolute',
        left: 0,
        top: 0
      }).eq(params[time].current).css({
        opacity: params[time].options.isChangeOpacity ? 1 : 1,
        zIndex: params[time].options.activeIndexInt
      });
      if (params[time].options.ctrl) {
        params[time].options.wrapper.append('<div class="fs-ctrls"><div class="fs-ctrls-direction" /></div>');
        params[time].options.wrapper.find('.fs-ctrls-direction').append('<a class="fs-prev" href="javascript:void(0)" data-time="' + time + '">Prev</a><a class="fs-next" href="javascript:void(0)" data-time="' + time + '">Next</a>');
        params[time].options.wrapper.find('.fs-prev').on('click.fsPager' + params[time].time, function() {
          if (!params[time].isAllowSlide) return;
          const thisTime = $(this).data('time');
          methods.change(thisTime, methods.getPrevSlide(thisTime) + '');
        });
        params[time].options.wrapper.find('.fs-next').on('click.fsPager' + params[time].time, function() {
          if (!params[time].isAllowSlide) return;
          const thisTime = $(this).data('time');
          methods.change(thisTime, methods.getNextSlide(thisTime) + '');
        });
      }
      if (params[time].options.pager) {
        params[time].options.wrapper.append('<div class="fs-pager" />');
        for (let i = 0; i < params[time].count; i++) {
          params[time].options.wrapper.find('.fs-pager').append('<div class="fs-pager-item"><a href="javascript:void(0)" data-index="' + i + '" data-time="' + time + '">' + (i + 1) + '</a></div>');
        }
        params[time].options.wrapper.find('.fs-pager-item').eq(params[time].current).find('a').addClass('active');
        params[time].options.wrapper.find('.fs-pager-item a').on('click.fsPager' + params[time].time, function() {
          if (!params[time].isAllowSlide) return;
          const index = $(this).data('index'); // 文字列変換
          const thisTime = $(this).data('time');
          methods.change(thisTime, index + '');
        });
      }
      params[time].isAllowSlide = true;
      methods.slideAuto(params[time].time);
      if (typeof params[time].options.onSliderLoad === 'function') {
        params[time].options.onSliderLoad(time);
      }

      return this;
    },
    change: function(thisTime, target) {
      clearTimeout(params[thisTime].timer);
      if (!params[thisTime].isAllowSlide) return;
      params[thisTime].isAllowSlide = false;
      const oldIndex = params[thisTime].current;
      const newIndex = target >= 0 ? parseInt(target) : (params[thisTime].current !== params[thisTime].count - 1 ? params[thisTime].current + 1 : 0);
      params[thisTime].current = newIndex === params[thisTime].count ? 0 : newIndex;
      if (typeof params[thisTime].options.onSlideBefore === 'function') {
        params[thisTime].options.onSlideBefore(oldIndex, newIndex);
      }
      if (params[thisTime].options.pager) methods.togglePager(thisTime);
      params[thisTime].elem.children().removeClass('slide-old slide-active');
      // console.log(oldIndex, newIndex)
      params[thisTime].elem.children().css({
        zIndex: params[time].options.etcIndexInt
      });
      params[thisTime].elem.children().eq(oldIndex).css({
        zIndex: params[time].options.oldIndexInt
      }).addClass('slide-old');
      params[thisTime].elem.children().eq(params[thisTime].current).css({
        zIndex: params[time].options.activeIndexInt
      }).addClass('slide-active').velocity('stop').velocity({
        opacity: params[thisTime].options.isChangeOpacity ? 1 : 1
      }, {
        duration: params[thisTime].options.speed,
        complete: function() {
          // var oldIndex = current !== 0 ? current - 1 : count - 1;
          if (typeof params[thisTime].options.onSlideAfter === 'function') {
            params[thisTime].options.onSlideAfter(oldIndex, params[thisTime].current);
          }
          params[thisTime].elem.children().not(':eq(' + params[thisTime].current + ')').css({
            opacity: params[thisTime].options.isChangeOpacity ? 0 : 1
          });
          params[thisTime].isAllowSlide = true;
          if (params[thisTime].options.isLoop) {
            methods.slideAuto(thisTime);
          } else {
            if (params[thisTime].current !== params[thisTime].count - 1) {
              methods.slideAuto(thisTime);
            }
          }
        }
      });

      return this;
    },
    togglePager: function(thisTime) {
      params[thisTime].options.wrapper.find('.fs-pager-item a').removeClass('active');
      params[thisTime].options.wrapper.find('.fs-pager-item').eq(params[thisTime].current).find('a').addClass('active');

      return this;
    },
    slideAuto: function(thisTime) {
      if (!params[thisTime].isAllowSlide || !params[thisTime].options.isAuto) return;
      methods.startSlideAuto(thisTime);

      return this;
    },
    startSlideAuto: function(thisTime) {
      params[thisTime].isAllowSlide = params[thisTime].options.isAuto = true;
      params[thisTime].timer = setTimeout(function() {
        methods.change(thisTime);
      }, params[thisTime].options.pause);

      // return this;
    },
    stopAuto: function(thisTime) {
      clearTimeout(params[thisTime].timer);
      params[thisTime].options.isAuto = false;

      return this;
    },
    reset: function(thisTime) {
      params[thisTime].current = count - 1;
      methods.change(thisTime, 0);

      return this;
    },
    destroy: function() {
      $.each(params, function(i, val) {
        clearTimeout(val.timer);
        $(document).off('.fsPager' + val.time);
      });

      params.length = 0,
      time = '';

      return this;
    },
    getNextSlide: function(thisTime) {
      if (params[thisTime].options.isLoop) {
        return params[thisTime].current === params[thisTime].count - 1 ? 0 : params[thisTime].current + 1;
      } else {
        if (params[thisTime].current !== params[thisTime].count - 1) {
          return params[thisTime].current + 1;
        } else {
          return false;
        }
      }
    },
    getPrevSlide: function(thisTime) {
      if (params[thisTime].options.isLoop) {
        return params[thisTime].current === 0 ? params[thisTime].count - 1 : params[thisTime].current - 1;
      } else {
        if (params[thisTime].current !== 0) {
          return params[thisTime].current - 1;
        } else {
          return false;
        }
      }
    },
    updateParams: function(object, time) {
      for (let key in object) {
        params[time].options[key] = object[key];
      }
    },
    getParams: function(time) {
      return params[time];
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
