/**
 * bg用loading lazy
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2022.10.06
 *
 * @param {*} $selector
 * @param {*} $options
 * @returns
 */
interface Options {
  root: HTMLElement | null;
  rootMargin: string;
  threshold: number;
  hideTag: string;
  showTag: string;
  onComplete: any;
}
export class LazyLoadBg {
  private collection: NodeListOf<HTMLElement>;
  private length: number;
  private options: Options;
  private observer: IntersectionObserver | null;

  constructor(
    $selector: string,
    {
      root = null, // ビューポートとして使用される要素
      rootMargin = '0px', // root の周りのマージン
      threshold = 1.0, // ターゲットがどのくらいの割合で見えている場合にオブザーバーのコールバックを実行するか
      hideTag = 'js-lazyBg', // hide時のクラス名
      showTag = 'is-completeLazyBg', // complete時要素に追加するクラス名
      onComplete = false, // complete時に実行したい処理
    }: Partial<Options> = {}
  ) {
    this.collection = document.querySelectorAll($selector);
    this.length = this.collection.length;

    if (!this.length) this.die();

    this.options = {
      root: root,
      rootMargin: rootMargin,
      threshold: threshold,
      hideTag: hideTag,
      showTag: showTag,
      onComplete: onComplete,
    };

    this.init();
  }
  init(): void {
    this.run();
  }
  run(): void {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        // console.log(entry.isIntersecting);
        if (entry.isIntersecting) {
          entry.target.classList.remove(this.options.hideTag);
          entry.target.classList.add(this.options.showTag);
        }
      });
    }, this.options);
    this.collection.forEach((v: Element) => {
      this.observer.observe(v);
    });
  }
  destroy(): void {
    this.collection.forEach((value) => {
      value.classList.remove(this.options.showTag);
      value.classList.add(this.options.hideTag);
    });
    this.observer = null;
  }
  reload(): void {
    this.destroy();
    this.init();
  }
  die(): boolean {
    return false;
  }
}
