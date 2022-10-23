import anime from 'animejs/lib/anime.es.js';
import { Utilities } from './Utilities';
/**
 * 画面内に表示されることでアニメーションを実行
 * data-flow="mark" とすることでクラス付与のみとなる
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2022.10.24
 * 20221024 easing 初期値設定
 *
 * @param {*} $selector
 * @param {*} $options
 */
interface Options {
  translate: number;
  duration: number;
  delay: number;
  easing: string;
  // autorun: boolean;
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
export class FlowVox {
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
      // autorun = true,
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
      // autorun: autorun,
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
          const isVisible = entry.isIntersecting ? true : false;
          // console.log(isVisible);
          this.run(
            this.flowAnime[entry.target.getAttribute('data-flow-item')],
            isVisible
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
  init($selector: string): void {
    document.querySelectorAll<HTMLElement>($selector).forEach((v, i) => {
      const item = {
        elem: v,
        mode: v.getAttribute('data-flow') || 'up',
        target: v.children.length > 1 ? v.children : v,
        isDone: false,
        anime: null,
      };
      // console.log(
      //   `${typeof item.target} ${Object.prototype.toString.call(item.target)}`
      // );
      // Utilities.printType(item.target);
      const key = `${this.time}_${i}`;
      v.setAttribute('data-flow-item', key);
      v.classList.remove('is-finishedFlowAnime');
      // item.anime = item;
      switch (item.mode) {
        case 'down':
          item.anime = anime({
            targets: item.target,
            translateY: -this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'left':
          item.anime = anime({
            targets: item.target,
            translateX: this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'right':
          item.anime = anime({
            targets: item.target,
            translateX: -this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'leftdown':
          item.anime = anime({
            targets: item.target,
            translateX: this.options.translate,
            translateY: -this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'rightdown':
          item.anime = anime({
            targets: item.target,
            translateX: -this.options.translate,
            translateY: -this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'leftup':
          item.anime = anime({
            targets: item.target,
            translateX: this.options.translate,
            translateY: this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'rightup':
          item.anime = anime({
            targets: item.target,
            translateX: -this.options.translate,
            translateY: this.options.translate,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'zoom':
          item.anime = anime({
            targets: item.target,
            scale: 0,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'away':
          item.anime = anime({
            targets: item.target,
            opacity: 0,
            duration: 10,
          });
          break;
        case 'mark':
          // Utilities.printType(v);
          // console.log(v.children.length);
          const targetArray =
            (<Element>v).childElementCount > 1 ? v.children : [v];
          Array.from(targetArray).forEach((v: HTMLElement, i) => {
            v.classList.remove('flowActive');
          });
          break;
        default:
          item.anime = anime({
            targets: item.target,
            translateY: this.options.translate,
            opacity: 0,
            duration: 10,
          });
      }
      this.observer.observe(item.elem);
      // this.resetStyle(item);
      this.flowAnime[key] = item;
    });
  }
  run(item: Params, isVisible: boolean): void {
    // console.log(item)
    if (item.isDone) return;

    if (isVisible) {
      if (!item.elem.classList.contains('is-beganFlowAnime'))
        item.elem.classList.add('is-beganFlowAnime');
    }

    switch (item.mode) {
      case 'down':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'left':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            translateX: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            translateX: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'right':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            translateX: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            translateX: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'leftdown':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            translateX: 0,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            translateX: this.options.translate,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'rightdown':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            translateX: 0,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            translateX: -this.options.translate,
            translateY: -this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'leftup':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            translateX: 0,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            translateX: this.options.translate,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'rightup':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            translateX: 0,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            translateX: -this.options.translate,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'zoom':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            scale: [0, 1],
            opacity: [0, 1],
            duration: this.options.duration,
            easing: 'spring',
            delay: anime.stagger(this.options.delay),
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            scale: [1, 0],
            opacity: [1, 0],
            duration: this.options.duration,
            easing: 'spring',
            delay: anime.stagger(this.options.delay),
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'away':
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            opacity: [0, 1],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          item.anime = anime({
            targets: item.target,
            opacity: [1, 0],
            duration: this.options.duration,
            delay: anime.stagger(this.options.delay),
            easing: this.options.easing,
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
        break;
      case 'mark':
        const targetArray =
          (<Element>item.elem).childElementCount > 1
            ? (<Element>item.elem).children
            : [item.elem];
        if (isVisible) {
          Array.from(targetArray).forEach((v: HTMLElement, i) => {
            setTimeout(() => {
              v.classList.add('flowActive');
            }, i * this.options.delay);
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          Array.from(targetArray).forEach((v: HTMLElement, i) => {
            v.classList.remove('flowActive');
          });
        }
        break;
      default:
        if (isVisible) {
          item.anime = anime({
            targets: item.target,
            translateY: 0,
            opacity: [0, 1],
            duration: this.options.duration,
            easing: this.options.easing,
            delay: anime.stagger(this.options.delay),
            complete: () => {
              item.elem.classList.add('is-finishedFlowAnime');
            },
          });
          if (!this.options.isRepeat) item.isDone = true;
        } else {
          if (!item.elem.classList.contains('is-beganFlowAnime')) return;
          item.anime = anime({
            targets: item.target,
            translateY: this.options.translate,
            opacity: [1, 0],
            duration: this.options.duration,
            easing: this.options.easing,
            delay: anime.stagger(this.options.delay),
            complete: () => {
              item.elem.classList.remove('is-finishedFlowAnime');
            },
          });
        }
    }
  }
  destroy(): void {
    // TODO 未実装
  }
}
