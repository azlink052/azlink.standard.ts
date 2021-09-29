/**
 * ============================================================
 *
 * [content]
 *
 * ============================================================
 */
let isSkip = false,
  isPopup = false,
  isOpen = false,
  isAllowClose = false,
  isDefaultFirst = true,
  isScroll = true,
  hHeight = 0,
  hHeightOrg = 0,
  hWidth = 0,
  isHdrFix = false;

let isNavMainHover = new Array,
  isNavSubHover = new Array,
  subHeights = new Array;

(function($) {
  $(function() {
    defaultFunctions.init();
    /**
     ********************************************
     * variables
     ********************************************
     */
    isSkip = $('body').hasClass('skip') ? true : false;
    isFlowAnime = $('body').hasClass('flowAnime') && !$.params.isMobile ? true : false;
    isPopup = $('body').hasClass('popup') ? true : false;
    /**
     ********************************************
     * resize event
     ********************************************
     */
    $(window).on('resize', function() {
      if ($.params.resizeTimer !== false) {
        clearTimeout($.params.resizeTimer);
      }
      $.params.resizeTimer = setTimeout(function() {
        defaultFunctions.adjust();
        if (isFlowAnime && $('.flowVox').get(0)) {
          $('.flowVox').flowVox('destroy');
          isFlowAnime = false;
        }
        if ($.params.isChangeMode) {
          if (!$.params.isRespMode) {
            $('#navWrapper').show();
          } else {
            if ($.params.isNavOpen) $('#gNavOpener').click();
          }
          defaultFunctions.init();
        }
      }, 500);
    });
    /**
     ********************************************
     * scroll event
     ********************************************
     */
    /**
     ********************************************
     * click event
     ********************************************
     */
    $(document).on('click', '#pageTopVox a', function() {
      $('#wrapper').velocity('scroll', 500);
    });

    $(document).on('click', '#gNavOpener', function() {
      if ($('#navWrapper').hasClass('velocity-animating')) return;

      if ($.params.isNavOpen) {
        $('#gNavOpener, body').removeClass('open');

        $('#navWrapper').velocity({
          opacity: 0
        }, 250, function() {
          $('#navWrapper').css({
            opacity: 1,
            display: 'none'
          });

          $.params.isNavOpen = false;
        });
      } else {
        $('#gNavOpener, body').addClass('open');

        $('#navWrapper').css({
          opacity: 0,
          display: 'block'
        }).velocity({
          opacity: 1
        }, 250, function() {
          $.params.isNavOpen = true;
        });
      }
    });

    $(document).on('click', '.la', function() {
      const href = $(this).attr('href');
      const index2 = href.indexOf('#');
      if (index2 > -1 && document.referrer === href.substring(0, index2)) {
        // $('#wrapper').removeClass('loading');
      } else {
        $('#wrapper').addClass('loading');
        setTimeout(function() {
          location.href = href;
        }, 700);
      }
      return false;
    });
    /**
     ********************************************
     * hover event
     ********************************************
     */
  });
}(jQuery));
/**
 ********************************************
 * functions
 ********************************************
 */
const defaultFunctions = {
  init: function() {
    $.main.init();

    hHeightOrg = $('#siteHeader').outerHeight();

    // $('.roFadeImg').rolloverFade();

    $('.rplSPImg').replaceImageSP({
      breakPoint: $.main.spBreakPoint
    });

    defaultFunctions.outputEmail('.infoemail');

    $.main.ratioAdjust.init();

    setTimeout(function() {
      if (!isSkip && isFlowAnime) {
        $('.flowVox').flowVox({
          autorun: false,
          delay: 100,
          duration: 650
        });
      }
      if (isPopup) $(window).popupAdjust();
      defaultFunctions.runIntro();
    }, 500);

    defaultFunctions.adjust();

    $(window).off('scroll.hdrFix');
    $(window).on('scroll.hdrFix', function() {
      if ($('body').hasClass('home')) return;
      if (!$.params.isRespMode) {
        if ($.params.scrTop > hHeight) {
          if (!isHdrFix) {
            isHdrFix = true;
            $('body').addClass('fix');
            $('#siteHeader').velocity('stop').css({
              top: -60
            }).velocity({
              top: 0
            }, 'easeOutCubic', 250, function() {
              defaultFunctions.adjust();
            });
          }
        } else {
          if (isHdrFix) {
            isHdrFix = false;
            $('body').removeClass('fix');
            defaultFunctions.adjust();
          }
        }
      } else {
        $('body').removeClass('fix');
      }
    });
  },
  adjust: function() {
    hHeight = $('#siteHeader').outerHeight();
    hWidth = $('#siteHeader').outerWidth();

    $.main.sScroll(-hHeight, 500, 'easeInQuad');
    if (hHeight !== hHeightOrg) {
      $('.scroll').off('click');
      $.main.sScroll(-hHeight, 500, 'easeInQuad');
    }

    if (!$.params.isRespMode) {
      $('#siteFooter .inner').children().adjustSize();
    } else {
      $('#siteFooter .inner').children().height('auto');
    }

    defaultFunctions.adjustHeader();
  },
  runIntro: function() {
    if (isSkip) return;

    $('#wrapper').css({
      // opacity: 0,
      visibility: 'visible'
    });

    $('#loading').velocity('fadeOut', 500);

    if (location.hash !== '') {
      $(location.hash).velocity('stop').velocity('scroll', {
        offset: -(hHeight + 50),
        duration: 10,
        easing: 'easeInQuad'
      });
    }

    $(document).scroll();

    $('#wrapper').stop().velocity({
      opacity: 1
    }, {
      delay: 400,
      duration: 250,
      complete: function() {
        if (isFlowAnime && $('.flowVox').get(0)) $('.flowVox').flowVox('run');
        isDefaultFirst = false;
      }
    });
  },
  adjustHeader: function() {},
  disabledScroll: function() {
    // SPでは効かないかも
    isScroll = false;

    if (!$.params.isRespMode) {
      $(document).on(scrollEvent, function(e) {
        e.preventDefault();
      });
    } else {
      $(document).on('touchmove.disabledScroll', function(e) {
        e.preventDefault();
      });
    }
  },
  enabledScroll: function() {
    isScroll = true;

    if (!$.params.isRespMode) {
      $(document).off(scrollEvent);
    } else {
      $(document).off('.disabledScroll');
    }
  },
  outputEmail: function(target) {
    function converter(M) {
      let str = '',
        str_as = '';
      for (let i = 0; i < M.length; i++) {
        str_as = M.charCodeAt(i);
        str += String.fromCharCode(str_as + 1);
      }
      return str;
    }
    const ad = converter(String.fromCharCode(104, 109, 101, 110, 63, 96, 121, 107, 104, 109) + String.fromCharCode(106, 45, 105, 111));
    $(target).html('<a href="mailto:' + ad + '">' + ad + '</a>');
  }
};
