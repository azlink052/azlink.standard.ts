/**
 ***********************************************
 *
 * ポップアップを画面の中央に表示
 * (alphaBgはfixed版)
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2020.08.11
 *
 ***********************************************
 */
(function($) {

  const pluginName = 'popupAdjust';
  let options;
  let $jq;
  let scrTopTemp = 0;

  let isOpen = false,
    isAllowClose = false,
    popupTarget = '';

  const css = document.createElement('style');
  document.head.appendChild(css);
  css.sheet.insertRule('body.pOpenUnlock { overflow: visible; }', css.sheet.length);
  css.sheet.insertRule('body.pOpenFixed { position: fixed; }', css.sheet.length);

  const methods = {
    init: function(params) {
      $jq = this;

      options = $.extend({
        wrapper: '#wrapper',
        bg: '#alphaBg',
        isUnlock: true,
        isSpFixed: true,
        bgOpacity: .8,
        durationChange: 200,
        durationClose: 150,
        onComplete: false
      }, params);

      if (!$(options.bg).get(0)) {
        $('<div id="alphaBg" />').prependTo(options.wrapper);
      }

      let popupIDs = new Array;

      $('.popupBtItem:not(.exclude)').each(function() {
        const popupID = $(this).data('popup');

        if ($.inArray(popupID, popupIDs) === -1) {
          popupIDs.push(popupID);
        }
      });

      const popupSrc = '<div class="popupWrapper vertical"><div class="closeVox"><a href="javascript:void(0)" class="popupCloseBt"><span><!-- --></span><span><!-- --></span></a></div><div class="contentWrapper"><div class="content"><!-- --></div></div></div><!-- /popupWrapper01 -->';

      $('#popupContents .content').each(function(i) {
        const src = $(this).html(),
          group = $(this).data('group');

        $(popupSrc).appendTo(options.wrapper).attr('id', popupIDs[i]).addClass(group);
        $('#' + popupIDs[i]).find('.content').html(src);

        $(this).remove();
      });

      $(document).on('click touchstart', '.popupCloseBt, ' + options.bg + ', .popupBtItemClose', function() {
        if ($('.popupWrapper, ' + options.bg).hasClass('velocity-animating') || !isAllowClose) return;
        $('body').removeClass('pOpen pOpenUnlock');
        if ($.params.isRespMode && options.isSpFixed) {
          $('body').removeClass('pOpenFixed');
          window.scrollTo(0, scrTopTemp);
        }
        methods.close();
      });

      $(document).on('keydown', function(e) {
        if (isOpen && e.keyCode === 27) {
          if ($('.popupWrapper, ' + options.bg).hasClass('velocity-animating') || !isAllowClose) return;
          $('body').removeClass('pOpen pOpenUnlock');
          if ($.params.isRespMode && options.isSpFixed) {
            $('body').removeClass('pOpenFixed');
            window.scrollTo(0, scrTopTemp);
          }
          methods.close();
          return false;
        }
      });

      $(document).on('click', '.popupBtItem', function() {
        if ($('.popupWrapper, ' + options.bg).hasClass('velocity-animating')) return;

        const id = $(this).attr('data-popup');
        popupTarget = '#' + id;

        $('#' + id).css('opacity', 0).show();
        $('#' + id).hide().css('opacity', 1);

        $('body').addClass('pOpen');

        methods.change('#' + id);
      });

      if (typeof options.onComplete === 'function') {
        options.onComplete();
      }

      return this;
    },
    change: function(id) {
      if (!isOpen) {
        isOpen = true;

        methods.adjust(id);

        $(options.bg).show().velocity('stop').velocity({
          opacity: options.bgOpacity
        }, options.durationChange, function() {
          $(id).velocity('fadeIn', options.durationChange, function() {
            isAllowClose = true;
          });
        });
      }

      return this;
    },
    close: function() {
      $('.popupWrapper').velocity('fadeOut', options.durationClose, function() {
        $(options.bg).velocity('stop').velocity({
          opacity: 0
        }, options.durationClose, function() {
          $(this).hide();
          isOpen = false;
        });
        $('.popupWrapper.movie .content').empty();
      });

      return this;
    },
    adjust: function(target) {
      if (!target) target = popupTarget;

      const windowHeight = $(window).height(),
        windowWidth = $(window).width(),
        popupHeight = $(target).outerHeight(),
        popupWidth = $(target).outerWidth(),
        scrollTop = $(window).scrollTop(),
        scrollLeft = $(window).scrollLeft();

      const topPos = windowHeight > popupHeight ? (windowHeight - popupHeight) / 2 : 0;
      const leftPos = windowWidth > popupWidth ? (windowWidth - popupWidth) / 2 : 0;

      scrTopTemp = scrollTop;

      if (target) {
        if (options.isUnlock) {
          if (popupHeight >= windowHeight) {
            $('body').addClass('pOpenUnlock');
          }
        }
        $(target).css({
          top: topPos + scrollTop
        });
        if ($.params.isRespMode && options.isSpFixed) {
          $('body').addClass('pOpenFixed').css({
            top: -scrTopTemp
          });
        }
      }

      return this;
    },
    destroy: function() {

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
