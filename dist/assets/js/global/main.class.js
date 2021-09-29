/**
 * ================================================
 *
 * [javascript Common]
 * 必須ライブラリ : velocity;
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2021.05.29
 *
 * ================================================
 */
export class AzLib {
  constructor($props = {}) {
    this.qsParm = []; // GETパラメータ
    this.userAgent = '';
    this.browserIE = 0; // IE判定
    this.browser_v = 0; // IEバージョン番号
    this.browser_n = ''; // browser名
    this.ua = ''; // UA
    this.isIE = false; // IE判定
    this.isIE6 = false; // IE6判定
    this.isIE7 = false; // IE7判定
    this.isIE8 = false; // IE8判定
    this.isIE9 = false; // IE9判定
    this.isIE10 = false; // IE10判定
    this.isIE11 = false; // IE11判定
    this.isEdge = false; // Edge判定
    this.isiPhone = false; // iPhone判定
    this.isiPad = false; // iPad判定
    this.isiPod = false; // iPod判定
    this.isAndroid = false; // Android判定
    this.isWinPhone = false; // WinPhone判定
    this.isMobile = false; // Mobile判定 (setMobile結果)
    this.isNavOpen = false; // メニュー開閉判定(スマフォメニューなどに使用)
    this.spBreakPoint = $props.spBreakPoint || 768; // ブレークポイント
    this.wWidth = 0; // ウィンドウ幅
    this.wHeight = 0; // ウィンドウ高さ
    this.wIWidth = 0; // ウィンドウ幅 (innerWidth)
    this.wIHeight = 0; // ウィンドウ高さ (innerHeight)
    this.wIWidthCache = 0; // ウィンドウ幅のキャッシュ (innerWidth)
    this.wIHeightCache = 0; // ウィンドウ高のキャッシュ (innerWidth)
    this.dspWidth = parseInt(window.parent.screen.width); // 画面の幅
    this.dspHeight = parseInt(window.parent.screen.height); // 画面の高さ
    this.isRespMode = false; // レスポンシブ判定
    this.isChangeWWidth = false; // 画面幅の変更判定
    this.isChangeWHeight = false; // 画面高の変更判定
    this.isPageTopShow = false; // pagetop表示判定
    this.pageTopPoint = $props.pageTopPoint || 100; // pagetop表示Y座標
    this.scrTop = 0; // Y軸スクロール量
    this.scrLeft = 0; // X軸スクロール量
    this.orgMode = null; // ロード時のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
    this.currentMode = null; // 現在のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
    this.isChangeMode = false; // レスポンシブ状態が変更になったらtrue
    this.viewOriMode = 'landscape'; // 画面モード landscape / portrait
    this.isDebug = $props.isDebug || false; // デバッグモード判定
    this.rTimer = {}; // イベント制御用タイマー
    this.resizeTimer = false; // イベント制御用タイマー
    this.tmp = {}; // 作業用

    this.init();
  }
  init() {
    this.setGETqs();
    this.setWb();
    this.setWbVer();
    this.setMobile();
    this.setRespMode();
    this.sScroll();
    this.setScrPos();
    this.roImg();
    this.roOpa();
    this.adjList();
    this.pageTop();
    this.toggleSPTel();
    this.initDebug();
    window.addEventListener('resize', () => {
      if (this.rTimer.setRespMode !== false) {
        clearTimeout(this.rTimer.setRespMode);
      }
      this.rTimer.setRespMode = setTimeout(() => {
        this.setRespMode();
      }, 250);

      if (this.rTimer.toggleSPTel !== false) {
        clearTimeout(this.rTimer.toggleSPTel);
      }
      this.rTimer.toggleSPTel = setTimeout(() => {
        this.toggleSPTel();
      }, 250);
    });
    window.addEventListener('scroll', () => {
      this.setScrPos();
      this.pageTop();
    });
  }
  /**
   * デバッグの準備
   */
  initDebug() {
    if (!this.isDebug) return;
    const P_DEBUG = document.createElement('div');
    P_DEBUG.id = 'pDebug';
    Object.assign(P_DEBUG.style, {
      position: 'fixed',
      zIndex: 99999,
      top: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
      padding: '1vw',
      width: '30vw',
      height: '100%',
      overflow: 'auto'
    });

    document.body.appendChild(P_DEBUG);
    P_DEBUG.innerHTML = '<div><a href="javascript:void(0)" class="toggle" style="color: #FFFFFF;">HIDE</a></div><div class="inner" />';

    const ELEM = {
      toggle: P_DEBUG.querySelector('.toggle'),
      inner: P_DEBUG.querySelector('.inner')
    };
    ELEM.toggle.addEventListener('click', () => {
      if (ELEM.inner.style.display !== 'none') {
        ELEM.inner.style.display = 'none';
        P_DEBUG.style.height = 'auto';
        ELEM.toggle.textContent = 'SHOW';
      } else {
        ELEM.inner.style.display = 'block';
        P_DEBUG.style.height = '100%';
        ELEM.toggle.textContent = 'HIDE';
      }
    });

    this.showDebug();

    window.addEventListener('resize', () => {
      if (this.rTimer.debug !== false) {
        clearTimeout(this.rTimer.debug);
      }

      this.rTimer.debug = setTimeout(() => {
        this.showDebug();
      }, 500);
    });

    window.addEventListener('scroll', () => {
      if (this.rTimer.debug !== false) {
        clearTimeout(this.rTimer.debug);
      }

      this.rTimer.debug = setTimeout(() => {
        this.showDebug();
      }, 500);
    });
  }
  /**
   * デバッグ情報の出力
   */
  showDebug() {
    let src = '';

    for (let key in this) {
      src += '<div><span style="font-weight: bold;">' + key + '</span> : ' + this[key] + '</div>';
    }

    document.querySelector('#pDebug .inner').innerHTML = src;
  }
  /**
   * strict対策blank open
   * @param 開くURL
   */
  openBlank() {
    window.open(url);
  }
  /**
   * 画像の先読み
   * @param 画像配列
   */
  preloadImg(args = []) {
    if (!args) return;

    for (var i = 0; i < args.length; i++) {
      const IMG = document.createElement('img');
      IMG.src = args[i];
    }
  };
  /**
   * GET値の取得
   * @return GET値をセットしたグローバル変数qsParm
   */
  setGETqs() {
    return this.qsParm;
  }
  /**
   * ブラウザ判定
   */
  setWb() {
    this.ua = window.navigator.userAgent.toLowerCase();
    this.isIE = this.ua.indexOf('msie') >= 0 || this.ua.indexOf('trident') >= 0;

    if (this.isIE) {
      let a = /(msie|rv:?)\s?([\d\.]+)/.exec(this.ua);
      let v = (a) ? a[2] : '';

      this.isIE6 = v.indexOf('6.', 0) === 0 ? true : false;
      this.isIE7 = v.indexOf('7.', 0) === 0 ? true : false;
      this.isIE8 = v.indexOf('8.', 0) === 0 ? true : false;
      this.isIE9 = v.indexOf('9.', 0) === 0 ? true : false;
      this.isIE10 = v.indexOf('10.', 0) === 0 ? true : false;
      this.isIE11 = v.indexOf('11.', 0) === 0 ? true : false;
    }

    this.isEdge = this.ua.indexOf('edge') >= 0;
  }
  /**
   * Webブラウザバージョンの取得
   */
  setWbVer() {
    if ( /*@cc_on!@*/ false) {
      this.userAgent = window.navigator.userAgent;
      this.ua = window.navigator.userAgent.toLowerCase();

      this.browserIE = 1;
      this.browser_n = 'IE';

      if (this.userAgent.match(/MSIE (¥d¥.¥d+)/)) {
        this.browser_v = parseFloat(RegExp.$1);
      } //IE6.7.8.9

    } else if (this.ua.indexOf('firefox') > -1) {
      this.browser_n = 'Firefox';
    } else if (this.ua.indexOf('opera') > -1) {
      this.browser_n = 'Opera';
    } else if (this.ua.indexOf('chrome') > -1) {
      this.browser_n = 'Chrome';
    } else if (this.ua.indexOf('safari') > -1) {
      this.browser_n = 'Safari';
    } else {
      this.browser_n = 'Unknown';
    }
  }
  /**
   * 画像切り替えロールオーバー
   */
  roImg() {
    const IMG_CACHE = [];

    document.querySelectorAll('a > .roImg').forEach((v, i) => {
      const TIME = Date.now();
      v.addEventListener('mouseenter', () => {

        if (this.isRespMode) return;

        const PARAMS = {};
        PARAMS.src = v.src;
        PARAMS.srcDot = PARAMS.src.lastIndexOf('.');
        PARAMS.srcOver = PARAMS.src.substr(0, PARAMS.srcDot) + '_on' + PARAMS.src.substr(PARAMS.srcDot, 4);

        IMG_CACHE[TIME] = PARAMS.src;

        v.src = PARAMS.srcOver;
      });

      v.addEventListener('mouseleave', e => {
        if (this.isRespMode) return;

        v.src = IMG_CACHE[TIME];
      });
    }, this);
  }
  /**
   * 画像透明度ロールオーバー
   */
  roOpa() {
    document.querySelectorAll('.jqHover').forEach((v, i) => {
      v.addEventListener('mouseenter', () => {
        if (this.isRespMode) return;

        Velocity(v, {
          opacity: .7
        }, {
          duration: 200
        });
      });

      v.addEventListener('mouseleave', () => {
        if (this.isRespMode) return;

        Velocity(v, {
          opacity: 1
        }, {
          duration: 200
        });
      });
    });
  }
  /**
   * 単純な高さ合わせ
   */
  adjList() {
    this.adjustSize('.adjList');

    window.addEventListener('resize', () => {
      if (this.rTimer.adjList !== false) {
        clearTimeout(this.rTimer.adjList);
      }
      this.rTimer.adjList = setTimeout(() => {
        this.adjustSize('.adjList');
      }, 500);
    });
  }
  /**
   * スムーススクロール
   * @param オフセット値
   * @param スピード
   * @param イージング
   */
  sScroll($offset, $duration, $easing) {
    document.querySelectorAll('a[href*="#"].scroll, area[href*="#"].scroll').forEach((v, i) => {
      v.addEventListener('click', e => {
        const PARAMS = {};
        PARAMS.anchor = e.target.href;
        PARAMS.anchorURL = PARAMS.anchor.split('#')[0];
        PARAMS.current = location.href;
        PARAMS.currentURL = PARAMS.current.split('#')[0];

        if (PARAMS.anchorURL === PARAMS.currentURL) {
          PARAMS.target = PARAMS.anchor.split('#');
          PARAMS.target = PARAMS.target.pop();
          PARAMS.target = '#' + PARAMS.target;

          const OFFSET = Number.isInteger($offset) ? $offset : 0;
          const DURATION = $duration !== 500 && Number.isInteger($duration) ? $duration : 500;
          const EASING = $easing !== 'cubic-bezier(0.11, 0, 0.5, 0)' ? $easing : 'cubic-bezier(0.11, 0, 0.5, 0)';
          const TARGET = document.querySelector(PARAMS.target);

          Velocity(TARGET, 'stop');
          Velocity(TARGET, 'scroll', {
            offset: OFFSET,
            duration: DURATION,
            easing: EASING
          });

          return false;
        }
      });
    });
  }
  /**
   * レスポンシブ状態のチェック
   * ※画面の内寸で比較するので要素がbody幅を超えている場合結果に注意
   * その場合は this.wWidth < this.spBreakPoint などで適宜比較する
   * @return 返り値なし
   */
  setRespMode() {
    this.wHeight = parseInt(document.documentElement.clientHeight);
    this.wWidth = parseInt(document.documentElement.clientWidth);
    this.wIWidth = parseInt(window.innerWidth);
    this.wIHeight = parseInt(window.innerHeight);
    this.isRespMode = this.wIWidth < this.spBreakPoint ? true : false;

    let oldMode = this.currentMode;
    this.currentMode = this.isRespMode ? 2 : 1;
    this.isChangeMode = oldMode !== this.currentMode ? true : false;

    document.body.classList.remove(this.viewOriMode);
    this.viewOriMode = this.wIHeight > this.wIWidth ? 'portrait' : 'landscape';
    this.isChangeWWidth = this.wIWidthCache !== this.wIWidth ? true : false;
    this.isChangeWHeight = this.wIHeightCache !== this.wIHeight ? true : false;

    document.body.classList.add(this.viewOriMode);
  }
  /**
   * スクロール位置の取得とセット
   */
  setScrPos() {
    this.scrTop = window.scrollY || window.pageYOffset;
    this.scrLeft = window.scrollX || window.pageXOffset;
  }
  /**
   * 標準的なpagetop(表示／非表示のみ)
   * 表示ポイントをpageTopPointに設定
   * 後から追加する要素には未対応
   */
  pageTop() {
    const PAGE_TOP_VOX = document.getElementById('pageTopVox');
    if (!PAGE_TOP_VOX) return;

    if (this.scrTop > this.pageTopPoint) {
      if (!this.isPageTopShow) {
        this.isPageTopShow = true;

        Velocity(PAGE_TOP_VOX, 'stop');
        PAGE_TOP_VOX.style.display = 'block';
        Velocity(PAGE_TOP_VOX, {
          opacity: 1
        }, {
          duration: 100
        });
      }
    } else {
      if (this.isPageTopShow) {
        this.isPageTopShow = false;
        Velocity(PAGE_TOP_VOX, 'stop');
        Velocity(PAGE_TOP_VOX, {
          opacity: 1
        }, {
          duration: 200,
          complete: () => {
            PAGE_TOP_VOX.style.display = 'none';
          }
        });
      }
    }
  }
  /**
   * iPhone / iPad / iPod / Android / winPhone 判定
   * @return 返り値なし
   */
  setMobile() {
    this.ua = window.navigator.userAgent.toLowerCase();

    this.isiPhone = this.ua.indexOf('iphone') != -1 ? true : false;
    this.isiPad = this.ua.indexOf('ipad') != -1 || this.ua.indexOf('macintosh') != -1 && 'ontouchend' in document ? true : false;
    this.isiPod = this.ua.indexOf('ipod') != -1 ? true : false;
    this.isAndroid = this.ua.indexOf('android') != -1 || this.ua.indexOf('android') != -1 ? true : false;
    this.isWinPhone = this.ua.indexOf('windows phone') != -1 ? true : false;

    this.isMobile = this.isiPhone || this.isiPad || this.isiPod || this.isAndroid || this.isWinPhone ? true : false;
  }
  /**
   * SP時電話番号自動リンク
   * 対象にdata-tel=""で番号指定
   */
  toggleSPTel() {
    if (!this.isRespMode) {
      document.querySelectorAll('.spTel').forEach(e => {
        const PARENT = e.parentNode;
        if (PARENT.tagName === 'A') {
          PARENT.before(e);
          PARENT.remove();
        }
      });
    } else {
      document.querySelectorAll('.spTel').forEach(e => {
        const TEL = e.getAttribute('data-tel');
        console.log(TEL);
        const PARENT = e.parentNode;
        if (PARENT.tagName !== 'A') {
          const WRAP = document.createElement('a');
          e.before(WRAP);
          WRAP.append(e);
          WRAP.href = 'tel:' + TEL;
        }
      });
    }
  }
  /**
   * コンテンツを比率に合わせ変形
   * init時指定パラメータ(配列)
   * w: 基準とする幅 (int)
   * bp: 実行する幅を指定 (int)
   */
  ratioAdjust($options = {}) {
    const PARAMS = {
      r: 1,
      h: [],
      w: 375,
      bp: this.spBreakPoint,
      to: 'left top'
    };

    const METHODS = {};

    METHODS.init = $options => {
      if ($options && $options.w) PARAMS.w = $options.w;
      if ($options && $options.bp) PARAMS.bp = $options.bp;
      if ($options && $options.to) PARAMS.to = $options.to;

      setTimeout(() => {
        METHODS.setH();
        METHODS.adjust();
      }, 1500);

      window.addEventListener('resize', METHODS.doEvent);
    };

    function setH() {
      document.querySelectorAll('.rAdjust').forEach((v, i) => {
        v.style.height = 'auto';
        PARAMS.h[i] = v.style.height;
      });
    };
    METHODS.setR = () => {
      ratio = this.wWidth < PARAMS.bp ? window.innerWidth / PARAMS.w : 1,
        PARAMS.r = ratio.toFixed(2);
      // console.log(this.ratioAdjust.PARAMS.r);
    };
    METHODS.adjust = () => {
      METHODS.setR();

      document.querySelectorAll('.rAdjust').forEach((v, i) => {
        Object.assign(v.style, {
          transformOrigin: PARAMS.to,
          transform: 'scale(' + PARAMS.r + ')'
        });
        if (PARAMS.r > 1 || PARAMS.r < 1) {
          h = this.wWidth < PARAMS.bp ? PARAMS.h[i] * PARAMS.r : 'auto';
        } else {
          h = 'auto';
        }
        v.style.height = h;
      });
    };
    METHODS.doEvent = () => {
      if (this.rTimer.ratio !== false) {
        clearTimeout(this.rTimer.ratio);
      }

      this.rTimer.ratio = setTimeout(() => {
        METHODS.adjust();

        if (this.isChangeMode) {
          METHODS.reset();
        }
      }, 1000);
    }
    METHODS.destroy = () => {
      window.removeEventListener('resize', doEvent);

      document.querySelectorAll('.rAdjust').forEach((v, i) => {
        Object.assign(v.style, {
          transform: 'scale(1)',
          height: 'auto'
        });
      });
    }
    METHODS.reset = () => {
      METHODS.destroy();
      METHODS.init();
    }
  }
  /**
   * 子要素の高さ合わせ
   * @param {対象セレクタ} $selector 
   * @param {オプション type, plus} $options 
   * @returns なし
   */
  adjustSize($selector, $options = {}) {
    const COLLECTION = [];
    document.querySelectorAll($selector).forEach((v, i) => {
      COLLECTION.push(v.children);
    });
    if (!COLLECTION) return false;

    const OPTIONS = {
      type: $options.height || 'normal',
      plus: $options.plus || 0
    };

    COLLECTION.forEach((value, index) => {
      let setHeight = 0;
      let count = 0;
      const LENGTH = value.length;

      Array.prototype.forEach.call(value, (v, i) => {
        v.style.height = 'auto';
        let getHeight = 0;
        const images = [];
        let flow = [];

        v.querySelectorAll('img').forEach((vv) => {
          images.push(vv.src);
        });

        const CALLBACK = () => {
          switch (OPTIONS.type) {
            case 'inner':
              getHeight = v.clientHeight;
              break;
            case 'outer':
              getHeight = v.offsetHeight;
              break;
            default:
              getHeight = v.offsetHeight;
          }

          setHeight = getHeight > setHeight ? getHeight : setHeight;
          count++;
        };

        if (images.length) {
          for (let i = 0; i < images.length; i++) {
            flow[i] = new Promise((resolve, reject) => {
              const IMG = document.createElement('img');
              IMG.src = images[i];

              const IMG_PRE_LOADER = new Image();
              IMG_PRE_LOADER.src = images[i];
              IMG_PRE_LOADER.onload = () => {
                resolve();
              };
              IMG_PRE_LOADER.onerror = () => {
                reject('error');
              };
            });
          }
          Promise.all(flow).then(() => {
            CALLBACK();
          });
        } else {
          CALLBACK();
        }

        let timer = setInterval(() => {
          if (count !== LENGTH) return;

          v.style.height = setHeight + OPTIONS.plus + 'px';
          clearInterval(timer);
        }, 50);
      });
    });
  }
  /**
   * popupAdjust
   * @param {*} $options 
   */
  popupAdjust($options = {}) {
    let scrTopTemp = 0;
    let isOpen = false;
    let isAllowClose = false;
    let popupTarget = '';

    const OPTIONS = {
      wrapper: $options.wrapper || '#wrapper',
      bg: $options.bg || '#alphaBg',
      isUnlock: $options.isUnlock || true,
      isSpFixed: $options.isSpFixed || true,
      bgOpacity: $options.bgOpacity || .8,
      durationChange: $options.durationChange || 200,
      durationClose: $options.durationClose || 150,
      onComplete: $options.onComplete || false
    };

    const CSS = document.createElement('style');
    document.head.appendChild(CSS);
    CSS.sheet.insertRule('body.pOpenUnlock { overflow: visible; }', CSS.sheet.length);
    CSS.sheet.insertRule('body.pOpenFixed { position: fixed; }', CSS.sheet.length);

    const METHODS = {};

    METHODS.init = () => {
      if (!document.querySelector(OPTIONS.bg)) {
        const ALPHA_BG = document.createElement('div');
        ALPHA_BG.id = 'alphaBg';
        document.querySelector(OPTIONS.wrapper).prepend(ALPHA_BG)
      }

      const POPUP_IDS = [];

      document.querySelectorAll('.popupBtItem:not(.exclude)').forEach((v, i) => {
        const POPUP_ID = v.getAttribute('data-popup');

        if (POPUP_IDS.includes(POPUP_ID) !== true) {
          POPUP_IDS.push(POPUP_ID);
        }
      });

      document.querySelectorAll('#popupContents .content').forEach((v, i) => {
        const SRC = v.innerHTML;
        const GROUP = v.getAttribute('data-group');

        const POPUP_SRC = document.createElement('div');
        POPUP_SRC.className = 'popupWrapper vertical';
        POPUP_SRC.innerHTML = '<div class="closeVox"><a href="javascript:void(0)" class="popupCloseBt"><span><!-- --></span><span><!-- --></span></a></div><div class="contentWrapper"><div class="content"><!-- --></div></div>';

        document.querySelector(OPTIONS.wrapper).appendChild(POPUP_SRC);
        POPUP_SRC.id = POPUP_IDS[i];
        if (GROUP) POPUP_SRC.classList.add(GROUP);
        document.querySelector('#' + POPUP_IDS[i]).querySelector('.content').innerHTML = SRC;
        v.remove();
      });

      document.querySelectorAll('.popupCloseBt, ' + OPTIONS.bg + ', .popupBtItemClose').forEach((v, i) => {
        v.addEventListener('click', () => {
          if (document.querySelector('.popupWrapper, ' + OPTIONS.bg).classList.contains('velocity-animating') || !isAllowClose) return;
          document.body.classList.remove('pOpen', 'pOpenUnlock');
          if (this.isRespMode && OPTIONS.isSpFixed) {
            document.body.classList.remove('pOpenFixed');
            window.scrollTo(0, scrTopTemp);
          }
          METHODS.close();
        });
      });

      document.addEventListener('keydown', () => {
        if (isOpen && e.keyCode === 27) {
          if (document.querySelector('.popupWrapper, ' + OPTIONS.bg).classList.contains('velocity-animating') || !isAllowClose) return;
          document.body.classList.remove('pOpen', 'pOpenUnlock');
          if (this.isRespMode && OPTIONS.isSpFixed) {
            document.body.classList.remove('pOpenFixed');
            window.scrollTo(0, scrTopTemp);
          }
          METHODS.close();
        }
      });

      document.querySelectorAll('.popupBtItem').forEach((v, i) => {
        v.addEventListener('click', () => {
          document.querySelectorAll('.popupWrapper, ' + OPTIONS.bg).forEach((vv) => {
            if (vv.classList.contains('velocity-animating')) return;
          });

          const ID = v.getAttribute('data-popup');
          popupTarget = '#' + ID;

          document.querySelector(popupTarget).style.opacity = 0;
          document.querySelector(popupTarget).style.display = 'block';

          METHODS.change('#' + ID);

          document.querySelector(popupTarget).style.display = 'none';
          document.querySelector(popupTarget).style.opacity = 1;

          document.body.classList.add('pOpen');
        });
      });

      if (typeof OPTIONS.onComplete === 'function') {
        OPTIONS.onComplete();
      }
    };

    METHODS.change = id => {
      if (!isOpen) {
        isOpen = true;

        METHODS.adjust(id);

        document.querySelector(OPTIONS.bg).style.display = 'block';
        Velocity(document.querySelector(OPTIONS.bg), 'stop');
        Velocity(document.querySelector(OPTIONS.bg), {
          opacity: OPTIONS.bgOpacity
        }, {
          duration: OPTIONS.durationChange,
          complete: () => {
            Velocity(document.querySelector(id), 'fadeIn', {
              duration: OPTIONS.durationChange,
              complete: () => {
                isAllowClose = true;
              }
            });
          }
        });
      }
    };

    METHODS.close = () => {
      document.querySelectorAll('.popupWrapper').forEach((v, i) => {
        Velocity(v, 'fadeOut', {
          duration: OPTIONS.durationClose,
          complete: () => {
            Velocity(document.querySelector(OPTIONS.bg), 'stop');
            Velocity(document.querySelector(OPTIONS.bg), {
              opacity: 0,
            }, {
              duration: OPTIONS.durationClose,
              complete: () => {
                document.querySelector(OPTIONS.bg).style.display = 'none';
                document.querySelector('.popupWrapper').style.display = 'none';
                isOpen = false;
              }
            });
            document.querySelectorAll('.popupWrapper.movie .content').forEach((vv, i) => {
              if (vv) vv.innerHTML = '';
            });
          }
        });
      });
    };

    METHODS.adjust = target => {
      if (!target) target = popupTarget;

      const POPUP_HEIGHT = document.querySelector(target).offsetHeight;
      const POPUP_WIDTH = document.querySelector(target).offsetWidth;
      const TOP_POS = this.wHeight > POPUP_HEIGHT ? (this.wHeight - POPUP_HEIGHT) / 2 : 0;
      const LEFT_POS = this.wWidth > POPUP_WIDTH ? (this.wWidth - POPUP_WIDTH) / 2 : 0;

      scrTopTemp = this.scrTop;

      if (OPTIONS.isUnlock) {
        if (POPUP_HEIGHT >= this.wHeight) {
          document.body.classList.add('pOpenUnlock');
        }
      }
      document.querySelector(target).style.top = TOP_POS + this.scrTop + 'px';
      if (this.isRespMode && OPTIONS.isSpFixed) {
        document.body.classList.add('pOpenFixed');
        document.body.style.top = -scrTopTemp;
      }
    };

    METHODS.init();
  }
  /**
   * 画像をSP用に差し替え
   * 頭にSP_のついた画像を用意
   * @param {*} $target 
   * @param {*} $options 
   */
  replaceImageSP($target = '.rplSPImg', $options = {}) {
    const OPTIONS = {
      pcName: $options.pcName || 'PC_',
      spName: $options.spName || 'SP_',
      breakPoint: $options.breakPoint || this.spBreakPoint
    };

    const METHODS = {};

    METHODS.init = () => {
      window.addEventListener('resize', METHODS.adjust);
    };

    METHODS.adjust = () => {
      return document.querySelectorAll($target).forEach((v, i) => {
        if (this.wWidth >= OPTIONS.breakPoint) {
          v.src = v.src.replace(OPTIONS.spName, OPTIONS.pcName);
        } else {
          v.src = v.src.replace(OPTIONS.pcName, OPTIONS.spName);
        }
      });
    };

    METHODS.destroy = () => {
      window.removeEventListener('resize', METHODS.adjust);
    };

    METHODS.init();
  }
  /**
   * ボックスのフローアニメーション
   * @param {*} $target 
   * @param {*} $options 
   */
  flowVox($target, $options = {}) {
    const PARAMS = [];
    let time = '';
    let observer = [];

    const METHODS = {};

    METHODS.init = $options => {
      time = Date.now();

      PARAMS[time] = {
        time: time,
        options: {},
        flowAnime: [],
        isFlowDefault: false
      };

      PARAMS[time].options = {
        translate: $options.translate || 60,
        duration: $options.duration || 600,
        delay: $options.delay || 300,
        easing: $options.easing || 'cubic-bezier(0.33, 1, 0.68, 1)',
        autorun: $options.autorun || true, // 自動実行
        per: $options.per || (this.wWidth > this.wHeight ? 0.6 : 0.95), // 発火タイミング
        zoomIn: $options.zoomIn || 1.2, // zoomの最大サイズ
        zoomInDuration: $options.zoomInDuration || 300, // zoonの最大サイズへのデュレーション
        zoomOutDuration: $options.zoomOutDuration || 150, // zoonの元サイズへのデュレーション,
        isRepeat: $options.isRepeat || false
      };

      // console.log(PARAMS[time].options)

      observer[time] = new IntersectionObserver(METHODS.throw, {
        root: null,
        rootMargin: '0px',
        threshold: PARAMS[time].options.per
      });

      document.querySelectorAll($target).forEach((v, i) => {
        v.props = {
          mode: v.getAttribute('data-flow') || 'up',
          target: v.children.length > 1 ? v.children : v,
          isDone: false
        };

        switch (v.props.mode) {
          case 'down':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.props.target.style.visibility = 'visible';
                Velocity(vv.props.target, {
                  translateY: -PARAMS[time].options.translate,
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                translateY: -PARAMS[time].options.translate,
                opacity: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'left':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.props.target.style.visibility = 'visible';
                Velocity(vv.props.target, {
                  translateX: PARAMS[time].options.translate,
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                translateX: PARAMS[time].options.translate,
                opacity: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'right':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.props.target.style.visibility = 'visible';
                Velocity(vv.props.target, {
                  translateX: -PARAMS[time].options.translate,
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                translateX: -PARAMS[time].options.translate,
                opacity: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'leftdown':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.props.target.style.visibility = 'visible';
                Velocity(vv.props.target, {
                  translateX: PARAMS[time].options.translate,
                  translateY: -PARAMS[time].options.translate,
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                translateX: PARAMS[time].options.translate,
                translateY: -PARAMS[time].options.translate,
                opacity: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'rightdown':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.props.target.style.visibility = 'visible';
                Velocity(vv.props.target, {
                  translateX: -PARAMS[time].options.translate,
                  translateY: -PARAMS[time].options.translate,
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                translateX: -PARAMS[time].options.translate,
                translateY: -PARAMS[time].options.translate,
                opacity: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'leftup':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.props.target.style.visibility = 'visible';
                Velocity(vv.props.target, {
                  translateX: PARAMS[time].options.translate,
                  translateY: PARAMS[time].options.translate,
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                translateX: PARAMS[time].options.translate,
                translateY: PARAMS[time].options.translate,
                opacity: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'rightup':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.props.target.style.visibility = 'visible';
                Velocity(vv.props.target, {
                  translateX: -PARAMS[time].options.translate,
                  translateY: PARAMS[time].options.translate,
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                translateX: -PARAMS[time].options.translate,
                translateY: PARAMS[time].options.translate,
                opacity: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'zoom':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.style.visibility = 'visible';
                Velocity(vv, {
                  scale: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                scale: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'away':
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.props.target.style.visibility = 'visible';
                Velocity(vv.props.target, {
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                opacity: 0
              }, {
                duration: 1
              });
            }
            break;
          case 'mark':
            // $(this).parent().unwrap();
            break;
          default:
            if (v.props.target.length > 1) {
              Array.prototype.forEach.call(v.props.target, (vv, ii) => {
                vv.style.visibility = 'visible';
                Velocity(vv, {
                  translateY: PARAMS[time].options.translate,
                  opacity: 0
                }, {
                  duration: 1
                });
              });
            } else {
              v.props.target.style.visibility = 'visible';
              Velocity(v.props.target, {
                translateY: PARAMS[time].options.translate,
                opacity: 0
              }, {
                duration: 1
              });
            }
        }

        observer[time].observe(v);
      });
    };

    METHODS.throw = entries => {
      entries.forEach(entry => {
        // console.log(entry)
        const IS_VISIBLE = entry.isIntersecting ? true : false;
        METHODS.run(entry.target, IS_VISIBLE);
      });
    };

    METHODS.run = (elem, isVisible) => {
      // console.log(elem, elem.props, isVisible)
      // console.log(PARAMS[time].options.isRepeat)
      if (elem.props.isDone) return;
      switch (elem.props.mode) {
        case 'zoom':
          if (!isVisible) return;
          if (elem.props.target.length > 1) {
            Array.prototype.forEach.call(elem.props.target, (v, i) => {
              Velocity(v, 'stop');
              Velocity(v, {
                scale: PARAMS[time].options.zoomIn
              }, {
                duration: PARAMS[time].options.zoomInDuration,
                delay: i * PARAMS[time].options.delay,
                easing: PARAMS[time].options.easing,
                complete: () => {
                  Velocity(v, {
                    scale: 1.0
                  }, {
                    duration: PARAMS[time].options.zoomOutDuration
                  });
                }
              });
            });
          } else {
            Velocity(elem.props.target, 'stop');
            Velocity(elem.props.target, {
              scale: PARAMS[time].options.zoomIn
            }, {
              duration: PARAMS[time].options.zoomInDuration,
              easing: 'easeInQuint',
              complete: () => {
                Velocity(elem.props.target, {
                  scale: 1.0
                }, {
                  duration: PARAMS[time].options.zoomOutDuration
                });
              }
            });
          }
          break;
        case 'away':
          if (!isVisible) return;
          if (elem.props.target.length > 1) {
            Array.prototype.forEach.call(elem.props.target, (v, i) => {
              Velocity(v, 'stop');
              Velocity(v, {
                opacity: 1
              }, {
                duration: PARAMS[time].options.duration,
                delay: i * PARAMS[time].options.delay,
                easing: PARAMS[time].options.easing
              });
            });
          } else {
            Velocity(elem.props.target, 'stop');
            Velocity(elem.props.target, {
              scale: PARAMS[time].options.zoomIn
            }, {
              duration: PARAMS[time].options.zoomInDuration,
              easing: 'easeInQuint',
              complete: () => {
                Velocity(elem.props.target, {
                  opacity: 1
                }, {
                  duration: PARAMS[time].options.duration,
                  easing: PARAMS[time].options.easing
                });
              }
            });
          }
          break;
        case 'mark':
          if (isVisible) {
            if (elem.props.target.length > 1) {
              Array.prototype.forEach.call(elem.props.target, (v, i) => {
                setTimeout(() => {
                  v.classList.add('flowActive');
                }, i * PARAMS[time].options.delay);
              });
            } else {
              elem.props.taregt.classList.add('flowActive');
            }
          } else {
            if (elem.props.target.length > 1) {
              Array.prototype.forEach.call(elem.props.target, (v, i) => {
                setTimeout(() => {
                  v.classList.remove('flowActive');
                }, i * PARAMS[time].options.delay);
              });
            } else {
              elem.props.taregt.classList.remove('flowActive');
            }
          }
          break;
        default:
          if (!isVisible) return;
          if (elem.props.target.length > 1) {
            Array.prototype.forEach.call(elem.props.target, (v, i) => {
              Velocity(v, 'stop');
              Velocity(v, {
                translateX: 0,
                translateY: 0,
                opacity: 1
              }, {
                duration: PARAMS[time].options.duration,
                delay: i * PARAMS[time].options.delay,
                easing: PARAMS[time].options.easing
              });
            });
          } else {
            Velocity(elem.props.target, 'stop');
            Velocity(elem.props.target, {
              translateX: 0,
              translateY: 0,
              opacity: 1
            }, {
              duration: PARAMS[time].options.zoomInDuration,
              easing: 'easeInQuint',
              complete: () => {
                Velocity(elem.props.target, {
                  scale: 1.0
                }, {
                  duration: PARAMS[time].options.duration,
                  easing: PARAMS[time].options.easing
                });
              }
            });
          }
      }

      if (!PARAMS[time].options.isRepeat) elem.props.isDone = true;
    }

    METHODS.init($options);
  }
}