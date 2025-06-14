import anime from 'animejs/lib/anime.es';
import { LoadImages } from './LoadImages';
/**
 * ================================================
 *
 * [javascript Common]
 * 必須ライブラリ : velocity;
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 	2010- AZLINK. <https://azlink.jp>
 * @final 		2025.05.25
 *
 * ================================================
 */
interface Options {
  spBreakPoint: number;
  pageTopPoint: number;
  pageTopElemID: string;
  isDebug: boolean;
  isRunInit: boolean;
}
interface Timers {
  setRespMode: number | boolean;
  toggleSPTel: number | boolean;
  debug: number | boolean;
  pagetop: number | boolean;
}
export class Utilities {
  public qsParm: {};
  public userAgent: string;
  public browserIE: number;
  public browser_v: number;
  public browser_n: string;
  public ua: string;
  public isIE: boolean;
  public isIE6: boolean;
  public isIE7: boolean;
  public isIE8: boolean;
  public isIE9: boolean;
  public isIE10: boolean;
  public isIE11: boolean;
  public isEdge: boolean;
  public isiPhone: boolean;
  public isiPad: boolean;
  public isiPod: boolean;
  public isAndroid: boolean;
  public isMac: boolean;
  public isWinPhone: boolean;
  public isMobile: boolean;
  public isNavOpen: boolean;
  public spBreakPoint: number;
  public wWidth: number;
  public wHeight: number;
  public wIWidth: number;
  public wIHeight: number;
  public wIWidthCache: number;
  public wIHeightCache: number;
  public dspWidth: number;
  public dspHeight: number;
  public isRespMode: boolean;
  public isChangeWIWidth: boolean;
  public isChangeWIHeight: boolean;
  public isPageTopShow: boolean;
  public pageTopPoint: number;
  public pageTopElemID: string;
  public scrMode: string;
  public scrTop: number;
  public scrLeft: number;
  public orgMode: number;
  public currentMode: number;
  public isChangeMode: boolean;
  public viewOriMode: string;
  public isTouchDevice: boolean;
  public isDebug: boolean;
  private rTimer: Timers;
  private tmp: {
    query: string;
    parms: string[];
  };
  public isRunInit: boolean;
  // 初期値として$optionsで渡せるもの
  // spBreakPoint: ブレークポイント値 Integer
  // pageTopPoint: pagetop表示地点 Integer
  // pageTopElemID: pagetop エレメントID
  // isDebug: デバッグ実行フラグ boolean
  // isRunInit: Initの実行フラグ boolean
  constructor({
    spBreakPoint = 768,
    pageTopPoint = 100,
    pageTopElemID = 'js-pageTopVox',
    isDebug = false,
    isRunInit = true,
  }: Partial<Options> = {}) {
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
    this.isMac = false; // MacOS判定
    this.isWinPhone = false; // WinPhone判定
    this.isMobile = false; // Mobile判定 (setMobile結果)
    this.isNavOpen = false; // メニュー開閉判定(スマフォメニューなどに使用)
    this.spBreakPoint = spBreakPoint; // ブレークポイント
    this.wWidth = 0; // ウィンドウ幅
    this.wHeight = 0; // ウィンドウ高さ
    this.wIWidth = 0; // ウィンドウ幅 (innerWidth)
    this.wIHeight = 0; // ウィンドウ高さ (innerHeight)
    this.wIWidthCache = 0; // ウィンドウ幅のキャッシュ (innerWidth)
    this.wIHeightCache = 0; // ウィンドウ高のキャッシュ (innerWidth)
    this.dspWidth = Number(window.parent.screen.width); // 画面の幅
    this.dspHeight = Number(window.parent.screen.height); // 画面の高さ
    this.isRespMode = false; // レスポンシブ判定
    this.isChangeWIWidth = false; // 画面幅の変更判定
    this.isChangeWIHeight = false; // 画面高の変更判定
    this.isPageTopShow = false; // pagetop表示判定
    this.pageTopPoint = pageTopPoint; // pagetop表示Y座標
    this.pageTopElemID = pageTopElemID; // pagetop エレメントのID
    this.scrMode = ''; // スクロールダウン中ならdown / スクロールアップ中ならup
    this.scrTop = 0; // Y軸スクロール量
    this.scrLeft = 0; // X軸スクロール量
    this.orgMode = null; // ロード時のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
    this.currentMode = null; // 現在のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
    this.isChangeMode = false; // レスポンシブ状態が変更になったらtrue
    this.viewOriMode = 'landscape'; // 画面モード landscape / portrait
    this.isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0; // タッチデバイス判定
    this.isDebug = isDebug; // デバッグモード判定
    this.rTimer = { setRespMode: 0, toggleSPTel: 0, debug: 0, pagetop: 0 }; // イベント制御用タイマー
    this.tmp = {
      query: '',
      parms: [],
    }; // 作業用
    this.isRunInit = isRunInit; // init 実行しないか
  }
  init(): void {
    this.setGETqs();
    this.setWb();
    this.setWbVer();
    this.setMobile();
    this.setRespMode();
    this.setScrPos();

    // this.sScroll();
    this.roImg();
    this.roOpa();
    this.pageTop();
    this.toggleSPTel();
    this.initDebug();
    window.addEventListener('resize', () => {
      if (this.rTimer.setRespMode !== false) {
        clearTimeout(Number(this.rTimer.setRespMode));
      }
      this.rTimer.setRespMode = window.setTimeout(() => {
        this.setRespMode();
      }, 250);

      if (this.rTimer.toggleSPTel !== false) {
        clearTimeout(Number(this.rTimer.toggleSPTel));
      }
      this.rTimer.toggleSPTel = window.setTimeout(() => {
        this.toggleSPTel();
      }, 250);
    });
    window.addEventListener('scroll', () => {
      this.setScrPos();
      this.pageTop();
    });

    // レスポンシブ状態の初期値設定
    this.orgMode = this.currentMode = this.isRespMode ? 2 : 1;
  }
  /**
   * デバッグの準備
   */
  initDebug(): void {
    if (!this.isDebug) return;
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
      overflow: 'auto',
    });

    document.body.appendChild(pDebug);
    pDebug.innerHTML =
      '<div><a href="javascript:void(0)" class="toggle" style="color: #FFFFFF;">HIDE</a></div><div class="inner" />';

    const elem = {
      toggle: pDebug.querySelector<HTMLElement>('.toggle'),
      inner: pDebug.querySelector<HTMLElement>('.inner'),
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

    this.showDebug();

    window.addEventListener('resize', () => {
      if (this.rTimer.debug !== false) {
        clearTimeout(Number(this.rTimer.debug));
      }

      this.rTimer.debug = window.setTimeout(() => {
        this.showDebug();
      }, 500);
    });

    window.addEventListener('scroll', () => {
      if (this.rTimer.debug !== false) {
        clearTimeout(Number(this.rTimer.debug));
      }

      this.rTimer.debug = window.setTimeout(() => {
        this.showDebug();
      }, 500);
    });
  }
  /**
   * デバッグ情報の出力
   */
  showDebug(): void {
    let src = '';

    for (let key in this) {
      if (typeof this[key] === 'function') continue;
      if (key !== 'qsParm') {
        src += `<div><span style="font-weight: bold;">${key}</span> : ${this[key]}</div>`;
      } else {
        src += 'qsParm : ';
        for (let k in this[key]) {
          src += `<div><span style="font-weight: bold;">${k}</span> : ${this[key][k]}</div>`;
        }
      }
    }

    document.querySelector('#pDebug .inner').innerHTML = src;
    // document.querySelector('#pDebug .inner').insertAdjacentHTML('afterbegin', src);
  }
  /**
   * strict対策blank open
   * @param 開くURL
   */
  openBlank(url: string): void {
    window.open(url);
  }
  /**
   * 画像の先読み
   * @param 画像配列
   */
  preloadImg(args: string[] = []): void {
    if (!args) return;

    for (var i = 0; i < args.length; i++) {
      const img = document.createElement('img');
      img.src = args[i];
    }
  }
  /**
   * 画像の先読みv2.0
   * @param array 画像のパスの配列
   * @param callback 画像の読み込み完了後のコールバック関数
   * @return array 画像のパスの配列
   */
  loadImages(list: string[], callback?: (images: HTMLImageElement[]) => void) {
    try {
      return LoadImages.loadImages(list, callback);
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * GET値の取得
   * @return GET値をセットしたオブジェクト
   */
  getGETqs(): {} {
    this.tmp.query = window.location.search.substring(1);
    this.tmp.parms = this.tmp.query.split('&');
    // console.log(this.tmp)

    const obj = {};

    for (const parm of this.tmp.parms) {
      const pos = parm.indexOf('=');
      if (pos > 0) {
        const key = parm.substring(0, pos);
        const val = parm.substring(pos + 1);

        obj[key] = val;
      }
    }

    return obj;
  }
  /**
   * GET値の設定
   */
  setGETqs(): void {
    this.qsParm = this.getGETqs();
  }
  /**
   * ブラウザ判定
   */
  setWb(): void {
    this.ua = window.navigator.userAgent.toLowerCase();
    this.isIE = this.ua.indexOf('msie') >= 0 || this.ua.indexOf('trident') >= 0;

    if (this.isIE) {
      let a = /(msie|rv:?)\s?([\d\.]+)/.exec(this.ua);
      let v = a ? a[2] : '';

      this.isIE6 = v.indexOf('6.', 0) === 0 ? true : false;
      this.isIE7 = v.indexOf('7.', 0) === 0 ? true : false;
      this.isIE8 = v.indexOf('8.', 0) === 0 ? true : false;
      this.isIE9 = v.indexOf('9.', 0) === 0 ? true : false;
      this.isIE10 = v.indexOf('10.', 0) === 0 ? true : false;
      this.isIE11 = v.indexOf('11.', 0) === 0 ? true : false;
    }
    this.isEdge =
      this.ua.indexOf('edge') >= 0 || this.ua.indexOf('edg') >= 0
        ? true
        : false;
  }
  /**
   * Webブラウザバージョンの取得
   */
  setWbVer(): void {
    if (this.ua.indexOf('firefox') > -1) {
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
  roImg(): void {
    const imgCache = [];

    document
      .querySelectorAll<HTMLImageElement>('a > .roImg')
      .forEach((v, i) => {
        const time = Date.now();
        v.addEventListener('mouseenter', () => {
          if (this.isRespMode) return;

          const params = {
            src: '',
            srcDot: 0,
            srcOver: '',
          };
          params.src = v.src;
          params.srcDot = params.src.lastIndexOf('.');
          params.srcOver = `${params.src.substr(
            0,
            params.srcDot
          )}_on${params.src.substr(params.srcDot, 4)}`;

          imgCache[time] = params.src;

          v.src = params.srcOver;
        });

        v.addEventListener('mouseleave', (e) => {
          if (this.isRespMode) return;

          v.src = imgCache[time];
        });
      }, this);
  }
  /**
   * 画像透明度ロールオーバー
   */
  roOpa(): void {
    document.querySelectorAll<HTMLElement>('.jqHover').forEach((v, i) => {
      v.addEventListener('mouseenter', () => {
        if (this.isRespMode) return;

        anime({
          targets: v,
          opacity: 0.7,
          duration: 250,
        });
      });

      v.addEventListener('mouseleave', () => {
        if (this.isRespMode) return;

        anime({
          targets: v,
          opacity: 1,
          duration: 200,
        });
      });
    });
  }
  /**
   * アンカーリンクスムーススクロール
   * 掛けたいA要素に[.scroll]を付与する
   * @param オフセット値
   * @param スピード
   * @param イージング
   * @param 発火要素
   * @param アニメーション完了後のフォーカス　初期値 true
   */
  sScroll(
    $offset?: number,
    $duration?: number,
    $easing?: string,
    $target: string = 'a[href*="#"].scroll, area[href*="#"].scroll',
    $isFocus?: boolean
  ): void {
    document.querySelectorAll<HTMLAnchorElement>($target).forEach((v, i) => {
      v.addEventListener('click', (e) => {
        // e.preventDefault();
        interface Params {
          anchor: string;
          anchorURL: string;
          current: string;
          currentURL: string;
          targetArray: string[];
          target: string;
        }
        const params: Params = {
          anchor: '',
          anchorURL: '',
          current: '',
          currentURL: '',
          targetArray: [],
          target: '',
        };
        params.anchor = (<HTMLAnchorElement>e.currentTarget).href;
        params.anchorURL = params.anchor.split('#')[0];
        params.current = window.location.href;
        params.currentURL = params.current.split('#')[0];

        if (params.anchorURL === params.currentURL) {
          e.preventDefault();
          params.targetArray = params.anchor.split('#');
          params.target = params.targetArray.pop();

          const offset = $offset && Number.isInteger($offset) ? $offset : 0;
          const duration =
            $duration && $duration !== 500 && Number.isInteger($duration)
              ? $duration
              : 500;
          const easing =
            $easing && $easing !== 'cubicBezier(0.11, 0, 0.5, 0)'
              ? $easing
              : 'cubicBezier(0.11, 0, 0.5, 0)';
          const target = document.getElementById(params.target);
          const isFocus = $isFocus !== false ? true : false;
          const targetPos =
            target.getBoundingClientRect().top + window.pageYOffset + offset;
          anime.remove('html, body');
          anime({
            targets: 'html, body',
            scrollTop: targetPos,
            duration: duration,
            easing: easing,
            update: () => {
              // if (this.isEdge) return;
              // const newTargetPos =
              //   target.getBoundingClientRect().top +
              //   window.pageYOffset +
              //   offset;
              // if (targetPos !== newTargetPos) {
              //   anime.set('html, body', {
              //     scrollTop: () => {
              //       return newTargetPos;
              //     },
              //   });
              // }
            },
            complete: () => {
              const newTargetPos =
                target.getBoundingClientRect().top +
                window.pageYOffset +
                offset;
              // console.log(targetPos, newTargetPos)
              if (targetPos !== newTargetPos) {
                anime({
                  targets: 'html, body',
                  scrollTop: newTargetPos,
                  duration: 10,
                  easing: 'linear',
                });
              }
              if (isFocus) {
                // const newTargetPos =
                //   target.getBoundingClientRect().top +
                //   window.pageYOffset +
                //   offset;
                // // console.log(targetPos, newTargetPos)
                // if (targetPos !== newTargetPos) {
                //   anime({
                //     targets: 'html, body',
                //     scrollTop: newTargetPos,
                //     duration: 10,
                //     easing: easing,
                //   });
                // }
                target.focus();
              }
            },
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
  setRespMode(): void {
    this.wHeight = Number(document.documentElement.clientHeight);
    this.wWidth = Number(document.documentElement.clientWidth);
    this.wIWidth = Number(window.innerWidth);
    this.wIHeight = Number(window.innerHeight);
    this.isRespMode = this.wIWidth < this.spBreakPoint ? true : false;

    let oldMode = this.currentMode;
    this.currentMode = this.isRespMode ? 2 : 1;
    this.isChangeMode = oldMode !== this.currentMode ? true : false;

    document.body.classList.remove(this.viewOriMode);
    this.viewOriMode = this.wIHeight > this.wIWidth ? 'portrait' : 'landscape';
    if (this.wIWidthCache !== this.wIWidth) {
      this.wIWidthCache = this.wIWidth;
      this.isChangeWIWidth = true;
    } else {
      this.isChangeWIWidth = false;
    }
    if (this.wIHeightCache !== this.wIHeight) {
      this.wIHeightCache = this.wIHeight;
      this.isChangeWIHeight = true;
    } else {
      this.isChangeWIHeight = false;
    }
    // this.isChangeWWidth = this.wIWidthCache !== this.wIWidth ? true : false;
    // this.isChangeWHeight = this.wIHeightCache !== this.wIHeight ? true : false;

    document.body.classList.add(this.viewOriMode);
  }
  /**
   * スクロール位置の取得とセット
   */
  setScrPos(): void {
    const currentY = window.scrollY || window.pageYOffset;
    this.scrMode = currentY <= this.scrTop ? 'up' : 'down';
    this.scrTop = currentY;
    this.scrLeft = window.scrollX || window.pageXOffset;
  }
  /**
   * 標準的なpagetop(表示／非表示のみ)
   * 表示ポイントをpageTopPointに設定
   * 要素名はpageTopElemIDで変更可
   * 後から追加する要素には未対応
   */
  pageTop(): void {
    const pageTopVox = document.getElementById(this.pageTopElemID);
    if (!pageTopVox) return;

    if (this.rTimer.pagetop !== false) {
      clearTimeout(Number(this.rTimer.pagetop));
    }

    this.rTimer.pagetop = window.setTimeout(() => {
      if (this.scrTop >= this.pageTopPoint) {
        if (!this.isPageTopShow) {
          this.isPageTopShow = true;
          pageTopVox.style.display = 'block';
          anime({
            targets: pageTopVox,
            opacity: 1,
            duration: 100,
          });
        }
      } else {
        if (this.isPageTopShow) {
          this.isPageTopShow = false;
          anime({
            targets: pageTopVox,
            opacity: 0,
            duration: 200,
            complete: () => {
              pageTopVox.style.display = 'none';
            },
          });
        }
      }
    }, 100);
  }
  /**
   * iPhone / iPad / iPod / Android / winPhone 判定
   * @return 返り値なし
   */
  setMobile(): void {
    this.ua = window.navigator.userAgent.toLowerCase();

    this.isiPhone = this.ua.indexOf('iphone') != -1 ? true : false;
    this.isiPad =
      this.ua.indexOf('ipad') != -1 ||
      (this.ua.indexOf('macintosh') != -1 && 'ontouchend' in document)
        ? true
        : false;
    this.isiPod = this.ua.indexOf('ipod') != -1 ? true : false;
    this.isAndroid =
      this.ua.indexOf('android') != -1 || this.ua.indexOf('android') != -1
        ? true
        : false;
    this.isMac =
      this.ua.indexOf('macintosh') != -1 || this.ua.indexOf('macintosh') != -1
        ? true
        : false;
    this.isWinPhone = this.ua.indexOf('windows phone') != -1 ? true : false;

    this.isMobile =
      this.isiPhone ||
      this.isiPad ||
      this.isiPod ||
      this.isAndroid ||
      this.isWinPhone
        ? true
        : false;
  }
  /**
   * SP時電話番号自動リンク
   * 対象にdata-tel=""で番号指定
   */
  toggleSPTel(): void {
    if (!this.isRespMode) {
      document.querySelectorAll<HTMLElement>('.spTel').forEach((e) => {
        const parent = <HTMLElement>e.parentNode;
        if (parent.tagName === 'A') {
          parent.before(e);
          parent.remove();
        }
      });
    } else {
      document.querySelectorAll<HTMLElement>('.spTel').forEach((e) => {
        const tel = e.getAttribute('data-tel');
        // console.log(tel);
        const parent = <HTMLElement>e.parentNode;
        if (parent.tagName !== 'A') {
          const wrap = document.createElement('a');
          e.before(wrap);
          wrap.append(e);
          wrap.href = 'tel:' + tel;
        }
      });
    }
  }
  static printType(x: any): void {
    console.log(`${typeof x} ${Object.prototype.toString.call(x)}`);
  }
}
