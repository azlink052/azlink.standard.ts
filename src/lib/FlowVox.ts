import anime from 'animejs/lib/anime.es.js';
import Utilities from './Utilities';
/**
 * 画面内に表示されることでアニメーションを実行
 * data-flow="mark" とすることでクラス付与のみとなる
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2022.04.28
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
  elem: Element;
  mode: string;
  target: HTMLElement | HTMLCollection;
  isDone: boolean;
  anime: any;
}
export default class FlowVox {
  private time: number;
  public options: Options;
  private flowAnime: Params[];
  private isFlowDefault: boolean;
  private observer: IntersectionObserver;

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
        ? 0.3
        : 0.2,
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
          // console.log(entry.target.getAttribute('data-flow-item'));
          const IS_VISIBLE = entry.isIntersecting ? true : false;
          // console.log(IS_VISIBLE);
          this.run(
            this.flowAnime[entry.target.getAttribute('data-flow-item')],
            IS_VISIBLE
          );
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
        target: v.children.length > 1 ? v.children : v,
        isDone: false,
        anime: null,
      };
      // console.log(
      //   `${typeof ITEM.target} ${Object.prototype.toString.call(ITEM.target)}`
      // );
      // Utilities.printType(ITEM.target);
      const KEY = `${this.time}_${i}`;
      v.setAttribute('data-flow-item', KEY);
      // ITEM.anime = ITEM;
      switch (ITEM.mode) {
        case 'down':
          ITEM.anime = anime({
            targets: ITEM.target,
            translateY: -this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'left':
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'right':
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: -this.options.translate,
            opacity: 0,
            duration: this.options.duration,
          });
          break;
        case 'leftdown':
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: this.options.translate,
            translateY: -this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'rightdown':
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: -this.options.translate,
            translateY: -this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'leftup':
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: this.options.translate,
            translateY: this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'rightup':
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: -this.options.translate,
            translateY: this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'zoom':
          ITEM.anime = anime({
            targets: ITEM.target,
            scale: 0,
            opacity: 0,
            duration: this.options.duration,
          });
          break;
        case 'away':
          ITEM.anime = anime({
            targets: ITEM.target,
            opacity: 0,
            duration: this.options.duration,
          });
          break;
        case 'mark':
          // Utilities.printType(v);
          // console.log(v.children.length);
          const TARGET_ARRAY =
            (<Element>v).childElementCount > 1 ? v.children : [v];
          Array.from(TARGET_ARRAY).forEach((v: HTMLElement, i) => {
            v.classList.remove('flowActive');
          });
          break;
        default:
          ITEM.anime = anime({
            targets: ITEM.target,
            translateY: this.options.translate,
            opacity: 0,
            duration: this.options.duration,
          });
      }
      this.observer.observe(ITEM.elem);
      // this.resetStyle(ITEM);
      this.flowAnime[KEY] = ITEM;
    });
  }
  run(ITEM: Params, isVisible: boolean) {
    // console.log(ITEM)
    if (ITEM.isDone) return;

    switch (ITEM.mode) {
      case 'down':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
        }
        break;
      case 'left':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
        }
        break;
      case 'right':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
        }
        break;
      case 'leftdown':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: 0,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: this.options.translate,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
        }
        break;
      case 'rightdown':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: 0,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: -this.options.translate,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
        }
        break;
      case 'leftup':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: 0,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: this.options.translate,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
        }
        break;
      case 'rightup':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: 0,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateX: -this.options.translate,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
          });
        }
        break;
      case 'zoom':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            scale: [0, 1],
            opacity: [0, 1],
            duration: this.options.duration,
            easing: 'spring',
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            scale: [1, 0],
            opacity: [1, 0],
            duration: this.options.duration,
            easing: 'spring',
            delay: anime.stagger(this.options.delay),
          });
        }
        break;
      case 'away':
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
          });
        }
        break;
      case 'mark':
        const TARGET_ARRAY =
          (<Element>ITEM.elem).childElementCount > 1
            ? (<Element>ITEM.elem).children
            : [ITEM.elem];
        if (isVisible) {
          Array.from(TARGET_ARRAY).forEach((v: HTMLElement, i) => {
            setTimeout(() => {
              v.classList.add('flowActive');
            }, i * this.options.delay);
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          Array.from(TARGET_ARRAY).forEach((v: HTMLElement, i) => {
            v.classList.remove('flowActive');
          });
        }
        break;
      default:
        if (isVisible) {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            easing: this.options.easing,
            delay: anime.stagger(this.options.delay),
          });
          if (!this.options.isRepeat) ITEM.isDone = true;
        } else {
          ITEM.anime = anime({
            targets: ITEM.target,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            easing: this.options.easing,
            delay: anime.stagger(this.options.delay),
          });
        }
    }
  }
  destroy() {
    // TODO 未実装
  }
}
