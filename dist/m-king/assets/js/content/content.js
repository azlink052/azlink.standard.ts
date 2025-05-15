/**
 * ============================================================
 *
 * [content]
 *
 * ============================================================
 */
/**
 * 汎用JS クラス
 */
class ContentJS {
  constructor() {
    this.isSkip = false;
    this.isFlowAnime = false;
    this.isPopup = false;
    this.isOpen = false;
    this.isAllowClose = false;
    this.isDefaultFirst = true;
    this.isScroll = true;
    this.isNoCueOffset = false;
    this.hHeight = 0;
    this.hHeightOrg = 0;
    this.hWidth = 0;
    this.resizeTimer = false;
    this.adminMargin = 0;
    // ex
    this.gNavAcc = null;
    this.machineSlider = null;
  }
  init() {
    this.isSkip = document.body.classList.contains('is-skip') ? true : false;
    this.isFlowAnime = document.body.classList.contains('is-flowAnime')
      ? true
      : false;
    this.isPopup = document.body.classList.contains('is-popup') ? true : false;
    this.isNoCueOffset = document.body.classList.contains('is-noCueOffset')
      ? true
      : false;

    // ロケーションハッシュ
    window.addEventListener('load', () => {
      if (location.hash !== '' && !this.isNoCueOffset) {
        const hash = location.hash.replace('#', '');
        const target = document.getElementById(hash);
        if (!target) return;
        this.hHeight = document.getElementById('siteHeader').clientHeight;
        const offset = -Number(this.hHeight);
        const targetPos =
          target?.getBoundingClientRect().top + window.pageYOffset + offset;
        new azlib.anime({
          targets: 'html, body',
          scrollTop: targetPos,
          duration: 10,
          easing: 'easeInQuad',
          complete: () => {
            const newTargetPos =
              target.getBoundingClientRect().top + window.pageYOffset + offset;
            // console.log(targetPos, newTargetPos)
            if (targetPos !== newTargetPos) {
              new azlib.anime({
                targets: 'html, body',
                scrollTop: newTargetPos,
                duration: 10,
                easing: 'linear',
              });
            }
          },
        });
      }
    });

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

    /**
     * グロナビ（PC・SPコードは共通）
     * PC：メガメニュー／SP：アコーディオン
     */
    const focusLoop = new azlib.FocusLoop('#js-gNav');
    if (document.getElementById('gNavOpener')) {
      const opener = document.getElementById('gNavOpener');
      const content = document.getElementById('gNavWrapper');

      opener.setAttribute('aria-expanded', util.isRespMode ? false : true);
      content.setAttribute('aria-hidden', util.isRespMode ? true : false);

      opener.addEventListener('click', (e) => {
        if (util.isNavOpen) {
          opener.classList.remove('is-navOpen');
          document.body.classList.remove('is-navOpen');
          opener.setAttribute('aria-expanded', false);
          content.setAttribute('aria-hidden', true);
          util.isNavOpen = false;
          focusLoop.isRun = false;
        } else {
          util.isNavOpen = true;
          focusLoop.isRun = true;
          opener.classList.add('is-navOpen');
          document.body.classList.add('is-navOpen');
          opener.setAttribute('aria-expanded', true);
          content.setAttribute('aria-hidden', false);
        }
      });
      document.addEventListener('keydown', (e) => {
        if (util.isNavOpen && e.key === 'Escape') opener.click();
      });
    }
    /**
     * スクロール時、指定箇所に到達でヘッダーにクラス付与
     */
    const toggleHeader = () => {
      if (document.body.classList.contains('home')) {
        const header = document.getElementById('siteHeader');
        if (!util.isRespMode) {
          if (
            util.scrTop > document.getElementById('js-mainVisual').clientHeight
          ) {
            header.classList.add('is-fixed');
          } else {
            header.classList.remove('is-fixed');
          }
          if (
            util.scrTop >
            document.getElementById('container').clientHeight -
              header.clientHeight
          ) {
            header.classList.remove('is-fixed');
          }
        }
      }
    };
    window.removeEventListener('scroll', toggleHeader);
    window.addEventListener('scroll', toggleHeader);
    /**
     * ポップアップ
     */
    if (this.isPopup) {
      const popup = new azlib.PopupAdjust('.popupBtItem', {
        onComplete: () => {
          console.log('loaded');
        },
      });
      document.querySelectorAll('.popupBtItem.movie').forEach((v, i) => {
        v.addEventListener('click', (e) => {
          document.querySelector('#popupWrapperMovie .content').innerHTML = '';
          const title = (() => {
            if (v.getAttribute('title') != '')
              return `<div class="title">${v.getAttribute('title')}</div>`;
            return '';
          })();
          const movie = v.getAttribute('data-movie');
          const src = `${title}<iframe src="https://www.youtube.com/embed/${movie}?autoplay=1&rel=0" frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          document
            .querySelector('#popupWrapperMovie .content')
            .insertAdjacentHTML('beforeend', src);
        });
      });
    }

    this.initMachineSlider();

    this.hHeightOrg = document.getElementById('siteHeader')
      ? document.getElementById('siteHeader').clientHeight
      : 0;
    const rplSPImg01 = new azlib.ReplaceImageSP('.rplSPImg', {
      spBreakPoint: util.spBreakPoint,
    });

    if (this.isFlowAnime) {
      // flowVox
      const flowVox = new azlib.FlowVox('.flowVox', {
        // isRepeat: true,
        // per: 0.25,
        translate: 20,
        duration: 700,
        easing: 'easeOutCubic',
      });
    }

    const acc01 = new azlib.SimpleAccordion();
    this.adjust().then(() => this.runIntro());
  }
  async adjust() {
    new Promise((resolve, reject) => {
      this.hHeight = document.getElementById('siteHeader').clientHeight;
      // this.adminMargin = parseInt(getComputedStyle(document.getElementsByTagName('html')[0]).marginTop);
      // util.sScroll(-(Number(this.adminMargin) + Number(this.hHeight)), 1000, 'easeOutQuad', 'a[href*="#"].scroll, area[href*="#"].scroll', true);
      util.sScroll(
        -Number(this.hHeight),
        1000,
        'easeOutQuad',
        'a[href*="#"].sScroll, area[href*="#"].sScroll',
        true
      );

      this.initTab();
      this.adjustHeader();

      resolve();
    });
  }
  initTab() {
    const tabIndex = util.qsParm['tabIndex']
      ? parseInt(util.qsParm['tabIndex'])
      : 0;
    const simpleTab = new azlib.SimpleTab('.tabVoxWrapper', {
      current: tabIndex,
      // heightPlus: 50,
      isAdjustHeight: false,
      onComplete: () => {
        console.log('tab loaded');
      },
    });
  }
  runIntro() {
    if (this.isSkip) return;

    // document.getElementById('wrapper').style.visibility = 'visible';

    new azlib.anime({
      targets: '#loading',
      opacity: [1, 0],
      complete: (anim) => {
        if (document.getElementById('loading')) {
          document.getElementById('loading').style.display = 'none';
        }
      },
    });

    new azlib.anime({
      targets: '#wrapper',
      opacity: 1,
      delay: 400,
      duration: 250,
      easing: 'linear',
      complete: (anim) => {
        this.isDefaultFirst = false;
        document.body.classList.add('is-finishedIntro');
      },
    });
  }
  adjustHeader() {}
  generateRandomString(length) {
    if (!length) length = 12;
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let str = '';
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `_${str}`;
  }
  initMachineSlider() {
    const target = document.getElementById('js-machineSlider');
    if (!target) return;

    let count = 0;
    count = target.querySelectorAll('.item').length;
    if (!util.isRespMode && count <= 3) {
      target.closest('.sliderWrapper').classList.add('is-noslider');
      return;
    } else if (util.isRespMode && count <= 1) {
      target.closest('.sliderWrapper').classList.add('is-noslider');
      return;
    }
    this.machineSlider = new azlib.SimpleSlider('#js-machineSlider', {
      isAuto: true,
      ctrl: false,
      pager: false,
      speed: 500,
      pause: 3000,
      spaceBetween: 20,
      nextEl: '#js-next02',
      prevEl: '#js-prev02',
      pagerEl: '#js-pager02',
    });
  }
}
/**
 * Home用JSクラス
 */
class HomeJS {
  constructor() {
    this.rTimer = false;
    this.isFirst = true;
    this.bnrSlider = null;
  }
  init() {
    window.addEventListener('resize', () => {
      if (this.rTimer !== false) {
        clearTimeout(Number(this.rTimer));
      }

      this.rTimer = window.setTimeout(() => {
        this.adjust();
        if (util.isChangeMode) {
          this.adjust();
        }
      }, 500);
    });

    this.initBnrSlider();

    this.adjust().then(() => this.runIntro());
  }
  initBnrSlider() {
    const target = document.getElementById('js-bnrSlider');
    if (!target) return;

    let count = 0;
    count = target.querySelectorAll('.item').length;
    if (count <= 1) {
      target.closest('.sliderWrapper').classList.add('is-noslider');
      return;
    }
    this.bnrSlider = new azlib.SimpleSlider('#js-bnrSlider', {
      isAuto: true,
      ctrl: false,
      pager: false,
      speed: 500,
      pause: 3000,
      spaceBetween: !util.isRespMode ? 30 : 20,
      nextEl: '#js-next01',
      prevEl: '#js-prev01',
      pagerEl: '#js-pager01',
    });
  }
  async adjust() {
    new Promise((resolve, reject) => {
      resolve();
    });
  }
  runIntro() {
    this.isFirst = false;
    return;

    Object.assign(document.getElementById('wrapper').style, {
      visibility: 'visible',
      opacity: 0,
    });
    new azlib.anime({
      targets: '#wrapper',
      opacity: 1,
      duration: 500,
      easing: 'linear',
    });
  }
}
/**
 * インスタンス化
 */
const util = new azlib.Utilities({
  spBreakPoint: 961,
});
const contentJS = new ContentJS();
const homeJS = new HomeJS();
/**
 * 実行
 */
window.addEventListener('DOMContentLoaded', () => {
  util.init();
  contentJS.init();
  if (document.body.classList.contains('home')) {
    homeJS.init();
  }
  const lazyBg = new azlib.LazyLoadBg('.js-lazyBg');
});
