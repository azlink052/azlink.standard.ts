/**
 * ================================================
 *
 * [javascript Common]
 * 必須ライブラリ : velocity, Flow
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2021.05.14
 *
 * ================================================
 */
const _az = {};
/**
 * global params
 */
_az.params = {
  qsParm: [], // GETパラメータ
  userAgent: '',
  browserIE: 0, // IE判定
  browser_v: 0, // IEバージョン番号
  browser_n: '', // browser名
  ua: '', // UA
  isIE: false, // IE判定
  isIE6: false, // IE6判定
  isIE7: false, // IE7判定
  isIE8: false, // IE8判定
  isIE9: false, // IE9判定
  isIE10: false, // IE10判定
  isIE11: false, // IE11判定
  isEdge: false, // Edge判定
  isiPhone: false, // iPhone判定
  isiPad: false, // iPad判定
  isiPod: false, // iPod判定
  isAndroid: false, // Android判定
  isWinPhone: false, // WinPhone判定
  isMobile: false, // Mobile判定 (getMobile結果)
  isNavOpen: false, // メニュー開閉判定(スマフォメニューなどに使用)
  spBreakPoint: 768, // ブレークポイント
  wWidth: 0, // ウィンドウ幅
  wHeight: 0, // ウィンドウ高さ
  wIWidth: 0, // ウィンドウ幅 (innerWidth)
  wIHeight: 0, // ウィンドウ高さ (innerHeight)
  wIWidthCache: 0, // ウィンドウ幅のキャッシュ (innerWidth)
  wIHeightCache: 0, // ウィンドウ高のキャッシュ (innerWidth)
  dspWidth: parseInt(window.parent.screen.width), // 画面の幅
  dspHeight: parseInt(window.parent.screen.height), // 画面の高さ
  isRespMode: false, // レスポンシブ判定
  isChangeWWidth: false, // 画面幅の変更判定
  isChangeWHeight: false, // 画面高の変更判定
  isPageTopShow: false, // pagetop表示判定
  pageTopPoint: 100, // pagetop表示Y座標
  scrTop: 0, // Y軸スクロール量
  scrLeft: 0, // X軸スクロール量
  orgMode: null, // ロード時のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
  currentMode: null, // 現在のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
  isChangeMode: false, // レスポンシブ状態が変更になったらtrue
  viewOriMode: 'landscape', // 画面モード landscape / portrait
  isDebug: false, // デバッグモード判定
  rTimer: {}, // イベント制御用タイマー
  resizeTimer: false, // イベント制御用タイマー
  tmp: {} // 作業用
};
// jQuery不要なパラメータのセット
_az.params.tmp.query = window.location.search.substring(1);
_az.params.tmp.parms = _az.params.tmp.query.split('&');

for (let i = 0; i < _az.params.tmp.parms.length; i++) {
  const pos = _az.params.tmp.parms[i].indexOf('=');

  if (pos > 0) {
    const key = _az.params.tmp.parms[i].substring(0, pos);
    const val = _az.params.tmp.parms[i].substring(pos + 1);

    _az.params.qsParm[key] = val;
  }
}

_az.params.wHeight = parseInt(document.documentElement.clientHeight);
_az.params.wWidth = parseInt(document.documentElement.clientWidth);
_az.params.wIWidth = parseInt(window.innerWidth);
_az.params.wIHeight = parseInt(window.innerHeight);
_az.params.isRespMode = _az.params.wIWidth < _az.params.spBreakPoint ? true : false;
_az.params.orgMode = _az.params.currentMode = _az.params.isRespMode ? 2 : 1;

_az.params.ua = window.navigator.userAgent.toLowerCase();
_az.params.isIE = _az.params.ua.indexOf('msie') >= 0 || _az.params.ua.indexOf('trident') >= 0;

if (_az.params.isIE) {
  a = /(msie|rv:?)\s?([\d\.]+)/.exec(_az.params.ua);
  v = (a) ? a[2] : '';

  _az.params.isIE6 = v.indexOf('6.', 0) === 0 ? true : false;
  _az.params.isIE7 = v.indexOf('7.', 0) === 0 ? true : false;
  _az.params.isIE8 = v.indexOf('8.', 0) === 0 ? true : false;
  _az.params.isIE9 = v.indexOf('9.', 0) === 0 ? true : false;
  _az.params.isIE10 = v.indexOf('10.', 0) === 0 ? true : false;
  _az.params.isIE11 = v.indexOf('11.', 0) === 0 ? true : false;
}

_az.params.isEdge = _az.params.ua.indexOf('edge') >= 0;

if ( /*@cc_on!@*/ false) {
  _az.params.userAgent = window.navigator.userAgent;
  _az.params.ua = window.navigator.userAgent.toLowerCase();

  _az.params.browserIE = 1;
  _az.params.browser_n = 'IE';

  if (_az.params.userAgent.match(/MSIE (¥d¥.¥d+)/)) {
    _az.params.browser_v = parseFloat(RegExp.$1);
  } //IE6.7.8.9

} else if (_az.params.ua.indexOf('firefox') > -1) {
  _az.params.browser_n = 'Firefox';
} else if (_az.params.ua.indexOf('opera') > -1) {
  _az.params.browser_n = 'Opera';
} else if (_az.params.ua.indexOf('chrome') > -1) {
  _az.params.browser_n = 'Chrome';
} else if (_az.params.ua.indexOf('safari') > -1) {
  _az.params.browser_n = 'Safari';
} else {
  _az.params.browser_n = 'Unknown';
}

_az.params.ua = window.navigator.userAgent.toLowerCase();

_az.params.isiPhone = _az.params.ua.indexOf('iphone') != -1 ? true : false;
_az.params.isiPad = _az.params.ua.indexOf('ipad') != -1 || _az.params.ua.indexOf('macintosh') != -1 && 'ontouchend' in document ? true : false;
_az.params.isiPod = _az.params.ua.indexOf('ipod') != -1 ? true : false;
_az.params.isAndroid = _az.params.ua.indexOf('android') != -1 || _az.params.ua.indexOf('android') != -1 ? true : false;
_az.params.isWinPhone = _az.params.ua.indexOf('windows phone') != -1 ? true : false;

_az.params.isMobile = _az.params.isiPhone || _az.params.isiPad || _az.params.isiPod || _az.params.isAndroid || _az.params.isWinPhone ? true : false;
/**
 * functions
 */
_az.util = {};
/**
 * 実行
 * OFFにしたいものはfalseを渡す
 * 例) _az.util.init({setWb: false})
 * ブレークポイント等パラメータの変更はinitの前に行う
 * _az.params.spBreakPoint = 968
 * _az.util.init()
 */
_az.util.init = (params) => {
  // console.log('setWb' in params)
  params = typeof params === 'undefined' ? {} : params;
  const opts = {
    // setWb: 'setWb' in params && params.setWb === false ? false : true,
    setGETqs: 'setGETqs' in params && params.setGETqs === false ? false : true,
    checkRespMode: 'checkRespMode' in params && params.checkRespMode === false ? false : true,
    // setWbVer: 'setWbVer' in params && params.setWbVer === false ? false : true,
    sScroll: 'sScroll' in params && params.sScroll === false ? false : true,
    getScrPos: 'getScrPos' in params && params.getScrPos === false ? false : true,
    // getMobile: 'getMobile' in params && params.getMobile === false ? false : true,
    roImg: 'roImg' in params && params.roImg === false ? false : true,
    roOpa: 'roOpa' in params && params.roOpa === false ? false : true,
    adjList: 'adjList' in params && params.adjList === false ? false : true,
    pageTop: 'pageTop' in params && params.pageTop === false ? false : true,
    toggleSPTel: 'toggleSPTel' in params && params.toggleSPTel === false ? false : true,
    initDebug: 'initDebug' in params && params.initDebug === false ? false : true
  };
  // console.log(opts)
  // if (opts.setWb) _az.util.setWb();
  if (!opts.setGETqs === false) _az.util.setGETqs();
  if (!opts.checkRespMode === false) _az.util.checkRespMode();
  // if (!opts.setWbVer === false) _az.util.setWbVer();
  if (!opts.sScroll === false) _az.util.sScroll();
  if (!opts.getScrPos === false) _az.util.getScrPos();
  // if (!opts.getMobile === false) _az.util.getMobile();
  if (!opts.roImg === false) _az.util.roImg();
  if (!opts.roOpa === false) _az.util.roOpa();
  if (!opts.adjList === false) _az.util.adjList();
  if (!opts.pageTop === false) _az.util.pageTop();
  if (!opts.toggleSPTel === false) _az.util.toggleSPTel();
  if (!opts.initDebug === false) _az.util.initDebug();
  window.addEventListener('resize', () => {
    if (_az.params.rTimer.checkRespMode !== false) {
      clearTimeout(_az.params.rTimer.checkRespMode);
    }
    _az.params.rTimer.checkRespMode = setTimeout(() => {
      if (!opts.checkRespMode === false) _az.util.checkRespMode();
    }, 250);

    if (_az.params.rTimer.toggleSPTel !== false) {
      clearTimeout(_az.params.rTimer.toggleSPTel);
    }
    _az.params.rTimer.toggleSPTel = setTimeout(() => {
      if (!opts.toggleSPTel === false) _az.util.toggleSPTel();
    }, 250);
  })
  window.addEventListener('scroll', () => {
    if (!opts.getScrPos === false) _az.util.getScrPos();
    if (!opts.pageTop === false) _az.util.pageTop();
  });
};
/**
 * デバッグの準備
 */
_az.util.initDebug = () => {
  if (!_az.params.isDebug) return;

  const pDebug = document.createElement('div');
  pDebug.id = 'pDebug';
  Object.assign(pDebug.style, {
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

  document.body.appendChild(pDebug);
  pDebug.innerHTML = '<div><a href="javascript:void(0)" class="toggle" style="color: #FFFFFF;">HIDE</a></div><div class="inner" />';

  const elem = {
    toggle: pDebug.querySelector('.toggle'),
    inner: pDebug.querySelector('.inner')
  };
  elem.toggle.addEventListener('click', () => {
    if (elem.inner.style.display !== 'none') {
      elem.inner.style.display = 'none';
      pDebug.style.height = 'auto';
      elem.toggle.textContent = 'SHOW';
    } else {
      elem.inner.style.display = 'block';
      pDebug.style.height = '100%';
      elem.toggle.textContent = 'HIDE';
    }
  });

  _az.util.showDebug();

  window.addEventListener('resize', () => {
    if (_az.params.rTimer.debug !== false) {
      clearTimeout(_az.params.rTimer.debug);
    }

    _az.params.rTimer.debug = setTimeout(() => {
      _az.util.showDebug();
    }, 500);
  });

  window.addEventListener('scroll', () => {
    if (_az.params.rTimer.debug !== false) {
      clearTimeout(_az.params.rTimer.debug);
    }

    _az.params.rTimer.debug = setTimeout(() => {
      _az.util.showDebug();
    }, 500);
  });
};
/**
 * デバッグ情報の出力
 */
_az.util.showDebug = () => {
  let src = '';

  for (let key in _az.params) {
    src += '<div><span style="font-weight: bold;">' + key + '</span> : ' + _az.params[key] + '</div>';
  }

  document.querySelector('#pDebug .inner').innerHTML = src;
};
/**
 * strict対策blank open
 * @param 開くURL
 */
_az.util.openBlank = url => {
  window.open(url);
};
/**
 * 画像の先読み
 * @param 画像配列
 */
_az.util.preloadImg = arguments => {
  if (!arguments) return;

  for (var i = 0; i < arguments.length; i++) {
    const img = document.createElement('img');
    img.src = arguments[i];
  }
};
/**
 * GET値の取得
 * @return GET値をセットしたグローバル変数qsParm
 */
_az.util.setGETqs = () => {
  return _az.params.qsParm;
};
/**
 * ブラウザ判定
 */
_az.util.setWb = () => {
  _az.params.ua = window.navigator.userAgent.toLowerCase();
  _az.params.isIE = _az.params.ua.indexOf('msie') >= 0 || _az.params.ua.indexOf('trident') >= 0;

  if (_az.params.isIE) {
    a = /(msie|rv:?)\s?([\d\.]+)/.exec(_az.params.ua);
    v = (a) ? a[2] : '';

    _az.params.isIE6 = v.indexOf('6.', 0) === 0 ? true : false;
    _az.params.isIE7 = v.indexOf('7.', 0) === 0 ? true : false;
    _az.params.isIE8 = v.indexOf('8.', 0) === 0 ? true : false;
    _az.params.isIE9 = v.indexOf('9.', 0) === 0 ? true : false;
    _az.params.isIE10 = v.indexOf('10.', 0) === 0 ? true : false;
    _az.params.isIE11 = v.indexOf('11.', 0) === 0 ? true : false;
  }

  _az.params.isEdge = _az.params.ua.indexOf('edge') >= 0;
};
/**
 * Webブラウザバージョンの取得
 */
_az.util.setWbVer = () => {
  if ( /*@cc_on!@*/ false) {
    _az.params.userAgent = window.navigator.userAgent,
      _az.params.ua = window.navigator.userAgent.toLowerCase();

    _az.params.browserIE = 1;
    _az.params.browser_n = 'IE';

    if (_az.params.userAgent.match(/MSIE (¥d¥.¥d+)/)) {
      _az.params.browser_v = parseFloat(RegExp.$1);
    } //IE6.7.8.9

  } else if (_az.params.ua.indexOf('firefox') > -1) {
    _az.params.browser_n = 'Firefox';
  } else if (_az.params.ua.indexOf('opera') > -1) {
    _az.params.browser_n = 'Opera';
  } else if (_az.params.ua.indexOf('chrome') > -1) {
    _az.params.browser_n = 'Chrome';
  } else if (_az.params.ua.indexOf('safari') > -1) {
    _az.params.browser_n = 'Safari';
  } else {
    _az.params.browser_n = 'Unknown';
  }
};
/**
 * 画像切り替えロールオーバー
 */
_az.util.roImg = () => {
  const imgCache = [];

  document.querySelectorAll('a > .roImg').forEach((v, i) => {
    const time = Date.now();
    v.addEventListener('mouseenter', () => {

      if (_az.params.isRespMode) return;

      const params = {};
      params.src = v.src;
      params.srcDot = params.src.lastIndexOf('.');
      params.srcOver = params.src.substr(0, params.srcDot) + '_on' + params.src.substr(params.srcDot, 4);

      imgCache[time] = params.src;

      v.src = params.srcOver;
    });

    v.addEventListener('mouseleave', e => {
      if (_az.params.isRespMode) return;

      v.src = imgCache[time];
    });
  }, this);
};
/**
 * 画像透明度ロールオーバー
 */
_az.util.roOpa = () => {
  document.querySelectorAll('.jqHover').forEach((v, i) => {
    v.addEventListener('mouseenter', () => {
      if (_az.params.isRespMode) return;

      Velocity(v, {
        opacity: .7
      }, {
        duration: 200
      });
    });

    v.addEventListener('mouseleave', () => {
      if (_az.params.isRespMode) return;

      Velocity(v, {
        opacity: 1
      }, {
        duration: 200
      });
    });
  });
};
/**
 * 単純な高さ合わせ
 */
_az.util.adjList = () => {
  _az.util.adjustSize('.adjList');

  window.addEventListener('resize', () => {
    if (_az.params.rTimer.adjList !== false) {
      clearTimeout(_az.params.rTimer.adjList);
    }
    _az.params.rTimer.adjList = setTimeout(() => {
      _az.util.adjustSize('.adjList');
    }, 500);
  });
};
/**
 * スムーススクロール
 * @param オフセット値
 * @param スピード
 * @param イージング
 */
_az.util.sScroll = ($offset, $duration, $easing) => {
  document.querySelectorAll('a[href*="#"].scroll, area[href*="#"].scroll').forEach((v, i) => {
    v.addEventListener('click', e => {
      const params = {};
      params.anchor = e.target.href;
      params.anchorURL = params.anchor.split('#')[0];
      params.current = location.href;
      params.currentURL = params.current.split('#')[0];

      if (params.anchorURL === params.currentURL) {
        params.target = params.anchor.split('#');
        params.target = params.target.pop();
        params.target = '#' + params.target;

        const offset = Number.isInteger($offset) ? $offset : 0;
        const duration = $duration !== 500 && Number.isInteger($duration) ? $duration : 500;
        const easing = $easing !== 'easeInQuad' ? $easing : 'easeInQuad';
        const target = document.querySelector(params.target);

        Velocity(target, 'stop');
        Velocity(target, 'scroll', {
          offset: offset,
          duration: duration,
          easing: easing
        });

        return false;
      }
    });
  });
};
/**
 * レスポンシブ状態のチェック
 * ※画面の内寸で比較するので要素がbody幅を超えている場合結果に注意
 * その場合は _az.params.wWidth < _az.params.spBreakPoint などで適宜比較する
 */
_az.util.checkRespMode = () => {
  _az.params.wHeight = parseInt(document.documentElement.clientHeight);
  _az.params.wWidth = parseInt(document.documentElement.clientWidth);
  _az.params.wIWidth = parseInt(window.innerWidth);
  _az.params.wIHeight = parseInt(window.innerHeight);
  _az.params.isRespMode = _az.params.wIWidth < _az.params.spBreakPoint ? true : false;

  oldMode = _az.params.currentMode;
  _az.params.currentMode = _az.params.isRespMode ? 2 : 1;
  _az.params.isChangeMode = oldMode !== _az.params.currentMode ? true : false;

  document.body.classList.remove(_az.params.viewOriMode);
  _az.params.viewOriMode = _az.params.wIHeight > _az.params.wIWidth ? 'portrait' : 'landscape';
  _az.params.isChangeWWidth = _az.params.wIWidthCache !== _az.params.wIWidth ? true : false;
  _az.params.isChangeWHeight = _az.params.wIHeightCache !== _az.params.wIHeight ? true : false;

  document.body.classList.add(_az.params.viewOriMode);
};
/**
 * スクロール位置の取得
 */
_az.util.getScrPos = () => {
  _az.params.scrTop = window.scrollY;
  _az.params.scrLeft = window.scrollX;
};
/**
 * 標準的なpagetop(表示／非表示のみ)
 * 表示ポイントをpageTopPointに設定
 * 後から追加する要素には未対応
 */
_az.util.pageTop = () => {
  const pageTopVox = document.getElementById('pageTopVox');
  if (!pageTopVox) return;

  if (_az.params.scrTop > _az.params.pageTopPoint) {
    if (!_az.params.isPageTopShow) {
      _az.params.isPageTopShow = true;

      Velocity(pageTopVox, 'stop');
      pageTopVox.style.display = 'block';
      Velocity(pageTopVox, {
        opacity: 1
      }, {
        duration: 100
      });
    }
  } else {
    if (_az.params.isPageTopShow) {
      _az.params.isPageTopShow = false;
      Velocity(pageTopVox, 'stop');
      Velocity(pageTopVox, {
        opacity: 1
      }, {
        duration: 200,
        complete: () => {
          pageTopVox.style.display = 'none';
        }
      });
    }
  }
};
/**
 * iPhone / iPad / iPod / Android / winPhone 判定
 */
_az.util.getMobile = () => {
  _az.params.ua = window.navigator.userAgent.toLowerCase();

  _az.params.isiPhone = _az.params.ua.indexOf('iphone') != -1 ? true : false;
  _az.params.isiPad = _az.params.ua.indexOf('ipad') != -1 || _az.params.ua.indexOf('macintosh') != -1 && 'ontouchend' in document ? true : false;
  _az.params.isiPod = _az.params.ua.indexOf('ipod') != -1 ? true : false;
  _az.params.isAndroid = _az.params.ua.indexOf('android') != -1 || _az.params.ua.indexOf('android') != -1 ? true : false;
  _az.params.isWinPhone = _az.params.ua.indexOf('windows phone') != -1 ? true : false;

  _az.params.isMobile = _az.params.isiPhone || _az.params.isiPad || _az.params.isiPod || _az.params.isAndroid || _az.params.isWinPhone ? true : false;
};
/**
 * SP時電話番号自動リンク
 * 対象にdata-tel=""で番号指定
 */
_az.util.toggleSPTel = () => {
  if (!_az.params.isRespMode) {
    document.querySelectorAll('.spTel').forEach(e => {
      const parent = e.parentNode;
      if (parent.tagName === 'A') {
        parent.before(e);
        parent.remove();
      }
    });
  } else {
    document.querySelectorAll('.spTel').forEach(e => {
      const tel = e.getAttribute('data-tel');
      console.log(tel);
      const parent = e.parentNode;
      if (parent.tagName !== 'A') {
        const wrap = document.createElement('a');
        e.before(wrap);
        wrap.append(e);
        wrap.href = 'tel:' + tel;
      }
    });
  }
};
/**
 * コンテンツを比率に合わせ変形
 * init時指定パラメータ(配列)
 * w: 基準とする幅 (int)
 * bp: 実行する幅を指定 (int)
 */
_az.util.ratioAdjust = {
  params: {
    r: 1,
    h: new Array,
    w: 375,
    bp: _az.params.spBreakPoint,
    to: 'left top'
  },
  init: (options) => {
    if (options && options.w) _az.util.ratioAdjust.params.w = options['w'];
    if (options && options.bp) _az.util.ratioAdjust.params.bp = options['bp'];
    if (options && options.to) _az.util.ratioAdjust.params.to = options['to'];

    setTimeout(() => {
      _az.util.ratioAdjust.setH();
      _az.util.ratioAdjust.adjust();
    }, 1500);

    window.addEventListener('resize', doEvent);
  },
  setH: function() {
    document.querySelectorAll('.rAdjust').forEach((v, i) => {
      v.style.height = 'auto';
      _az.util.ratioAdjust.params.h[i] = v.style.height;
    });
  },
  setR: function() {
    ratio = _az.params.wWidth < _az.util.ratioAdjust.params.bp ? window.innerWidth / _az.util.ratioAdjust.params.w : 1,
      _az.util.ratioAdjust.params.r = ratio.toFixed(2);
    // console.log(_az.util.ratioAdjust.params.r);
  },
  adjust: function() {
    _az.util.ratioAdjust.setR();

    document.querySelectorAll('.rAdjust').forEach((v, i) => {
      Object.assign(v.style, {
        transformOrigin: _az.util.ratioAdjust.params.to,
        transform: 'scale(' + _az.util.ratioAdjust.params.r + ')'
      });
      if (_az.util.ratioAdjust.params.r > 1 || _az.util.ratioAdjust.params.r < 1) {
        h = _az.params.wWidth < _az.util.ratioAdjust.params.bp ? _az.util.ratioAdjust.params.h[i] * _az.util.ratioAdjust.params.r : 'auto';
      } else {
        h = 'auto';
      }
      v.style.height = h;
    });
  },
  doEvent: () => {
    if (_az.params.rTimer.ratio !== false) {
      clearTimeout(_az.params.rTimer.ratio);
    }

    _az.params.rTimer.ratio = setTimeout(() => {
      _az.util.ratioAdjust.adjust();

      if (_az.params.isChangeMode) {
        _az.util.ratioAdjust.reset();
      }
    }, 1000);
  },
  destroy: function() {
    window.removeEventListener('resize', doEvent);

    document.querySelectorAll('.rAdjust').forEach((v, i) => {
      Object.assign(v.style, {
        transform: 'scale(1)',
        height: 'auto'
      });
    });
  },
  reset: function() {
    _az.util.ratioAdjust.destroy();
    _az.util.ratioAdjust.init();
  }
};
/**
 * 子要素の高さ合わせ
 * @param {対象セレクタ} $selector 
 * @param {オプション type, plus} $options 
 * @returns なし
 */
_az.util.adjustSize = ($selector, $options = {}) => {
  const collection = [];
  document.querySelectorAll($selector).forEach((v, i) => {
    collection.push(v.children);
  });
  if (!collection) return false;

  const options = {
    type: $options.height || 'normal',
    plus: $options.plus || 0
  };

  collection.forEach((value, index) => {
    let setHeight = 0;
    let count = 0;
    const length = value.length;
    const taregt = value;

    Array.prototype.forEach.call(value, (v, i) => {
      v.style.height = 'auto';
      let getHeight = 0;
      let images = [];
      let flow = false;

      v.querySelectorAll('img').forEach((vv) => {
        images.push(vv.src);
      });

      const isImagesLoaded = (f, images) => {
        for (let key in images) {
          const img = document.createElement('img');
          img.src = images[key];

          var imgPreLoader = new Image();
          imgPreLoader.onload = function() {
            f.pass(images[key]);
          };
          imgPreLoader.onerror = function() {
            f.pass('error');
          };
          imgPreLoader.src = images[key];
        }
      };

      const callback = (error, arguments) => {
        switch (options.type) {
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
        flow = new Flow(images.length, callback);
        isImagesLoaded(flow, images);
      } else {
        callback();
      }

      let timer = setInterval(() => {
        if (count !== length) return;

        v.style.height = setHeight + options.plus + 'px';
        clearInterval(timer);
      }, 50);
    });
  });
};
/**
 * popupAdjust
 * @param {*} $options 
 */
_az.util.popupAdjust = ($options = {}) => {
  let scrTopTemp = 0;
  let isOpen = false;
  let isAllowClose = false;
  let popupTarget = '';

  const options = {
    wrapper: $options.wrapper || '#wrapper',
    bg: $options.bg || '#alphaBg',
    isUnlock: $options.isUnlock || true,
    isSpFixed: $options.isSpFixed || true,
    bgOpacity: $options.bgOpacity || .8,
    durationChange: $options.durationChange || 200,
    durationClose: $options.durationClose || 150,
    onComplete: $options.onComplete || false
  };

  const css = document.createElement('style');
  document.head.appendChild(css);
  css.sheet.insertRule('body.pOpenUnlock { overflow: visible; }', css.sheet.length);
  css.sheet.insertRule('body.pOpenFixed { position: fixed; }', css.sheet.length);

  const methods = {};

  methods.init = () => {
    if (!document.querySelector(options.bg)) {
      const alphaBg = document.createElement('div');
      alphaBg.id = 'alphaBg';
      document.querySelector(options.wrapper).prepend(alphaBg)
    }

    const popupIDs = [];

    document.querySelectorAll('.popupBtItem:not(.exclude)').forEach((v, i) => {
      const popupID = v.getAttribute('data-popup');

      if (popupIDs.includes(popupID) !== true) {
        popupIDs.push(popupID);
      }
    });

    document.querySelectorAll('#popupContents .content').forEach((v, i) => {
      const src = v.innerHTML;
      const group = v.getAttribute('data-group');

      const popupSrc = document.createElement('div');
      popupSrc.className = 'popupWrapper vertical';
      popupSrc.innerHTML = '<div class="closeVox"><a href="javascript:void(0)" class="popupCloseBt"><span><!-- --></span><span><!-- --></span></a></div><div class="contentWrapper"><div class="content"><!-- --></div></div>';

      document.querySelector(options.wrapper).appendChild(popupSrc);
      popupSrc.id = popupIDs[i];
      if (group) popupSrc.classList.add(group);
      document.querySelector('#' + popupIDs[i]).querySelector('.content').innerHTML = src;
      v.remove();
    });

    document.querySelectorAll('.popupCloseBt, ' + options.bg + ', .popupBtItemClose').forEach((v, i) => {
      v.addEventListener('click', () => {
        if (document.querySelector('.popupWrapper, ' + options.bg).classList.contains('velocity-animating') || !isAllowClose) return;
        document.body.classList.remove('pOpen', 'pOpenUnlock');
        if (_az.params.isRespMode && options.isSpFixed) {
          document.body.classList.remove('pOpenFixed');
          window.scrollTo(0, scrTopTemp);
        }
        methods.close();
      });
    });

    document.addEventListener('keydown', () => {
      if (isOpen && e.keyCode === 27) {
        if (document.querySelector('.popupWrapper, ' + options.bg).classList.contains('velocity-animating') || !isAllowClose) return;
        document.body.classList.remove('pOpen', 'pOpenUnlock');
        if (_az.params.isRespMode && options.isSpFixed) {
          document.body.classList.remove('pOpenFixed');
          window.scrollTo(0, scrTopTemp);
        }
        methods.close();
      }
    });

    document.querySelectorAll('.popupBtItem').forEach((v, i) => {
      v.addEventListener('click', () => {
        document.querySelectorAll('.popupWrapper, ' + options.bg).forEach((vv) => {
          if (vv.classList.contains('velocity-animating')) return;
        });

        const id = v.getAttribute('data-popup');
        popupTarget = '#' + id;

        document.querySelector(popupTarget).style.opacity = 0;
        document.querySelector(popupTarget).style.display = 'block';

        methods.change('#' + id);

        document.querySelector(popupTarget).style.display = 'none';
        document.querySelector(popupTarget).style.opacity = 1;

        document.body.classList.add('pOpen');
      });
    });

    if (typeof options.onComplete === 'function') {
      options.onComplete();
    }
  };

  methods.change = (id) => {
    if (!isOpen) {
      isOpen = true;

      methods.adjust(id);

      document.querySelector(options.bg).style.display = 'block';
      Velocity(document.querySelector(options.bg), 'stop');
      Velocity(document.querySelector(options.bg), {
        opacity: options.bgOpacity
      }, {
        duration: options.durationChange,
        complete: () => {
          Velocity(document.querySelector(id), 'fadeIn', {
            duration: options.durationChange,
            complete: () => {
              isAllowClose = true;
            }
          });
        }
      });
    }
  };

  methods.close = () => {
    document.querySelectorAll('.popupWrapper').forEach((v, i) => {
      Velocity(v, 'fadeOut', {
        duration: options.durationClose,
        complete: () => {
          Velocity(document.querySelector(options.bg), 'stop');
          Velocity(document.querySelector(options.bg), {
            opacity: 0,
          }, {
            duration: options.durationClose,
            complete: () => {
              document.querySelector(options.bg).style.display = 'none';
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

  methods.adjust = (target) => {
    if (!target) target = popupTarget;

    const popupHeight = document.querySelector(target).offsetHeight;
    const popupWidth = document.querySelector(target).offsetWidth;

    const topPos = _az.params.wHeight > popupHeight ? (_az.params.wHeight - popupHeight) / 2 : 0;
    const leftPos = _az.params.wWidth > popupWidth ? (_az.params.wWidth - popupWidth) / 2 : 0;

    scrTopTemp = _az.params.scrTop;

    if (options.isUnlock) {
      if (popupHeight >= _az.params.wHeight) {
        document.body.classList.add('pOpenUnlock');
      }
    }
    document.querySelector(target).style.top = topPos + _az.params.scrTop + 'px';
    if (_az.params.isRespMode && options.isSpFixed) {
      document.body.classList.add('pOpenFixed');
      document.body.style.top = -scrTopTemp;
    }
  };

  methods.init();
};

_az.util.replaceImageSP = ($target, $options = {}) => {
  options = {
    pcName: $options.pcName || 'PC_',
    spName: $options.spName || 'SP_',
    breakPoint: $options.breakPoint || 768
  };

  const methods = {};

  methods.init = () => {
    window.addEventListener('resize', methods.adjust);
  };

  methods.adjust = () => {
    return document.querySelectorAll($target).forEach((v, i) => {
      if (_az.params.wWidth >= options.breakPoint) {
        v.src = v.src.replace(options.spName, options.pcName);
      } else {
        v.src = v.src.replace(options.pcName, options.spName);
      }
    });
  };

  methods.destroy = () => {
    window.removeEventListener('resize', methods.adjust);
  };

  methods.init();
};