import anime from 'animejs/lib/anime.es';
import { FocusLoop } from './FocusLoop';
/**
 * シンプルなポップアップ処理
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2025.04.26
 *
 * @param {*} $selector
 * @param {*} $options
 */
interface Options {
  bg: string;
  bgOpacity: number;
  btn: string;
  closeEl: string;
  wrapper: string;
  popupContent: string;
  label: string;
  iframeMovieSrc: string;
  focusLoopElems: string[];
  durationBgChange: number;
  durationBgClose: number;
  durationChange: number;
  durationClose: number;
  isA11y: boolean;
  isAdjust: boolean;
  isCloseBtn: boolean;
  isSpFixed: boolean;
  isUnlock: boolean;
  onClose: any;
  onComplete: any;
  onOpen: any;
}
export class PopupAdjust {
  private scrTopTemp: number;
  private isOpen: boolean;
  private isAllowClose: boolean;
  private currentTrigger: Element;
  private popupTarget: string;
  private popupContent: string;
  private spBreakPoint: number;
  private scrTop: number;
  private scrLeft: number;
  private wHeight: number;
  private wWidth: number;
  private wIWidth: number;
  private wIHeight: number;
  private isRespMode: boolean;
  private options: Options;
  private focusLoop: FocusLoop[];

  constructor(
    $selector: string, // popupの発火となる要素
    {
      bg = '#alphaBg', // レイヤ
      bgOpacity = 0.8, // レイヤの透明度
      closeEl = '.popupCloseBt', // 閉じるボタンの要素名
      wrapper = 'body', // ドキュメントのラッパ要素の指定(レイヤ差し込み用)
      popupContent = '#popupContents', // ポップアップの内容を指定する要素
      label = '', // ポップアップの名前(label属性に設定)
      iframeMovieSrc = '', // ポップアップ内にiframeで埋め込む動画のsrc
      focusLoopElems = [
        'a',
        'area',
        'button',
        'iframe',
        'input',
        'object',
        'select',
        'textarea',
      ], // focusLoopさせる際の要素名
      durationBgChange = 50, // レイヤが開く際の表示速度
      durationBgClose = 50, // レイヤが閉じる際の表示速度
      durationChange = 200, // ポップアップが開く際の表示速度
      durationClose = 150, // ポップアップが閉じる際の表示速度
      isA11y = true, // アクセシビリティ対応
      isAdjust = true, // popupの位置調整を行う
      isCloseBtn = true, // 閉じるボタンを表示する
      isSpFixed = true, // SP時はbodyのスクロールを禁止する
      isUnlock = true, // bodyのスクロール禁止を「しない」
      onClose = false, // popupを閉じた際のコールバック @return クリックされたpopupのid
      onComplete = false, // popupAdjustの準備完了コールバック
      onOpen = false, // popupが開いた際のコールバック @return クリックされたpopupのid
    }: Partial<Options> = {}
  ) {
    this.scrTopTemp = 0;
    this.isOpen = false;
    this.isAllowClose = false;
    this.popupContent = popupContent;
    this.spBreakPoint = 768;
    this.scrTop = 0;
    this.scrLeft = 0;
    this.wHeight = 0;
    this.wWidth = 0;
    this.wIWidth = 0;
    this.wIHeight = 0;
    this.isRespMode = false;
    this.focusLoop = [];

    this.options = {
      bg: bg,
      bgOpacity: bgOpacity,
      btn: $selector,
      closeEl: closeEl,
      wrapper: wrapper,
      popupContent: popupContent,
      label: label,
      iframeMovieSrc: iframeMovieSrc,
      focusLoopElems: focusLoopElems,
      durationBgChange: durationBgChange,
      durationBgClose: durationBgClose,
      durationChange: durationChange,
      durationClose: durationClose,
      isA11y: isA11y,
      isAdjust: isAdjust,
      isCloseBtn: isCloseBtn,
      isSpFixed: isSpFixed,
      isUnlock: isUnlock,
      onClose: onClose,
      onComplete: onComplete,
      onOpen: onOpen,
    };

    const css = document.createElement('style');
    document.head.appendChild(css);
    css.sheet.insertRule(
      'body.is-pOpenUnlock { overflow: visible; }',
      // @ts-ignore css.sheet の型が不明
      css.sheet.length
    );
    css.sheet.insertRule(
      'body.is-pOpenFixed { position: fixed; }',
      // @ts-ignore css.sheet の型が不明
      css.sheet.length
    );

    this.init();
  }
  init(): void {
    if (!document.querySelector(this.options.bg)) {
      const alphaBg = document.createElement('div');
      alphaBg.id = 'alphaBg';

      Object.assign(alphaBg.style, {
        opacity: '0',
        display: 'none',
      });
      document
        .querySelector(this.options.wrapper)
        .insertBefore(
          alphaBg,
          document.querySelector(this.options.wrapper).childNodes[0]
        );
    }

    const popupIDs = [];
    document
      .querySelectorAll(`${this.options.btn}:not(.exclude)`)
      .forEach((v, i) => {
        const popupID = v.getAttribute('data-popup');

        if (popupIDs.includes(popupID) !== true) {
          popupIDs.push(popupID);
        }
      });

    document
      .querySelectorAll(`${this.popupContent} .content`)
      .forEach((v, i) => {
        const src = v.innerHTML;
        const group = v.getAttribute('data-group');

        const popupSrc = document.createElement('div');
        popupSrc.className = 'popupWrapper vertical';
        popupSrc.setAttribute('role', 'dialog');
        popupSrc.setAttribute('aria-modai', 'true');
        if (this.options.label) {
          popupSrc.setAttribute('aria-label', this.options.label);
        }

        if (this.options.isCloseBtn) {
          popupSrc.innerHTML += `
          <div class="closeVox">
            <button aria-label="ポップアップを閉じる" class="popupCloseBt">
              <span><!-- --></span>
              <span><!-- --></span>
            </button>
          </div>
          `;
        }
        popupSrc.innerHTML += `
          <div class="contentWrapper">
            <div class="content"><!-- --></div>
          </div>
        `;
        Object.assign(popupSrc.style, {
          opacity: '0',
          display: 'none',
        });
        // console.log(popupIDs);
        document.querySelector(this.options.wrapper).appendChild(popupSrc);
        popupSrc.id = popupIDs[i];
        if (group) popupSrc.classList.add(group);
        if (this.options.isA11y) {
          // popupSrc.setAttribute('aria-hidden', 'true');
          popupSrc.setAttribute('inert', 'true');
        }
        document
          .querySelector(`#${popupIDs[i]}`)
          .querySelector('.content')
          .insertAdjacentHTML('beforeend', src);
        v.remove();

        if (this.options.isA11y)
          this.focusLoop[i] = new FocusLoop(`#${popupIDs[i]}`);
        // v.parentNode.removeChild(v);
      });

    const bg = this.options.bg ? `, ${this.options.bg}` : '';
    const closeEl = this.options.closeEl ? `, ${this.options.closeEl}` : '';

    document
      .querySelectorAll(`.popupCloseBt${bg}${closeEl}`)
      .forEach((v, i) => {
        v.addEventListener('click', () => {
          if (
            document
              .querySelector(`.popupWrapper, ${this.options.bg}`)
              .classList.contains('is-animating') ||
            !this.isAllowClose
          )
            return;
          this.close();
        });
      });

    document.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') {
        if (
          document
            .querySelector(`.popupWrapper, ${this.options.bg}`)
            .classList.contains('is-animating') ||
          !this.isAllowClose
        )
          return;
        this.close();
      }
    });

    document.querySelectorAll(this.options.btn).forEach((v, i) => {
      v.addEventListener('click', () => {
        this.currentTrigger = v;
        // console.log(v);
        document
          .querySelectorAll(`.popupWrapper, ${this.options.bg}`)
          .forEach((vv) => {
            if (vv.classList.contains('is-animating')) return;
          });

        const id = v.getAttribute('data-popup');
        this.popupTarget = `#${id}`;
        // console.log(this.popupTarget);

        if (v.classList.contains('movie')) {
          const movie = v.getAttribute('data-movie');
          const src = ((iframeMovieSrc) => {
            if (!iframeMovieSrc) {
              return `<iframe src="https://www.youtube.com/embed/${movie}?autoplay=1&rel=0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
              return iframeMovieSrc;
            }
          })(this.options.iframeMovieSrc);

          document
            .querySelector<HTMLElement>(this.popupTarget)
            .querySelector('.movieContent')
            .insertAdjacentHTML('beforeend', src);
        }

        Object.assign(
          document.querySelector<HTMLElement>(this.popupTarget).style,
          {
            opacity: '0',
            display: 'block',
          }
        );

        this.change(`#${id}`);
        if (this.options.isA11y && this.focusLoop[i] !== undefined) {
          this.focusLoop[i].isRun = true;
        }

        document.body.classList.add('is-pOpen');
      });
    });

    window.addEventListener('scroll', () => {
      this.setScrPos();
    });

    if (typeof this.options.onComplete === 'function') {
      this.options.onComplete();
    }
  }
  change(id: string): void {
    if (!this.isOpen) {
      this.isOpen = true;

      this.adjust(id);
      document.querySelector<HTMLElement>(this.options.bg).style.display =
        'block';

      anime({
        targets: document.querySelector(this.options.bg),
        opacity: [0, this.options.bgOpacity],
        easing: 'linear',
        duration: this.options.durationBgChange,
        complete: () => {
          document.querySelector<HTMLElement>(id).style.display = 'block';
          const children: HTMLCollection = document.querySelector(
            this.options.wrapper
          ).children;
          if (this.options.isA11y) {
            Array.from(children).forEach((v) => {
              if (
                v !== document.querySelector<HTMLElement>(id) &&
                v !== <HTMLElement>document.querySelector(this.options.bg)
              ) {
                v.setAttribute('data-popup-invalid-elements', 'true');
                // v.setAttribute('aria-hidden', 'true');
                v.setAttribute('inert', 'true');
              }
            });
            // document
            //   .querySelector<HTMLElement>(id)
            //   .setAttribute('aria-hidden', 'false');
            document.querySelector<HTMLElement>(id).removeAttribute('inert');
          }
          document
            .querySelector(`.popupWrapper, ${this.options.bg}`)
            .classList.add('is-animating');
          anime({
            targets: document.querySelector(id),
            opacity: [0, 1],
            duration: this.options.durationChange,
            complete: () => {
              this.isAllowClose = true;
              document
                .querySelectorAll(`.popupWrapper, ${this.options.bg}`)
                .forEach((v) => v.classList.remove('is-animating'));
              document
                .querySelector<HTMLElement>(id)
                .querySelector<HTMLElement>('.popupCloseBt')
                ?.focus();
              if (typeof this.options.onOpen === 'function') {
                this.options.onOpen(this.popupTarget);
              }
            },
          });
        },
      });
    }
  }
  close(): void {
    document.querySelectorAll('.popupWrapper').forEach((v, i) => {
      document.body.classList.remove('is-pOpen', 'is-pOpenUnlock');
      if (this.isRespMode && this.options.isSpFixed) {
        document.body.classList.remove('is-pOpenFixed');
        document.body.style.removeProperty('top');
        window.scrollTo(0, this.scrTopTemp);
      }
      if (this.options.isA11y && this.focusLoop[i] !== undefined) {
        this.focusLoop[i].isRun = false;
      }
      anime({
        targets: v,
        opacity: [1, 0],
        duration: this.options.durationClose,
        complete: () => {
          (<HTMLElement>v).style.display = 'none';
          if (this.options.isA11y) {
            // (<HTMLElement>v).setAttribute('aria-hidden', 'true');
            (<HTMLElement>v).setAttribute('inert', 'true');
            // document.body.setAttribute('aria-hidden', 'false');
            document
              .querySelectorAll('[data-popup-invalid-elements="true"]')
              .forEach((vv) => {
                (<HTMLElement>vv).removeAttribute(
                  'data-popup-invalid-elements'
                );
                // (<HTMLElement>vv).removeAttribute('aria-hidden');
                (<HTMLElement>vv).removeAttribute('inert');
              });
          }
          anime({
            targets: this.options.bg,
            opacity: [1, 0],
            duration: this.options.durationBgClose,
            easing: 'linear',
            complete: () => {
              document.querySelector<HTMLElement>(
                this.options.bg
              ).style.display = 'none';
              document
                .querySelectorAll('.popupWrapper')
                .forEach((vv) => ((<HTMLElement>vv).style.display = 'none'));
              this.isOpen = false;

              (<HTMLElement>this.currentTrigger)?.focus();

              if (typeof this.options.onClose === 'function') {
                this.options.onClose(this.popupTarget);
              }
            },
          });
        },
      });
      document
        .querySelectorAll('.popupWrapper.movie .movieContent')
        .forEach((vv, i) => {
          if (vv) vv.innerHTML = '';
        });
    });
  }
  adjust(target: string): void {
    if (!this.options.isAdjust) return;
    if (!target) target = this.popupTarget;
    this.setRespMode();
    this.setScrPos();

    const popupHeight =
      document.querySelector<HTMLElement>(target).offsetHeight;
    const popupWidth = document.querySelector<HTMLElement>(target).offsetWidth;
    const topPos =
      this.wHeight > popupHeight ? (this.wHeight - popupHeight) / 2 : 0;
    const leftPos =
      this.wWidth > popupWidth ? (this.wWidth - popupWidth) / 2 : 0;

    this.scrTopTemp = this.scrTop;
    // console.log(popupHeight, popupWidth, topPos, leftPos, this.scrTopTemp)
    if (!this.options.isUnlock) {
      if (popupHeight >= this.wHeight) {
        document.body.classList.add('is-pOpenUnlock');
      }
    }
    document.querySelector<HTMLElement>(target).style.top = `${
      topPos + this.scrTop
    }px`;
    if (this.isRespMode && this.options.isSpFixed) {
      document.body.classList.add('is-pOpenFixed');
      document.body.style.top = `-${this.scrTopTemp}px`;
    }
  }
  setScrPos(): void {
    this.scrTop = window.scrollY || window.pageYOffset;
    this.scrLeft = window.scrollX || window.pageXOffset;
  }
  setRespMode(): void {
    this.wHeight = Number(document.documentElement.clientHeight);
    this.wWidth = Number(document.documentElement.clientWidth);
    this.wIWidth = Number(window.innerWidth);
    this.wIHeight = Number(window.innerHeight);
    this.isRespMode = this.wIWidth < this.spBreakPoint ? true : false;
  }
}
