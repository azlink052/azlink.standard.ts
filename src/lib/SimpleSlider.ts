import anime from 'animejs/lib/anime.es.js';
import { Utilities } from './Utilities';
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
  duration: number;
  ctrl: boolean;
  pager: boolean;
  wrapper: HTMLElement | ParentNode;
  rootCount: number;
  cloneCount: number;
  threshold: number;
  onSliderLoad: any;
  onSlideBefore: any;
  onSlideAfter: any;
}
export class SimpleSlider {
  private time: number;
  public options: Options;
  private selector: string;
  private elem: HTMLElement;
  private container: HTMLElement;
  private prevBtn: HTMLAnchorElement;
  private nextBtn: HTMLAnchorElement;
  private itemWidth: number;
  private itemLength: number;
  private itemLengthOrg: number;
  private current: number;
  private remainder: number;
  private pageLength: number;
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
      duration = 500,
      ctrl = false,
      pager = false,
      wrapper = document.querySelector($selector).parentNode,
      rootCount = 1,
      cloneCount = 2,
      threshold = 0,
      onSliderLoad = false,
      onSlideBefore = false, // oldIndex, newIndex
      onSlideAfter = false, // oldIndex, newIndex
    }: Partial<Options> = {}
  ) {
    this.time = Date.now();
    this.selector = $selector;
    this.elem = document.querySelector($selector);
    this.current = 0;
    this.pageLength = 1;
    this.itemLength = 0;
    this.itemLengthOrg = 0;
    this.remainder = 0;
    this.isAllowSlide = false;
    this.rTimer = false;
    this.pagerEvent = [];
    this.options = {
      isAuto: isAuto,
      isLoop: isLoop,
      pause: pause,
      speed: speed,
      easing: easing,
      duration: duration,
      ctrl: ctrl,
      pager: pager,
      wrapper: wrapper,
      rootCount: rootCount,
      cloneCount: cloneCount,
      threshold: threshold,
      onSliderLoad: onSliderLoad,
      onSlideBefore: onSlideBefore,
      onSlideAfter: onSlideAfter,
    };
    // console.log(this.options, this.options.rootCount);

    this.init();
  }
  init(): void {
    if (this.options.pause < this.options.speed) {
      this.options.speed = this.options.pause - 1;
    }
    this.itemLength = this.itemLengthOrg = this.elem.children.length;

    Object.assign(this.elem.style, {
      display: 'flex',
      flexWrap: 'wrap',
    });

    if (this.itemLength > 1) {
      // console.log(this.options, this.options.rootCount);
      // console.log(this.options.rootCount === 1);
      if (!this.options.rootCount) {
        this.itemWidth = this.elem.firstElementChild.clientWidth;
        this.options.rootCount = Math.ceil(
          this.elem.clientWidth / this.itemWidth
        );
      } else {
        // console.log(this.options.wrapper);
        this.itemWidth = (<HTMLElement>this.options.wrapper).clientWidth;
      }
      Array.from(this.elem.children).forEach(
        (v: HTMLElement) => (v.style.width = `${this.itemWidth}px`)
      );
      // console.log(this.options.rootCount, this.itemLength, this.itemWidth);
      if (this.itemLength > this.options.rootCount) {
        this.elem.outerHTML = `<div class="sliderContainer">${this.elem.outerHTML}</div>`;
        this.elem = document.querySelector(this.selector);
        this.container = this.elem.closest('.sliderContainer');
        // console.log(this.container);
        Object.assign(this.container.style, {
          overflow: 'hidden',
        });
        this.elem.style.width = `${this.itemWidth * this.itemLength}px`;
        this.pageLength = Math.ceil(this.itemLength / this.options.rootCount);
        if (this.options.isLoop) {
          let w = this.elem.clientWidth;
          // console.log(W, UTIL.wWidth * 2)
          // const COPY = this.elem.children;
          // console.log(COPY);
          while (w <= this.container.clientWidth * this.options.cloneCount) {
            const COPY = this.elem.innerHTML;
            // this.elem.append(COPY);
            this.elem.insertAdjacentHTML('afterbegin', COPY);
            this.elem.insertAdjacentHTML('beforeend', COPY);
            this.itemLength = this.elem.childElementCount;
            this.elem.style.width = `${this.itemWidth * this.itemLength}px`;
            w = this.elem.clientWidth;
          }
          this.elem.style.transform = `translateX(-${
            this.itemWidth * this.itemLengthOrg
          }px)`;
        }
        this.remainder = this.pageLength - this.current;
        if (this.options.ctrl) {
          (<HTMLElement>this.options.wrapper).insertAdjacentHTML(
            'beforeend',
            `
              <div class="ss-ctrls">
                <div class="ss-ctrls-direction" />
              </div>
            `
          );
          this.options.wrapper
            .querySelector('.ss-ctrls-direction')
            .insertAdjacentHTML(
              'beforeend',
              `
                <a class="ss-prev" href="javascript:void(0)">Prev</a>
                <a class="ss-next" href="javascript:void(0)">Next</a>
              `
            );
          this.prevBtn = this.options.wrapper.querySelector('.ss-prev');
          this.nextBtn = this.options.wrapper.querySelector('.ss-next');
          this.pagerEvent['prev'] = this.prevBtn.addEventListener(
            'click',
            (e) => {
              if (!this.isAllowSlide) return;
              if ((<HTMLElement>e.target).classList.contains('is-disabled'))
                return;
              this.slide(this.getPrevSlide());
            },
            false
          );
          this.pagerEvent['next'] = this.nextBtn.addEventListener(
            'click',
            (e) => {
              if (!this.isAllowSlide) return;
              if ((<HTMLElement>e.target).classList.contains('is-disabled'))
                return;
              this.slide(this.getNextSlide());
            },
            false
          );
        }
        if (this.options.pager) {
          (<HTMLElement>this.options.wrapper).insertAdjacentHTML(
            'beforeend',
            '<div class="ss-pager" />'
          );
          // console.log(this.pageLength);
          for (let i = 0; i < this.pageLength; i++) {
            this.options.wrapper.querySelector('.ss-pager').insertAdjacentHTML(
              'beforeend',
              `
                <div class="ss-pager-item">
                  <a href="javascript:void(0)" data-index="${i}">${i + 1}</a>
                </div>
              `
            );
          }
          this.options.wrapper
            .querySelectorAll('.ss-pager-item')
            [this.current]?.querySelector('a')
            .classList.add('is-active');
          this.pagerEvent['pager'] = this.options.wrapper
            .querySelectorAll('.ss-pager-item a')
            .forEach((v, i) => {
              v.addEventListener('click', (e) => {
                if (!this.isAllowSlide) return;
                if ((<HTMLElement>e.target).classList.contains('is-active'))
                  return;
                const index = (<HTMLElement>e.target).getAttribute(
                  'data-index'
                );
                // 文字列変換
                this.slide(Number(index));
              });
            });
        }
      }
    }
    this.isAllowSlide = true;
    this.slide(0);
    // this.slideAuto();
    if (typeof this.options.onSliderLoad === 'function') {
      this.options.onSliderLoad();
    }
  }
  slide(target?: number | boolean): void {
    console.log(this.itemLength, this.pageLength);
    clearTimeout(Number(this.rTimer));
    if (!this.isAllowSlide) return;
    if (target === false) return;
    this.isAllowSlide = false;
    const OLD_INDEX = target !== this.current ? this.current : null;
    const NEW_INDEX = Number(target);
    this.current = NEW_INDEX;
    this.remainder = this.pageLength - this.current;
    // console.log(NEW_INDEX);
    if (typeof this.options.onSlideBefore === 'function') {
      this.options.onSlideBefore(OLD_INDEX, NEW_INDEX);
    }
    if (this.options.pager) this.togglePager();
    if (this.options.ctrl) this.toggleCtrls();
    Array.from(this.elem.children).forEach((v, i) => {
      v.classList.remove('slide-old', 'slide-active');
    });
    this.elem.children[NEW_INDEX + this.pageLength].classList.add(
      'slide-active'
    );
    this.elem.children[OLD_INDEX + this.pageLength]?.classList.add('slide-old');
    // console.log(OLD_INDEX, NEW_INDEX, target);
    anime({
      targets: this.elem,
      translateX: () => {
        if (NEW_INDEX > OLD_INDEX) {
          return `-=${this.itemWidth * (NEW_INDEX - OLD_INDEX)}px`;
        } else {
          return `+=${this.itemWidth * (OLD_INDEX - NEW_INDEX)}px`;
        }
      },
      easing: this.options.easing,
      duration: this.options.duration,
      complete: () => {
        // console.log(REMAINDER, LENGTH);
        this.isAllowSlide = true;
      },
    });
  }
  togglePager(): void {
    this.options.wrapper
      .querySelectorAll('.ss-pager-item a')
      .forEach((value) => {
        value.classList.remove('is-active');
      });
    this.options.wrapper
      .querySelectorAll('.ss-pager-item')
      [this.current]?.querySelector('a')
      .classList.add('is-active');
  }
  toggleCtrls(): void {
    if (this.options.isLoop || !this.options.ctrl) return;
    this.prevBtn.classList.remove('is-disabled');
    this.nextBtn.classList.remove('is-disabled');
    if (this.current === 0) this.prevBtn.classList.add('is-disabled');
    if (this.current === this.pageLength - 1)
      this.nextBtn.classList.add('is-disabled');
  }
  slideAuto(): void {
    if (!this.isAllowSlide || !this.options.isAuto) return;
    this.startSlideAuto();
  }
  startSlideAuto(): void {
    this.isAllowSlide = this.options.isAuto = true;
    // console.log('slideAuto');
    this.rTimer = window.setTimeout(() => {
      this.slide();
    }, this.options.pause);
  }
  getNextSlide(): number | boolean {
    if (this.options.isLoop) {
      return this.current === this.pageLength - 1 ? 0 : this.current + 1;
    } else {
      if (this.current !== this.itemLength - 1) {
        return this.current + 1;
      } else {
        return false;
      }
    }
  }
  getPrevSlide(): number | boolean {
    if (this.options.isLoop) {
      return this.current === 0 ? this.pageLength - 1 : this.current - 1;
    } else {
      if (this.current !== 0) {
        return this.current - 1;
      } else {
        return false;
      }
    }
  }
  updateParams(object: Options): void {
    for (let key in object) {
      this.options[key] = object[key];
    }
  }
  getParams(): any {
    return this;
  }
  reset(): void {
    this.current = this.itemLength - 1;
    this.slide(0);
  }
  destroy(): void {
    clearTimeout(Number(this.rTimer));
    for (const EVENT of this.pagerEvent) {
      document.removeEventListener('click', this.pagerEvent[EVENT]);
    }
    this.options.wrapper.querySelector('.ss-ctrls').remove();
    this.options.wrapper.querySelector('.ss-pager').remove();
    this.length = 0;
  }
}
