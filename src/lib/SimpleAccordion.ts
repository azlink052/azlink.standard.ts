import anime from 'animejs/lib/anime.es.js';
/**
 * シンプルなアコーディオン
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2023.06.25
 *
 * @param {*} $selector string
 * @param {*} $options object
 */
interface Options {
  openClassName: string;
  changeDisplay: string;
  speed: number;
  easing: string;
  parentContainer: HTMLElement;
  isAutoClose: boolean; // 兄弟要素のアコーディオンを自動で閉じるか
  onCloseAfter: any;
  onOpenAfter: any;
  onComplete: any;
}
interface AccParam {
  wrap: HTMLElement;
  opener: HTMLElement;
  body: HTMLElement;
  height: number;
  isAllowChange: boolean;
  id: string;
}
export class SimpleAccordion {
  private collection: NodeListOf<HTMLElement>;
  private selector: string;
  private accParams: {} = {};
  public options: Options;

  constructor(
    $selector: string = '.accVox',
    {
      openClassName = 'is-open',
      changeDisplay = 'block',
      speed = 400,
      easing = 'easeOutCubic',
      parentContainer = document.querySelector($selector)?.parentElement,
      isAutoClose = false,
      onCloseAfter = false, // id
      onOpenAfter = false, // id
      onComplete = false, // simpleAccordionの準備完了コールバック
    }: Partial<Options> = {}
  ) {
    this.collection = document.querySelectorAll($selector);
    this.selector = $selector;
    this.options = {
      openClassName: openClassName,
      changeDisplay: changeDisplay,
      speed: speed,
      easing: easing,
      parentContainer: parentContainer,
      isAutoClose: isAutoClose,
      onCloseAfter: onCloseAfter,
      onOpenAfter: onOpenAfter,
      onComplete: onComplete,
    };

    this.init();
  }
  init(): void {
    if (!this.collection.length) return;

    this.collection.forEach((v: HTMLElement, i: number) => {
      const itemDate: number = (() => {
        const time: Date = new Date();
        return time.getTime();
      })();
      const accParam: AccParam = {
        wrap: v,
        opener: v.querySelector('.opener'),
        body: v.querySelector('.accContent'),
        height: 0,
        isAllowChange: false,
        id: ((): string => {
          const num: number = parseInt(`${itemDate}${i}`);
          return `accItem_${num}`;
        })(),
      };
      this.accParams[accParam.id] = accParam;
      v.id = accParam.id;
      // 初期化
      accParam.height = accParam.body.offsetHeight;
      anime({
        targets: accParam.body,
        height: 0,
        duration: 1,
        complete: () => {
          accParam.isAllowChange = true;
          Object.assign(accParam.body.style, {
            display: 'none',
            overflow: 'hidden',
          });
          document.body.classList.add('is-allowChangeAcc');
        },
      });
      accParam.wrap.classList.remove(this.options.openClassName);
      accParam.opener.setAttribute('aria-expanded', 'false');
      accParam.opener.setAttribute('aria-controls', `${accParam.id}_body`);
      accParam.body.setAttribute('aria-hidden', 'true');
      accParam.body.id = `${accParam.id}_body`;
      // イベント
      accParam.opener.addEventListener('click', (e) => {
        if (!accParam.isAllowChange) return;
        accParam.isAllowChange = false;
        // console.log(accParam.body.style.display);
        if (accParam.body.style.display === this.options.changeDisplay) {
          this.close(accParam.id);
        } else {
          this.open(accParam.id);
          // isAutoCloseが有効な場合、兄弟要素のアコーディオンを閉じる
          if (this.options.isAutoClose) {
            const targets: string[] = [];
            this.options.parentContainer
              .querySelectorAll(this.selector)
              .forEach((vv: HTMLElement, ii: number) => {
                if (vv.id !== accParam.id) {
                  this.close(vv.id);
                }
              });
          }
        }
      });
      if (i + 1 >= this.collection.length) {
        if (typeof this.options.onComplete === 'function') {
          this.options.onComplete();
        }
      }
    });
  }
  open(key: string): void {
    const accParam = this.accParams[key];
    accParam.wrap.classList.add(this.options.openClassName);
    Object.assign(accParam.body.style, {
      display: this.options.changeDisplay,
      visibility: 'hidden',
      position: 'absolute',
      height: 'auto',
    });
    // accParam.height = accParam.body.clientHeight;
    // console.log(accParam.height);
    Object.assign(accParam.body.style, {
      visibility: 'visible',
      position: 'static',
      height: '0px',
    });
    // console.log(accParam.height);
    // isAutoCloseが有効な場合、兄弟要素のアコーディオンを閉じる
    anime({
      targets: accParam.body,
      height: [0, accParam.height],
      duration: this.options.speed,
      easing: this.options.easing,
      complete: () => {
        accParam.body.style.height = 'auto';
        accParam.body.setAttribute('aria-hidden', 'false');
        accParam.opener.setAttribute('aria-expanded', 'true');
        accParam.height = accParam.body.clientHeight;
        accParam.isAllowChange = true;
        // console.log(accParam);
        if (typeof this.options.onOpenAfter === 'function') {
          this.options.onOpenAfter(accParam.id);
        }
      },
    });
  }
  close(key: string): void {
    const accParam = this.accParams[key];
    accParam.wrap.classList.remove(this.options.openClassName);
    accParam.body.style.removeProperty('height');
    anime({
      targets: accParam.body,
      height: 0,
      duration: this.options.speed,
      easing: this.options.easing,
      complete: () => {
        accParam.isAllowChange = true;
        accParam.body.style.display = 'none';
        accParam.body.setAttribute('aria-hidden', 'true');
        accParam.opener.setAttribute('aria-expanded', 'false');
        if (typeof this.options.onCloseAfter === 'function') {
          this.options.onCloseAfter(accParam.id);
        }
      },
    });
  }
}
