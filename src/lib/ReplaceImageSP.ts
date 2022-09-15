/**
 * 画像をSP用に差し替え
 * 頭にSP_のついた画像を用意
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2022.09.15
 *
 * @param {*} $target
 * @param {*} $options
 */
interface Options {
  pcName: string;
  spName: string;
  spBreakPoint: number;
}
export class ReplaceImageSP {
  private collection: NodeListOf<HTMLElement>;
  public options: Options;
  private wHeight: number;
  private wWidth: number;
  private wIWidth: number;
  private wIHeight: number;
  private isRespMode: boolean;
  private setEventAdjust: () => void;
  constructor(
    $selector = '.rplSPImg',
    {
      pcName = 'PC_',
      spName = 'SP_',
      spBreakPoint = 768,
    }: Partial<Options> = {}
  ) {
    this.collection = document.querySelectorAll($selector);
    this.options = {
      pcName: pcName,
      spName: spName,
      spBreakPoint: spBreakPoint,
    };
    this.wHeight = 0;
    this.wWidth = 0;
    this.wIWidth = 0;
    this.wIHeight = 0;
    this.isRespMode = false;

    this.setEventAdjust = () => this.adjust();

    this.init();
  }
  init(): void {
    // this.setRespMode = this.setRespMode.bind(this);
    window.addEventListener('load', this.setEventAdjust);
    window.addEventListener('resize', this.setEventAdjust);
  }
  adjust(): void {
    this.setRespMode();

    return this.collection.forEach((v, i) => {
      if (!this.isRespMode) {
        (<HTMLImageElement>v).src = (<HTMLImageElement>v).src.replace(
          this.options.spName,
          this.options.pcName
        );
      } else {
        (<HTMLImageElement>v).src = (<HTMLImageElement>v).src.replace(
          this.options.pcName,
          this.options.spName
        );
      }
    });
  }
  destroy(): void {
    window.removeEventListener('laod', this.setEventAdjust);
    window.removeEventListener('resize', this.setEventAdjust);
  }
  setRespMode(): void {
    this.wHeight = Number(document.documentElement.clientHeight);
    this.wWidth = Number(document.documentElement.clientWidth);
    this.wIWidth = Number(window.innerWidth);
    this.wIHeight = Number(window.innerHeight);
    this.isRespMode = this.wIWidth < this.options.spBreakPoint ? true : false;
  }
}
