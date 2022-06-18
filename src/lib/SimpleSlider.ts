import anime from 'animejs/lib/anime.es.js';
/**
 * シンプルなカルーセルスライダ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2022.06.11
 *
 * @param {*} $selector
 * @param {*} $options
 */
interface Options {
  isAuto: boolean;
  isLoop: boolean;
  pause: number;
  speed: number;
  easing: string;
  ctrl: boolean;
  pager: boolean;
  wrapper: HTMLElement | ParentNode;
  threshold: number;
  rootCount: number;
  activeIndexInt: number;
  oldIndexInt: number;
  etcIndexInt: number;
  onSliderLoad: any;
  onSlideBefore: any;
  onSlideAfter: any;
}
export class SimpleSlider {
  private time: number;
  public options: Options;
  private elem: HTMLElement;
  private current: number;
  private count: number;
  private isAllowSlide: boolean;
  private rTimer: number | boolean;
  private pagerEvent: string[];
  private length: number;
  private startX: number;
  private moveX: number;

  constructor(
    $selector: string,
    {
      isAuto = true,
      isLoop = true,
      pause = 5000,
      speed = 500,
      easing = 'cubicBezier(0.33, 1, 0.68, 1)',
      ctrl = false,
      pager = false,
      wrapper = document.querySelector($selector).parentNode,
      threshold = 0,
      rootCount = 1,
      activeIndexInt = 52,
      oldIndexInt = 51,
      etcIndexInt = 50,
      onSliderLoad = false,
      onSlideBefore = false, // oldIndex, newIndex
      onSlideAfter = false, // oldIndex, newIndex
    }: Partial<Options> = {}
  ) {
    this.time = Date.now();
    this.elem = document.querySelector($selector);
    this.current = 0;
    this.count = 0;
    this.isAllowSlide = false;
    this.rTimer = false;
    this.pagerEvent = [];
    this.options = {
      isAuto: isAuto,
      isLoop: isLoop,
      pause: pause,
      speed: speed,
      easing: easing,
      ctrl: ctrl,
      pager: pager,
      wrapper: wrapper,
      threshold: threshold,
      rootCount: rootCount,
      activeIndexInt: activeIndexInt,
      oldIndexInt: oldIndexInt,
      etcIndexInt: etcIndexInt,
      onSliderLoad: onSliderLoad,
      onSlideBefore: onSlideBefore,
      onSlideAfter: onSlideAfter,
    };

    this.init();
  }
  init() {
    if (this.options.pause < this.options.speed) {
      this.options.speed = this.options.pause - 1;
    }
    this.count = this.elem.children.length;

    if (this.count > 1) {
      if (this.count > this.options.rootCount) {
      }
    }
  }
}
