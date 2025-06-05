/**
 * ============================================================
 *
 * [content]
 *
 * ============================================================
 */
// import * as azlib from '../global/azlib.bundle.js';
/**
 * 汎用JS クラス
 */
class ContentJS {
  constructor() {
    this.isSkip = false;
    this.isFlowAnime = false;
    this.isPopup = false;
    this.isAcc = false;
    this.isOpen = false;
    this.isAllowClose = false;
    this.isDefaultFirst = true;
    this.isScroll = true;
    this.isNavOpen = false;
    this.hHeight = 0;
    this.hHeightOrg = 0;
    this.hWidth = 0;
    this.wIHeight = 0;
    this.isNavMainHover = [];
    this.isNavSubHover = [];
    this.subHeights = [];
    this.resizeTimer = false;
    this.adminMargin = 0;
    this.mediaQuery = window.matchMedia('(max-width: 767px)');
  }
  init() {
    this.isSkip = document.body.classList.contains('is-skip') ? true : false;
    this.isFlowAnime =
      document.body.classList.contains('is-flowAnime') && !util.isMobile
        ? true
        : false;
    this.isPopup = document.body.classList.contains('is-popup') ? true : false;
    this.isAcc = document.body.classList.contains('is-acc') ? true : false;
    /**
     ********************************************
     * resize event
     ********************************************
     */
    window.addEventListener('resize', () => {
      if (this.resizeTimer !== false) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        this.adjust();
        if (util.isChangeMode) {
          window.location.reload();
        }
      }, 500);
    });
    /**
     ********************************************
     * click event
     ********************************************
     */
    if (document.getElementById('js-pageTopVox')) {
      document
        .querySelector('#js-pageTopVox button')
        .addEventListener('click', (e) => {
          new azlib.anime({
            targets: 'html, body',
            scrollTop: 0,
            duration: 500,
            easing: 'easeInOutQuart',
          });
        });
    }
    document.getElementById('gNavOpener').addEventListener('click', (e) => {
      if (this.isNavOpen) {
        e.currentTarget.setAttribute('aria-expanded', false);
        document.getElementById('gNav').setAttribute('aria-hidden', true);
        e.currentTarget.setAttribute('aria-label', 'メニューを開く');
        document.body.classList.remove('is-navOpen');
        this.isNavOpen = false;
        //FocusLoop
        focusLoop.isRun = false;
      } else {
        e.currentTarget.setAttribute('aria-expanded', true);
        document.getElementById('gNav').setAttribute('aria-hidden', false);
        e.currentTarget.setAttribute('aria-label', 'メニューを閉じる');
        document.body.classList.add('is-navOpen');
        const activeButton = document.querySelector(
          '.js-mmParentBtn.is-active'
        );
        if (activeButton) {
          activeButton.click();
        }
        this.isNavOpen = true;
        //FocusLoop
        focusLoop.isRun = true;
      }
    });
    document.addEventListener('keydown', (e) => {
      if (this.isNavOpen) {
        if (e.key === 'Escape') {
          document.getElementById('gNavOpener').click();
        }
      }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#gNavOpener,#gNav')) {
        if (this.isNavOpen) {
          document.getElementById('gNavOpener').click();
        }
      }
    });
    document.querySelectorAll('#gNav a').forEach((v, i) => {
      v.addEventListener('click', (e) => {
        if (this.isNavOpen) document.getElementById('gNavOpener').click();
      });
    });
    /**
     ********************************************
     * アニメーション制御
     ********************************************
     */
    const controlAnimation = new azlib.SimpleCookie();
    let animationStatus = controlAnimation.get('animationStatus', {
      path: HOME_URL_PATH,
    });
    const onAnimeBTn = document.getElementById('js-onAnime');
    const offAnimeBTn = document.getElementById('js-offAnime');
    if (animationStatus) {
      if (animationStatus == 'is-offAnime') {
        //アニメーションオフ
        onAnimeBTn.classList.remove('is-active');
        onAnimeBTn.setAttribute('aria-pressed', 'false');
        offAnimeBTn.classList.add('is-active');
        offAnimeBTn.setAttribute('aria-pressed', 'true');
        document.body.classList.add('is-offAnime');
      }
    }
    onAnimeBTn.addEventListener('click', (e) => {
      if (!onAnimeBTn.classList.contains('is-active')) {
        //アニメーションオン
        controlAnimation.set('animationStatus', 'is-onAnime', {
          path: HOME_URL_PATH,
        });
        offAnimeBTn.classList.remove('is-active');
        offAnimeBTn.setAttribute('aria-pressed', 'false');
        onAnimeBTn.classList.add('is-active');
        onAnimeBTn.setAttribute('aria-pressed', 'true');
        document.body.classList.remove('is-offAnime');
        if (!document.body.classList.contains('is-animeChange')) {
          document.body.classList.add('is-animeChange');
        }
      }
    });
    offAnimeBTn.addEventListener('click', (e) => {
      if (!offAnimeBTn.classList.contains('is-active')) {
        //アニメーションオフ
        controlAnimation.set('animationStatus', 'is-offAnime', {
          path: HOME_URL_PATH,
        });
        onAnimeBTn.classList.remove('is-active');
        onAnimeBTn.setAttribute('aria-pressed', 'false');
        offAnimeBTn.classList.add('is-active');
        offAnimeBTn.setAttribute('aria-pressed', 'true');
        document.body.classList.add('is-offAnime');
        if (!document.body.classList.contains('is-animeChange')) {
          document.body.classList.add('is-animeChange');
        }
      }
    });
    /**
     ********************************************
     * ReplaceImageSP
     ********************************************
     */
    // const RPL_SP_IMG01 = new azlib.ReplaceImageSP('.rplSPImg', {
    //   spBreakPoint: util.spBreakPoint,
    // });
    /**
     ********************************************
     * PopupAdjust
     ********************************************
     */
    if (this.isPopup) {
      const POPUP = new azlib.PopupAdjust('.popupBtItem', {
        bgOpacity: 0.6,
        wrapper: 'main',
        onComplete: () => {
          // console.log('loaded')
        },
      });
    }
    /**
     ********************************************
     * FlowVox
     ********************************************
     */
    if (location.hash == '') {
      const FLOW_VOX = new azlib.FlowVox('.flowVox', {
        isRepeat: false,
        duration: 800,
        per: 0.5,
      });
    }
    // acc
    const acc01 = new azlib.SimpleAccordion();
    this.outputEmail();
    //FocusLoop
    const focusLoop = new azlib.FocusLoop('#js-gNav');
    if (document.body.classList.contains('is-interviewSlide')) {
      this.initSlider();
    }
    this.addBody();
    if (util.isRespMode) {
      this.addSpMenu();
    } else {
    }
    this.initMegaMenu();
    this.adjust().then(() => this.runIntro());
    /**
     ********************************************
     * アンカーリンク
     ********************************************
     */
    if (location.hash !== '') {
      const HASH = location.hash.replace('#', '');
      const TARGET = document.getElementById(HASH);
      const OFFSET = util.isRespMode ? -66 : -95;
      setTimeout(() => {
        new azlib.anime({
          targets: 'html, body',
          scrollTop: TARGET.getBoundingClientRect().top + util.scrTop + OFFSET,
          duration: 0,
          easing: 'easeInQuad',
          complete: (anim) => {},
        });
      }, 500);
    }
  }
  outputEmail() {
    function converter(M) {
      var str = '',
        str_as = '';
      for (var i = 0; i < M.length; i++) {
        str_as = M.charCodeAt(i);
        str += String.fromCharCode(str_as + 1);
      }
      return str;
    }
    var ad = converter(
      String.fromCharCode(96, 99, 100, 44, 113, 100, 98, 113, 116, 104) +
        String.fromCharCode(
          115,
          63,
          96,
          99,
          100,
          45,
          96,
          104,
          114,
          104,
          109,
          45,
          98,
          110,
          45,
          105,
          111
        )
    );
    const ad2 = 'mai' + 'lto:' + ad;
    const target = document.querySelectorAll('.contactMail01');
    target.forEach((v, i) => {
      v.setAttribute('href', ad2);
      v.textContent = ad;
    });
  }
  addBody() {
    /* scrolled */
    const scrolledClass = () => {
      if (util.scrTop > 200) {
        document.body.classList.add('is-scrolled');
      } else {
        document.body.classList.remove('is-scrolled');
      }
    };
    scrolledClass();
    document.addEventListener('scroll', (e) => {
      scrolledClass();
    });
  }
  initSlider() {
    this.mvSlider = new azlib.SimpleSlider('#js-interviewSlider', {
      ctrl: true,
      isAuto: false,
      isLoop: true,
      speed: 500,
      pause: 5000,
      isResizeAuto: true,
      onSliderLoad: (slider) => {
        // const slideItem = document.querySelectorAll(
        //   '.slide-item:not(.slide-clone)'
        // );
        // const slideCount = slideItem.length;
        document.querySelectorAll('.slide-item').forEach((v, index) => {
          // const number = (index % slideCount) + 1;
          // v.setAttribute('role','group');
          // v.setAttribute(
          //   'aria-label',
          //   number + '枚目のスライダー' + '（' + slideCount + '枚中）'
          // );
          // v.querySelector('a').setAttribute('tabindex', '0');
        });
        //初期でクローンされているスライドをフォーカス対象外に
        document.querySelectorAll('.slide-clone').forEach((v) => {
          // v.setAttribute('aria-hidden', true);
          // v.setAttribute('inert', true);
          // v.querySelector('a').setAttribute('tabindex', '-1');
        });
        //tabキー移動時の為にクローンされていないスライダーの合計横幅指定
        if (!util.isRespMode) {
          // const slideWidth = [];
          // slideItem.forEach((element) => {
          //   slideWidth.push(element.clientWidth);
          // });
          // const total = slideWidth.reduce(function (sum, element) {
          //   return sum + element;
          // }, 0);
          // document.querySelector('.sliderCnt').style.width = total + 'px';
        }
        //ボタンにaria-controls付与
        // document
        //   .querySelector('.ss-prev,.ss-next')
        //   .setAttribute('aria-controls', 'js-interviewSlider');
      },
      onSlideAfter: (index) => {
        // console.log(index)
        if (index !== 0) {
          const slideItem = document.querySelectorAll(
            '.slide-item:not(.slide-clone)'
          );
          const slideCount = slideItem.length;
          // aria-hidden,inert付け直し
          let slideActive = document.querySelector('.slide-active');
          if (slideActive) {
            document.querySelectorAll('.slide-item').forEach((v) => {
              // v.setAttribute('aria-hidden', true);
              // v.setAttribute('inert', true);
              // v.querySelector('a').setAttribute('tabindex', '-1');
            });
            for (let i = 0; i < slideCount; i++) {
              if (slideActive && slideActive.nextElementSibling) {
                // slideActive = slideActive.nextElementSibling;
                // slideActive.setAttribute('aria-hidden', false);
                // slideActive.removeAttribute('inert');
                // slideActive.setAttribute('tabindex', '0');
              }
            }
          }
        } else {
          document.querySelectorAll('.slide-item').forEach((v) => {
            // v.setAttribute('aria-hidden', false);
            // v.removeAttribute('inert');
            // v.setAttribute('tabindex', '0');
            if (v.classList.contains('slide-clone')) {
              // v.setAttribute('aria-hidden', true);
              // v.setAttribute('inert', true);
              // v.querySelector('a').setAttribute('tabindex', '-1');
            }
          });
        }
      },
    });
  }
  initMegaMenu() {
    let focusLoop02;
    const parents = util.isRespMode
      ? document.querySelectorAll('.js-mmParentItem')
      : document.querySelectorAll('.js-mmParentItem:not(.js-spOnly)');
    const buttons = document.querySelectorAll('.js-mmParentBtn');
    const menus = util.isRespMode
      ? document.querySelectorAll('.js-mMenu:not(.js-pcOnly)')
      : document.querySelectorAll('.js-mMenu:not(.js-spOnly)');
    const eventType =
      window.ontouchstart !== null && navigator.maxTouchPoints > 0
        ? 'touchend'
        : 'click';
    let isMenuOpen = false;
    menus.forEach((i) => {
      i.setAttribute('aria-hidden', true);
    });
    const toggleMenu = (e) => {
      e.preventDefault();
      const button = e.currentTarget;
      const menu = button.nextElementSibling;
      if (button.classList.contains('is-active')) {
        closeMenu(button, menu);
      } else {
        openMenu(button, menu);
      }
    };
    const closeMenu = (button, menu) => {
      if (menu) {
        button.setAttribute('aria-expanded', false);
        menu.setAttribute('aria-hidden', true);
        button.classList.remove('is-active');
        menu.classList.remove('is-open');
        if (util.isRespMode) {
          menu.style.height = null;
        }
        isMenuOpen = false;
      }
    };
    const openMenu = (button, menu) => {
      buttons.forEach((b) => {
        closeMenu(b, b.nextElementSibling);
      });
      menu.classList.add('is-open');
      button.classList.add('is-active');
      button.setAttribute('aria-expanded', true);
      menu.setAttribute('aria-hidden', false);

      if (util.isRespMode) {
        menu.style.height = menu.scrollHeight + 'px';
      }
      isMenuOpen = true;
    };
    parents.forEach((parent, index) => {
      if (!util.isRespMode) {
        focusLoop02 = new azlib.FocusLoop(`#mMenu${index + 1}`);
      } else {
        focusLoop02 = new azlib.FocusLoop(`#js-entrymMenu`);
      }
      focusLoop02.isRun = true;
      parent.querySelectorAll('.js-mmParentBtn').forEach((button) => {
        button.addEventListener(eventType, toggleMenu);
      });
    });
    document.addEventListener('keydown', (e) => {
      if (!isMenuOpen) return;
      if (e.key === 'Escape') {
        const activeButton = document.querySelector(
          '.js-mmParentBtn.is-active'
        );
        if (activeButton) {
          activeButton.click();
        }
      }
    });
    document.querySelectorAll('.js-mMenu .js-closeBtn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const activeButton = document.querySelector(
          '.js-mmParentBtn.is-active'
        );
        if (activeButton) {
          activeButton.click();
        }
      });
    });
  }
  async adjust() {
    new Promise((resolve, reject) => {
      this.hHeight = document.getElementById('siteHeader').clientHeight;
      const hTop = util.isRespMode
        ? 15
        : document.getElementById('siteHeader').getBoundingClientRect().top;
      this.adminMargin = document.documentElement.style.marginTop;
      util.sScroll(
        -(Number(this.adminMargin) + Number(this.hHeight + hTop + 10)),
        500,
        'easeInQuad'
      );
      this.adjustHeader();
      if (!util.isRespMode) {
        const element = document.querySelector('#siteHeader ,#gNav .js-mMenu');
        window.addEventListener('scroll', () => {
          element.style.left = -window.scrollX + 'px';
        });
      }
      resolve();
    });
  }
  runIntro() {
    if (this.isSkip) return;
    // new azlib.anime({
    //   targets: '#wrapper',
    //   opacity: 1,
    //   delay: 300,
    //   duration: 250,
    //   easing: 'linear',
    //   complete: (anim) => {
    //     this.isDefaultFirst = false;
    //   },
    // });
  }
  adjustHeader() {}
  addSpMenu() {
    document.getElementById('gNav').setAttribute('aria-hidden', true);
  }
}
/**
 * Home用JSクラス
 */
class HomeJS {
  constructor() {
    this.rTimer = false;
    this.isFirst = true;
  }
  init() {
    if (!util.isRespMode) {
      this.animateItems();
    }
    this.adjust().then(() => this.runIntro());
  }
  async adjust() {
    new Promise((resolve, reject) => {
      resolve();
    });
  }
  lottie() {
    const elem = document.getElementById('lottie'),
      jsonPath = HOME_DIR + 'assets/json/home/data.json';
    const anim = lottie.loadAnimation({
      container: elem,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: jsonPath,
      rendererSettings: {
        className: 'svgAnime',
      },
    });
    elem.style.height = util.wIHeight + 'px';
    anim.addEventListener('complete', function (e) {
      setTimeout(() => {
        elem.classList.add('lottieEnd');
      }, 200);
    });
  }
  animateItems() {
    const multiplier = 0.05; // マウス移動に対する移動量の倍率
    const imageMultiplier = 0.02;
    const ease = 0.1; // イージングの係数
    const distance = ['.6', '.5', '.5', '.5', '.01']; //距離
    const withEase = true; // 余韻を使うかどうかのフラグ

    // 目標位置と現在位置の初期化
    let targetX = 0,
      targetY = 0;
    let imageTargetX = 0,
      imageTargetY = 0; // itemImage 専用の目標位置
    let currentX = 0,
      currentY = 0;
    let imageCurrentX = 0,
      imageCurrentY = 0; // itemImage 専用の現在位置
    let isAnimating = false;

    const mvMove = document.getElementById('js-mvAnimeArea');
    const items = document.querySelectorAll('.js-mvAnime');
    const itemImage = document.querySelector('.js-mvBg');

    // アニメーション開始
    const startAnimation = () => {
      if (!document.body.classList.contains('is-offAnime')) {
        if (!isAnimating) {
          isAnimating = true;
          updateAnimation();
        }
      }
    };
    // アニメーション停止
    const stopAnimationAndReset = () => {
      isAnimating = false;
      const resetEase = 0.1;
      const resetAnimation = () => {
        currentX += (0 - currentX) * resetEase;
        currentY += (0 - currentY) * resetEase;
        imageCurrentX += (0 - imageCurrentX) * resetEase;
        imageCurrentY += (0 - imageCurrentY) * resetEase;
        items.forEach((item) => {
          item.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });
        if (itemImage) {
          itemImage.style.transform = `translate(${imageCurrentX}px, ${imageCurrentY}px)`;
        }
        if (
          Math.abs(currentX) < 0.1 &&
          Math.abs(currentY) < 0.1 &&
          Math.abs(imageCurrentX) < 0.1 &&
          Math.abs(imageCurrentY) < 0.1
        ) {
          currentX = currentY = 0;
          imageCurrentX = imageCurrentY = 0;
        } else {
          requestAnimationFrame(resetAnimation);
        }
      };
      resetAnimation();
    };

    mvMove.addEventListener('mouseenter', startAnimation);
    mvMove.addEventListener('mousemove', (event) => {
      const { clientX: mouseX, clientY: mouseY } = event;
      targetX = (mouseX - window.innerWidth / 2) * multiplier;
      targetY = (mouseY - window.innerHeight / 2) * multiplier;
      imageTargetX = (mouseX - window.innerWidth / 2) * imageMultiplier;
      imageTargetY = (mouseY - window.innerHeight / 2) * imageMultiplier;
      startAnimation();
    });
    mvMove.addEventListener('mouseleave', stopAnimationAndReset);
    const updateAnimation = () => {
      if (!isAnimating) return;
      if (withEase) {
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        imageCurrentX += (imageTargetX - imageCurrentX) * ease;
        imageCurrentY += (imageTargetY - imageCurrentY) * ease;
      } else {
        currentX = targetX;
        currentY = targetY;
        imageCurrentX = imageTargetX;
        imageCurrentY = imageTargetY;
      }
      items.forEach((item, i) => {
        item.style.transform = `translate(${currentX * distance[i]}px, ${
          currentY * distance[i]
        }px)`;
      });

      if (itemImage) {
        itemImage.style.transform = `translate(${imageCurrentX}px, ${imageCurrentY}px)`;
      }
      if (
        Math.abs(targetX - currentX) < 0.1 &&
        Math.abs(targetY - currentY) < 0.1
      ) {
        isAnimating = false;
      } else {
        requestAnimationFrame(updateAnimation);
      }
    };
  }
  runIntro() {
    this.isFirst = false;
    // Object.assign(document.getElementById('wrapper').style, {
    //   visibility: 'visible',
    //   opacity: 0,
    // });

    const isBack =
      window.performance &&
      window.performance.navigation.type ===
        window.performance.navigation.TYPE_BACK_FORWARD;
    const isReload =
      window.performance &&
      window.performance.navigation.type ===
        window.performance.navigation.TYPE_RELOAD;

    if (!util.isRespMode) {
      if (util.qsParm.intro !== 'skip' && !isBack && !isReload) {
        if (!document.body.classList.contains('is-offAnime')) {
          setTimeout(() => {
            this.lottie();
          }, 750);
        } else {
          document.body.classList.add('is-noOpening');
        }
      } else {
        document.body.classList.add('is-noOpening');
      }
    }
  }
}

/**
 * インスタンス化
 */
const util = new azlib.Utilities({
  // spBreakPoint: 767
});
const CONTENT_JS = new ContentJS();
const HOME_JS = new HomeJS();

/**
 * 実行
 */
document.addEventListener('DOMContentLoaded', () => {
  util.init();
  CONTENT_JS.init();
  if (document.body.classList.contains('home')) {
    HOME_JS.init();
  }
});
