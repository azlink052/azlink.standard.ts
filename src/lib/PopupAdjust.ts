import anime from 'animejs/lib/anime.es';
/**
 * シンプルなポップアップ処理
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2022.06.10
 *
 * @param {*} $selector
 * @param {*} $options
 */
interface Options {
  btn: string;
  wrapper: string;
  bg: string;
  isUnlock: boolean;
  isSpFixed: boolean;
  isAdjust: boolean;
  bgOpacity: number;
  durationChange: number;
  durationClose: number;
  onComplete: any;
  onOpen: any;
  onClose: any;
}
export class PopupAdjust {
  private scrTopTemp: number;
  private isOpen: boolean;
  private isAllowClose: boolean;
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

  constructor(
    $selector: string, // popupの発火となる要素
    {
      wrapper = '#wrapper', // ドキュメントのラッパ要素の指定(レイヤ差し込み用)
      bg = '#alphaBg', // レイヤ
      isUnlock = true, // bodyのスクロール禁止を「しない」
      isSpFixed = true, // SP時はbodyのスクロールを禁止する
      isAdjust = true, // popupの位置調整を行う
      bgOpacity = 0.8, // レイヤの透明度
      durationChange = 200, // ポップアップが開く際のの表示速度
      durationClose = 150, // ポップアップが閉じる際の表示速度
      onComplete = false, // popupAdjustの準備完了コールバック
      onOpen = false, // popupが開いた際のコールバック @return クリックされたpopupのid
      onClose = false, // popupを閉じた際のコールバック @return クリックされたpopupのid
    }: Partial<Options> = {}
  ) {
    this.scrTopTemp = 0;
    this.isOpen = false;
    this.isAllowClose = false;
    this.popupContent = '#popupContents';
    this.spBreakPoint = 768;
    this.scrTop = 0;
    this.scrLeft = 0;
    this.wHeight = 0;
    this.wWidth = 0;
    this.wIWidth = 0;
    this.wIHeight = 0;
    this.isRespMode = false;

    this.options = {
      btn: $selector,
      wrapper: wrapper,
      bg: bg,
      isUnlock: isUnlock,
      isSpFixed: isSpFixed,
      isAdjust: isAdjust,
      bgOpacity: bgOpacity,
      durationChange: durationChange,
      durationClose: durationClose,
      onComplete: onComplete,
      onOpen: onOpen,
      onClose: onClose,
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
        popupSrc.innerHTML = `
          <div class="closeVox">
            <a href="javascript:void(0)" class="popupCloseBt">
              <span><!-- --></span>
              <span><!-- --></span>
            </a>
          </div>
          <div class="contentWrapper">
            <div class="content"><!-- --></div>
          </div>
        `;

        document.querySelector(this.options.wrapper).appendChild(popupSrc);
        popupSrc.id = popupIDs[i];
        if (group) popupSrc.classList.add(group);
        document
          .querySelector(`#${popupIDs[i]}`)
          .querySelector('.content')
          .insertAdjacentHTML('beforeend', src);
        v.remove();
        // v.parentNode.removeChild(v);
      });

    document
      .querySelectorAll(`.popupCloseBt, ${this.options.bg}`)
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
        document
          .querySelectorAll(`.popupWrapper, ${this.options.bg}`)
          .forEach((vv) => {
            if (vv.classList.contains('is-animating')) return;
          });

        const id = v.getAttribute('data-popup');
        this.popupTarget = `#${id}`;

        document.querySelector<HTMLElement>(this.popupTarget).style.opacity =
          '0';
        document.querySelector<HTMLElement>(this.popupTarget).style.display =
          'block';

        this.change(`#${id}`);

        document.querySelector<HTMLElement>(this.popupTarget).style.display =
          'none';
        document.querySelector<HTMLElement>(this.popupTarget).style.opacity =
          '1';

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

      anime({
        targets: document.querySelector(this.options.bg),
        opacity: [0, this.options.bgOpacity],
        easing: 'linear',
        duration: this.options.durationChange,
        begin: () => {
          document.querySelector<HTMLElement>(this.options.bg).style.display =
            'block';
        },
        complete: () => {
          anime({
            targets: document.querySelector(id),
            opacity: [0, 1],
            duration: this.options.durationChange,
            begin: () => {
              document.querySelector<HTMLElement>(id).style.display = 'block';
              document
                .querySelector(`.popupWrapper, ${this.options.bg}`)
                .classList.add('is-animating');
            },
            complete: () => {
              this.isAllowClose = true;
              document
                .querySelector(`.popupWrapper, ${this.options.bg}`)
                .classList.remove('is-animating');
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
      anime({
        targets: v,
        opacity: [1, 0],
        duration: this.options.durationClose,
        complete: () => {
          (<HTMLElement>v).style.display = 'none';
          anime({
            targets: this.options.bg,
            opacity: [1, 0],
            duration: this.options.durationClose,
            easing: 'linear',
            complete: () => {
              document.querySelector<HTMLElement>(
                this.options.bg
              ).style.display = 'none';
              document
                .querySelectorAll('.popupWrapper')
                .forEach((vv) => ((<HTMLElement>vv).style.display = 'none'));
              this.isOpen = false;

              if (typeof this.options.onClose === 'function') {
                this.options.onClose(this.popupTarget);
              }
            },
          });
        },
      });
      anime({
        targets: v,
        opacity: [1, 0],
        duration: this.options.durationClose,
        complete: () => {
          anime({
            targets: v,
            opacity: [1, 0],
            duration: this.options.durationClose,
            complete: () => {
              document.querySelector<HTMLElement>(
                this.options.bg
              ).style.display = 'none';
              document.querySelector<HTMLElement>(
                '.popupWrapper'
              ).style.display = 'none';
              this.isOpen = false;

              if (typeof this.options.onClose === 'function') {
                this.options.onClose(this.popupTarget);
              }
            },
          });
          document
            .querySelectorAll('.popupWrapper.movie .content')
            .forEach((vv, i) => {
              if (vv) vv.innerHTML = '';
            });
        },
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
