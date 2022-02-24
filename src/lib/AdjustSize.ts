/**
 * 子要素の高さ合わせ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2021.09.26
 *
 * @param {*} $selector
 * @param {*} $options
 * @returns
 */
interface Options {
  type: AdjustType;
  plus: number;
  isResizeAuto: boolean;
}
type AdjustType = 'inner' | 'outer';
export default class AdjustSize {
  private collection: NodeListOf<HTMLElement>;
  private rTimer: number | Boolean;
  private setHeight: number;
  private count: number;
  private length: number;
  private options: Options;

  constructor(
    $selector: string,
    { type = 'inner', plus = 0, isResizeAuto = true }: Partial<Options> = {}
  ) {
    this.collection = document.querySelectorAll($selector);
    this.rTimer;
    this.setHeight = 0;
    this.count = 0;
    this.length = this.collection.length;

    if (!this.length) this.die();

    this.options = {
      type: type,
      plus: plus,
      isResizeAuto: isResizeAuto,
    };

    this.init();
  }
  init() {
    if (this.options.isResizeAuto) {
      window.addEventListener('resize', () => {
        if (this.rTimer !== false) {
          clearTimeout(Number(this.rTimer));
          this.rTimer = false;
        }

        this.rTimer = window.setTimeout(() => {
          this.reload();
        }, 500);
      });
    }

    this.adjust();
  }
  adjust() {
    this.collection.forEach((value, index) => {
      // 対象子要素
      value.style.height = 'auto';
      let getHeight = 0;
      const IMAGES = [];
      let loaded = 0;

      value.querySelectorAll('img').forEach((v) => {
        // 子要素内のimgを配列に格納
        IMAGES.push(v.src);
      });

      let promise = Promise.resolve();

      const CALLBACK = () => {
        switch (this.options.type) {
          case 'inner':
            getHeight = value.clientHeight;
            break;
          case 'outer':
          default:
            getHeight = value.offsetHeight;
        }

        this.setHeight =
          getHeight > this.setHeight ? getHeight : this.setHeight;
        promise = promise.then(() => {
          this.count++;
          if (this.count == this.length) {
            this.collection.forEach((v, i) => {
              v.style.height = this.setHeight + this.options.plus + 'px';
            });
          }
        });
      };

      if (IMAGES.length) {
        let inPromise = Promise.resolve();

        for (let i = 0; i < IMAGES.length; i++) {
          const IMG = document.createElement('img');
          IMG.src = IMAGES[i];

          const IMG_PRE_LOADER = new Image();
          IMG_PRE_LOADER.src = IMAGES[i];
          IMG_PRE_LOADER.onload = () => {
            inPromise = inPromise.then(() => {
              loaded++;
              if (loaded === IMAGES.length) {
                CALLBACK();
              }
            });
          };
        }
      } else {
        CALLBACK();
      }
    });
  }
  destroy() {
    this.collection.forEach((value, index) => {
      value.style.removeProperty('height');
    });
    window.removeEventListener('resize', this.adjust);
  }
  reload() {
    this.destroy();
    this.init();
  }
  die(): boolean {
    return false;
  }
}
