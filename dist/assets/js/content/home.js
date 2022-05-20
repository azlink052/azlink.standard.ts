/**
 * ================================================
 *
 * [home]
 *
 * ================================================
 */
let rTimer = false;
let isFirst = true;
let isAllowSlide = false;
let wheelSave = 0;
let wheelTime = 0;
let isWheel = true;
let current = 0;
let flow;
let viewOriMode = '';

let video = null;
const videoParam = {};

const mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

window.addEventListener('DOMContentLoaded', () => {
  /**
   ********************************************
   * load event
   ********************************************
   */
  functions.init()
  /**
   ********************************************
   * resize event
   ********************************************
   */
  window.addEventListener('resize', () => {
    if (rTimer !== false) {
      clearTimeout(rTimer);
    }

    rTimer = setTimeout(function() {
      functions.adjust();

      if (_az.params.isChangeMode) {
        location.reload();
      }
    }, 1000);
  })
  /**
   ********************************************
   * scroll event
   ********************************************
   */
  window.addEventListener('scroll', () => {})
  // $(window).on('touchmove.noScroll', function(e) {
  // 	if (_az.params.isRespMode) e.preventDefault();
  // });
  /**
   ********************************************
   * click event
   ********************************************
   */
  document.querySelector('#pageTopVox a').addEventListener('click', () => {
    functions.slider.reset();
  })
  document.querySelector('.scrollBtn').addEventListener('click', () => {
    isAllowSlide = false;
    functions.slider.slideNext();
  })
  /**
   ********************************************
   * hover event
   ********************************************
   */

  /**
   ********************************************
   * mousewheel event
   ********************************************
   */

  /**
   ********************************************
   * key event
   ********************************************
   */
  document.addEventListener('keydown', e => {
    if (e.keyCode === 40) {
      // ↓
      if (!isAllowSlide) return false;
      isAllowSlide = false;
      functions.slider.slideNext();
    } else if (e.keyCode === 38) {
      // ↑
      if (!isAllowSlide) return false;
      isAllowSlide = false;
      functions.slider.slidePrev();
    }
  })
  /**
   ********************************************
   * swipe event
   ********************************************
   */

  /**
   ********************************************
   * etc
   ********************************************
   */
})
/**
 **********************************************************
 *
 * functions
 *
 **********************************************************
 */
const functions = {
  init: function() {
    flow = new Flow(2, () => {
      functions.runIntro();
    });

    // 動画用
    videoParam.name = 'top2';
    videoParam.dir = 'media/';
    videoParam.srcmp4 = videoParam.dir + videoParam.name + '.mp4';
    videoParam.srcwebm = videoParam.dir + videoParam.name + '.webm';
    videoParam.srcogv = videoParam.dir + videoParam.name + '.ogv';
    videoParam.ratio = [16, 9];
    // videoParam.poster = 'images/content/home/main_visual.jpg';

    functions.initVideo();
    // flow.pass('video');

    setTimeout(() => {
      functions.adjust();
      functions.slider.init();
    }, 500)
  },
  adjust: function() {
    if (!_az.params.isRespMode) {
      // document.querySelector('#container .item .content').adjustSize();
    } else {
      document.querySelector('#container .item .content').style.height = _az.params.wHeight;
    }

    let w = _az.params.wIWidth;
    let h = _az.params.wIHeight;
    let setW = w;
    let setH = w / videoParam.ratio[0] * videoParam.ratio[1];
    let setL = 0;

    if (h >= setH) {
      setH = h;
      setW = setH / videoParam.ratio[1] * videoParam.ratio[0];
      setL = (w - setW) / 2;
    }

    $('.bgVideo, .bgImg').css({
      width: setW,
      height: setH,
      left: setL,
      top: (h - setH) / 2
    });

    if (isFirst) flow.pass('adjust');
  },
  slider: {
    init: function() {
      totalSlide = $('#container .sliderItem').length;
      $('#container .sliderItem:not(:eq(' + current + '))').velocity({
        translateY: '100vh'
      }, 1);

      const wheelAction = function(e) {
        // console.log(isAllowSlide)
        e.preventDefault();
        if (isWheel && !_az.params.isRespMode) {
          if (!isAllowSlide) return false;
          isAllowSlide = false;
          const delta = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);
          if (delta < 0) {
            if (current === totalSlide) {
              isAllowSlide = true;
              return;
            }
            // isAllowSlide = false;
            functions.slider.slideNext();
          } else {
            if (current === 0) {
              isAllowSlide = true;
              return;
            }
            // isAllowSlide = false;
            functions.slider.slidePrev();
          }
        }
      };

      window.addEventListener('wheel', _.throttle(wheelAction, 1500, {
        trailing: false,
        leading: true
      }), {
        passive: false
      });

      if (isFirst) flow.pass('slider');
    },
    slideNext: function() {
      if (current === totalSlide) {
        // console.log(1);
        isAllowSlide = true;
        return;
      }
      if (current === 0) {
        if (video) video.pause();
        $('#container .sliderItem').eq(0).velocity({
          backgroundColorAlpha: 1
        }, 250, function() {
          $('.videoContainer').velocity({
            opacity: 0
          }, 10, function() {
            $(this).css('z-index', 0)
          });
          action();
        });
      } else {
        action();
      }

      function action() {
        if (current === totalSlide - 1) {
          $('#siteFooter .inner').show();
        }
        $('#container .sliderItem').eq(current).addClass('old').velocity({
          translateY: '-100vh',
          backgroundColorAlpha: 1
        }, {
          duration: 740,
          easing: 'easeInCubic',
          complete: function() {
            if (current === totalSlide - 1) {
              isAllowSlide = true;
              current++;
            }
            $(this).removeClass('old');
          }
        });
        $('#container .sliderItem').eq(current + 1).addClass('new').velocity({
          translateY: 0
        }, {
          duration: 750,
          easing: 'easeInOutCubic',
          complete: function() {
            current++;
            isAllowSlide = true;
            $(this).removeClass('new');
          }
        });
      }
    },
    slidePrev: function() {
      if (current === 0) {
        isAllowSlide = true;
        return;
      }
      $('#container .sliderItem').eq(current - 1).addClass('new').velocity({
        translateY: 0
      }, {
        duration: 740,
        easing: 'easeInOutCubic',
        complete: function() {
          if (current === totalSlide) {
            $('#siteFooter .inner').hide();
            current--;
            isAllowSlide = true;
          }
          if (current === 1) {
            if (video) {
              $('#container .sliderItem').eq(0).velocity({
                backgroundColorAlpha: .9
              }, 500);
              $('.videoContainer').css('z-index', 1).velocity({
                opacity: 1
              }, 250);
              video.play();
            }
          }
          $(this).removeClass('new');
        }
      });
      $('#container .sliderItem').eq(current).addClass('old').velocity({
        translateY: '100vh'
      }, {
        duration: 750,
        easing: 'easeInSine',
        complete: function() {
          current--;
          isAllowSlide = true;
          $(this).removeClass('old');
        }
      });
    },
    reset: function() {
      isAllowSlide = false;
      current = 0;
      $('#container .sliderItem').eq(current).velocity({
        translateY: 0
      }, {
        duration: 750,
        easing: 'easeInOutCubic',
        complete: function() {
          isAllowSlide = true;
          if (video) {
            $(this).velocity({
              backgroundColorAlpha: .9
            }, 1000);
            $('.videoContainer').css('z-index', 1).velocity({
              opacity: 1
            }, 250);
            video.play();
          }
        }
      });
      $('#container .sliderItem:not(:eq(' + current + '))').velocity({
        translateY: '100vh'
      }, {
        duration: 500,
        easing: 'easeInCubic'
      });
    }
  },
  runIntro: function(err, args) {
    isFirst = false;

    if (isSkip) {
      time = 500;

      setTimeout(function() {
        $('#loading').velocity({
          opacity: 0
        }, {
          duration: 300,
          display: 'none'
        });

        if (location.hash !== '') {
          $(location.hash).velocity('stop').velocity('scroll', {
            // offset: -(hHeight + 50),
            offset: -50,
            duration: 10,
            easing: 'easeInQuad'
          });
        }

        $('#wrapper').css({
          visibility: 'visible'
        }).velocity({
          opacity: 1
        }, 500, function() {
          isAllowSlide = true;
          if (video) {
            $('#container .sliderItem').eq(current).velocity({
              backgroundColorAlpha: .9
            }, 1000);
          }
          $('#siteFooter .inner').hide();
          viewOriMode = _az.params.viewOriMode;

          if (_az.params.isRespMode) functions.setSwipe('#wrapper');
        });

        if (!_az.params.isRespMode) {
          if (video) video.play();
        }
      }, time);
    }
  },
  initVideo: function() {
    if (video !== null) return;

    // if (!_az.params.isMobile) {
    $('.bgVideo').empty();
    $('.bgVideo').append('<video id="topVideo" playsinline muted autoplay />');
    video = $('.bgVideo video')[0];

    if (video.canPlayType('video/mp4')) {
      video.src = videoParam.srcmp4;
    } else if (video01.canPlayType('video/webm')) {
      video.src = videoParam.srcwebm;
    } else if (video01.canPlayType('video/ogg')) {
      video.src = videoParam.srcogv;
    } else {
      video.src = '';
    }

    // video.poster = _az.params.isRespMode || video.src === '' || _az.params.isMobile ? videoPoster : '',
    video.loop = true,
      video.muted = true;
    // video.load();

    if (!_az.params.isRespMode) {
      video.autoplay = false,
        video.pause();
    }

    /*if (_az.params.isRespMode || _az.params.isMobile) {
    	$('#wrapper').on('touchstart', function() {
    		if (!video.paused) {
    			video.pause();
    		} else {
    			video.play();
    		}
    	});
    }*/

    video.addEventListener('ended', function() {

    }, false);

    if (!_az.params.isMobile) {
      video.addEventListener('loadeddata', function() {
        // if (isFirst) flow.pass('video');
      });
    } else {
      // if (isFirst) flow.pass('video');
    }
    // } else {
    // 	if (isFirst) flow.pass('video');
    // }
  },
  setSwipe: function(elem) {
    const t = document.querySelector(elem);
    // var r = document.getElementById('result');
    let startX;
    let startY;
    let moveX;
    let moveY;
    let dist = 30;
    t.addEventListener('touchstart', function(e) {
      // e.preventDefault();
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
    });
    t.addEventListener('touchmove', function(e) {
      // e.preventDefault();
      moveX = e.changedTouches[0].pageX;
      moveY = e.changedTouches[0].pageY;
    });
    t.addEventListener('touchend', function(e) {
      if (startY > moveY && startY > moveY + dist) {
        // r.textContent = '↓から↑にスワイプ';
        if (!isAllowSlide) return false;
        isAllowSlide = false;
        functions.slider.slideNext();
      } else if (startY < moveY && startY + dist < moveY) {
        // r.textContent = '↑から↓にスワイプ';
        if (!isAllowSlide) return false;
        isAllowSlide = false;
        functions.slider.slidePrev();
      }
    });
  }
};