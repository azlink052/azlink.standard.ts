import anime from 'animejs/lib/anime.es.js';
/**
 * 画面内に表示されることでアニメーションを実行
 * data-flow="mark" とすることでクラス付与のみとなる
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2021.10.03
 *
 * @param {*} $selector
 * @param {*} $options
 */
interface Options {
  translate: number;
  duration: number;
  delay: number;
  easing: string;
  autorun: boolean;
  per: number;
  // zoomIn: number;
  // zoomInDuration: number;
  // zoomOutDuration: number;
  isRepeat: boolean;
}
interface Params {
  elem: HTMLElement;
  mode: string;
  target: Element[];
  isDone: boolean;
}
export class FlowVox {
  private time: number;
  public options: Options;
  private flowAnime: Params[];
  private isFlowDefault: boolean;
  private observer: IntersectionObserver;
  private currentIndex: number;

  constructor(
    $selector: string,
    {
      translate = 60,
      duration = 600,
      delay = 300,
      easing = 'cubicBezier(0.33, 1, 0.68, 1)',
      autorun = true,
      per = Number(document.documentElement.clientWidth) >
      Number(document.documentElement.clientHeight)
        ? 0.6
        : 0.95,
      // zoomIn = 1.2,
      // zoomInDuration = 350,
      // zoomOutDuration = 150,
      isRepeat = false,
    }: Partial<Options> = {}
  ) {
    this.time = Date.now();
    this.options = {
      translate: translate,
      duration: duration,
      delay: delay,
      easing: easing,
      autorun: autorun,
      per: per,
      // zoomIn: zoomIn,
      // zoomInDuration: zoomInDuration,
      // zoomOutDuration: zoomOutDuration,
      isRepeat: isRepeat,
    };
    this.flowAnime = [];
    this.isFlowDefault = false;
    // console.log(window.innerHeight * this.options.per)

    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // console.log(entry);
          const IS_VISIBLE = entry.isIntersecting ? true : false;
          console.log(IS_VISIBLE);
          this.run(this.flowAnime[this.currentIndex], IS_VISIBLE);
        });
      },
      {
        root: null,
        rootMargin: `0px 0px -${window.innerHeight * this.options.per}px`,
        threshold: 0,
      }
    );

    this.init($selector);
  }
  init($selector: string) {
    document.querySelectorAll<HTMLElement>($selector).forEach((v, i) => {
      const ITEM = {
        elem: v,
        mode: v.getAttribute('data-flow') || 'up',
        target: v.children.length > 1 ? Array.from(v.children) : [v],
        isDone: false,
      };
      v.setAttribute('data-flow-item', `${this.time}_${i}`);
      this.flowAnime[i] = ITEM;
      this.observer.observe(ITEM.elem);
      this.resetStyle(this.flowAnime[i]);
      this.currentIndex = i;
    });
    console.log(this.flowAnime);
    console.log(this.currentIndex);
  }
  run(ITEM: Params, isVisible: boolean) {}
  resetStyle(ITEM: Params) {
    // console.log(ITEM);
    switch (ITEM.mode) {
      case 'down':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'left':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            translateX: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'right':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            translateX: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'leftdown':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            translateX: this.options.translate,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'rightdown':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            translateX: -this.options.translate,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'leftup':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            translateX: this.options.translate,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'rightup':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            translateX: -this.options.translate,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'zoom':
        // Array.from(ITEM.target, (v: HTMLElement, i) => {
        //   value.style.visibility = 'visible';
        //   value.style.transformOrigin = 'center';
        //   anime({
        //     targets: value,
        //     scale: 0,
        //     duration: this.options.duration,
        //   });
        // });
        ITEM.target.forEach((v, i) => {
          (<HTMLElement>v).style.visibility = 'visible';
          (<HTMLElement>v).style.transformOrigin = 'center';
          anime({
            targets: v,
            scale: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'away':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
        break;
      case 'mark':
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.classList.remove('flowActive');
        });
        break;
      default:
        ITEM.target.forEach((v: HTMLElement, i) => {
          v.style.visibility = 'visible';
          anime({
            targets: v,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
          });
        });
    }
  }
  destroy() {
    // TODO 未実装
  }
}
