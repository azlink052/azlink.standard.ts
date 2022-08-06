/**
 * 固定幅のレイアウトを画面幅の倍率に合わせる
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2021.09.26
 *
 * @param {*} $selector
 * @param {*} $options
 */
interface Options {
  w: number;
  bp: number;
  to: 'left top';
}
export class RatioAdjust {
  private collection: NodeListOf<HTMLElement>;
  private rTimer: number | boolean;
  public options: Options;
  private ratio: number;
  private targetHeight: number | string[];
  private wHeight: number;
  private wWidth: number;
  private wIWidth: number;
  private wIHeight: number;
  private isRespMode: boolean;
  private orgMode: number;
  private currentMode: number;
  private isChangeMode: boolean;
  private spBreakPoint: number;
  private doEvent: () => void;

  constructor(
    $selector: string,
    { w = 375, bp = 768, to = 'left top' }: Partial<Options> = {}
  ) {
    this.collection = document.querySelectorAll($selector);
    this.options = {
      w: w,
      bp: bp,
      to: to,
    };
    this.ratio = 1;
    this.targetHeight = [];
    this.wHeight = 0;
    this.wWidth = 0;
    this.wIWidth = 0;
    this.wIHeight = 0;
    this.isRespMode = false;
    this.orgMode = 1; // ロード時のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
    this.currentMode = 1; // 現在のレスポンシブ状態 (レスポンシブで2 そうでなければ1)
    this.isChangeMode = false; // レスポンシブ状態が変更になったらtrue

    this.doEvent = () => this.setEvent();

    this.init();
  }
  init(): void {
    setTimeout(() => {
      this.setH();
      this.adjust();
    }, 1500);

    window.addEventListener('resize', this.doEvent);
  }
  setH(): void {
    this.collection.forEach((v, i) => {
      (<HTMLElement>v).style.height = 'auto';
      this.targetHeight[i] = v.style.height;
    });
  }
  setR(): void {
    const ratio =
      this.wWidth < this.options.bp ? window.innerWidth / this.options.w : 1;
    this.ratio = Number(ratio.toFixed(2));
  }
  adjust(): void {
    this.setRespMode();
    this.setR();

    this.collection.forEach((v, i) => {
      Object.assign(v.style, {
        transformOrigin: this.options.to,
        transform: `scale(${this.ratio})`,
      });
      const h = (() => {
        if (this.ratio > 1 || this.ratio < 1) {
          return this.wWidth < this.options.bp
            ? this.targetHeight[i] * this.ratio
            : 'auto';
        } else {
          return 'auto';
        }
      })();

      v.style.height = `${h}px`;
    });
  }
  setEvent(): void {
    if (this.rTimer !== false) {
      clearTimeout(Number(this.rTimer));
      this.rTimer = false;
    }

    this.rTimer = window.setTimeout(() => {
      this.adjust();
      this.setRespMode();
      if (this.isChangeMode) {
        this.reset();
      }
    }, 500);
  }
  destroy(): void {
    window.removeEventListener('resize', this.doEvent);

    this.collection.forEach((v, i) => {
      v.style.removeProperty('height');
      v.style.removeProperty('transform');
    });
  }
  reset(): void {
    this.destroy();
    this.init();
  }
  setRespMode(): void {
    this.wHeight = Number(document.documentElement.clientHeight);
    this.wWidth = Number(document.documentElement.clientWidth);
    this.wIWidth = Number(window.innerWidth);
    this.wIHeight = Number(window.innerHeight);
    this.isRespMode = this.wIWidth < this.spBreakPoint ? true : false;

    let oldMode = this.currentMode;
    this.currentMode = this.isRespMode ? 2 : 1;
    this.isChangeMode = oldMode !== this.currentMode ? true : false;
  }
}
