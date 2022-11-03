import anime from 'animejs/lib/anime.es.js';
/**
 * シンプルなアコーディオン
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2022.11.03
 *
 * @param {*} $selector string
 * @param {*} $options object
 */
interface Options {
  openClassName: string;
  changeDisplay: string;
  speed: number;
  easing: string;
  parentContainer: HTMLElement | ParentNode;
  isAutoClose: boolean; // 兄弟要素のアコーディオンを自動で閉じるか
  onCloseAfter: any;
  onOpenAfter: any;
}
export class SimpleAccordion {
  private collection: NodeListOf<HTMLElement>;
  public options: Options;

  constructor(
    $selector: string,
    {
      openClassName = 'is-open',
      changeDisplay = 'block',
      speed = 400,
      easing = 'easeOutCubic',
      parentContainer = document.querySelector($selector).parentNode,
      isAutoClose = false,
      onCloseAfter = false, // id
      onOpenAfter = false, // id
    }: Partial<Options> = {}
  ) {
    this.collection = document.querySelectorAll($selector);
    this.options = {
      openClassName: openClassName,
      changeDisplay: changeDisplay,
      speed: speed,
      easing: easing,
      parentContainer: parentContainer,
      isAutoClose: isAutoClose,
      onCloseAfter: onCloseAfter,
      onOpenAfter: onOpenAfter,
    };

    this.init();
  }
  init(): void {
    this.collection.forEach((v, i) => {
      const itemDate: number = (() => {
        const time: Date = new Date();
        return time.getTime();
      })();
      interface AccParams {
        wrap: HTMLElement;
        opener: HTMLElement;
        body: HTMLElement;
        height: number;
        isAllowChange: boolean;
        id: string;
      }
      const accParam: AccParams = {
        wrap: v,
        opener: v.querySelector('.opener'),
        body: v.querySelector('.accContent'),
        height: 0,
        isAllowChange: false,
        id: ((): string => {
          const num: number = parseInt(`${itemDate}_${i}`);
          return `accItem_${num}`;
        })(),
      };
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
      // イベント
      accParam.opener.addEventListener('click', (e) => {
        if (!accParam.isAllowChange) return;
        accParam.isAllowChange = false;
        // console.log(accParam.body.style.display);
        if (accParam.body.style.display === this.options.changeDisplay) {
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
              if (typeof this.options.onCloseAfter === 'function') {
                this.options.onCloseAfter(accParam.id);
              }
            },
          });
        } else {
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
          if (this.options.isAutoClose) {
            // TODO autoClsoeの実装
          }
          anime({
            targets: accParam.body,
            height: [0, accParam.height],
            duration: this.options.speed,
            easing: this.options.easing,
            complete: () => {
              accParam.body.style.height = 'auto';
              accParam.height = accParam.body.clientHeight;
              accParam.isAllowChange = true;
              // console.log(accParam);
              if (typeof this.options.onOpenAfter === 'function') {
                this.options.onOpenAfter(accParam.id);
              }
            },
          });
        }
      });
    });
  }
}
