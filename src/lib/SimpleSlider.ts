import anime from 'animejs/lib/anime.es.js';
import { Utilities } from './Utilities';
/**
 * シンプルなカルーセルスライダ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2022.06.27
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
  rootCount: number | boolean;
  slideCount: number;
  cloneCount: number;
  threshold: number;
  onSliderLoad: any;
  onSlideBefore: any;
  onSlideAfter: any;
  isDebug: boolean;
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
  private realCurrent: number;
  private oldIndex: number;
  private remainder: number;
  private pageLength: number;
  private isAllowSlide: boolean;
  private rTimer: number | boolean;
  private pagerEvent: string[];
  private startX: number;
  private moveX: number;
  private orgElement: Element | boolean;
  private debugTimer: number | boolean;

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
      rootCount = false, // 1ページに表示する量
      slideCount = 1, // 1度に動かす量
      cloneCount = 2,
      threshold = 0,
      onSliderLoad = false,
      onSlideBefore = false, // oldIndex, newIndex, this
      onSlideAfter = false, // oldIndex, newIndex
      isDebug = false,
    }: Partial<Options> = {}
  ) {
    this.time = Date.now();
    this.selector = $selector;
    this.elem = document.querySelector($selector);
    this.current = 0;
    this.realCurrent = 0;
    this.oldIndex = 0;
    this.pageLength = 1;
    this.itemLength = 0;
    this.itemLengthOrg = 0;
    this.remainder = 0;
    this.isAllowSlide = false;
    this.rTimer = false;
    this.pagerEvent = [];
    this.orgElement = document.querySelector($selector);
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
      slideCount: slideCount,
      cloneCount: cloneCount,
      threshold: threshold,
      onSliderLoad: onSliderLoad,
      onSlideBefore: onSlideBefore,
      onSlideAfter: onSlideAfter,
      isDebug: isDebug,
    };
    // console.log(this.options, this.options.rootCount);

    this.init();
  }
  init(): void {
    this.initDebug();

    if (this.options.pause < this.options.speed) {
      this.options.speed = this.options.pause - 1;
    }
    this.itemLength = this.itemLengthOrg = this.elem.children.length;

    Object.assign(this.elem.style, {
      display: 'flex',
      flexWrap: 'wrap',
    });

    if (this.itemLength > 1) {
      if (this.options.rootCount) {
        if (this.options.rootCount === 1) this.options.slideCount = 1;
        this.itemWidth = Math.floor(
          (<HTMLElement>this.options.wrapper).clientWidth /
            Number(this.options.rootCount)
        );
      } else {
        // console.log(this.options.wrapper);
        this.options.rootCount = 1;
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
        this.elem.style.width = `${this.itemWidth * this.itemLengthOrg}px`;
        this.pageLength = Math.ceil(
          this.itemLength / Number(this.options.rootCount)
        );
        if (this.options.isLoop) {
          const CLONE_COUNT =
            this.options.cloneCount < 3 ? 3 : this.options.cloneCount;
          for (let i = 1; i < CLONE_COUNT; i++) {
            const COPY = this.elem.innerHTML;
            // this.elem.append(COPY);
            this.elem.insertAdjacentHTML('afterbegin', COPY);
            this.elem.insertAdjacentHTML('beforeend', COPY);
            this.itemLength = this.elem.childElementCount;
            this.elem.style.width = `${this.itemWidth * this.itemLength}px`;
            // w = this.elem.clientWidth;
          }
          this.elem.style.transform = `translateX(-${
            this.itemWidth * this.itemLengthOrg
          }px)`;
          if (this.options.rootCount <= 1) {
            this.realCurrent = this.current + this.pageLength;
          } else {
            this.realCurrent = this.current + this.itemLengthOrg;
          }
        }
        this.remainder = this.getRemainder();
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
                const TARGET_INDEX = (() => {
                  const INDEX = Number(index) * this.options.slideCount;
                  if (
                    INDEX + Number(this.options.rootCount) >
                    this.itemLengthOrg
                  ) {
                    return (
                      this.current +
                      this.getRemainder() -
                      Number(this.options.rootCount)
                    );
                    return this.itemLengthOrg - INDEX;
                  } else {
                    return INDEX;
                  }
                })();
                this.slide(TARGET_INDEX);
              });
            });
        }
      }
    }
    this.isAllowSlide = true;
    this.slide(this.current);
    this.slideAuto();
    if (typeof this.options.onSliderLoad === 'function') {
      this.options.onSliderLoad();
    }
  }
  slide(target?: number | boolean): void {
    clearTimeout(Number(this.rTimer));
    if (!this.isAllowSlide) return;
    if (target === false) return;
    this.isAllowSlide = false;
    this.oldIndex = target !== this.realCurrent ? this.realCurrent : null;
    this.current = Number(target);
    if (this.options.isLoop) {
      if (this.options.rootCount <= 1) {
        this.realCurrent = this.current + this.pageLength;
      } else {
        this.realCurrent = this.current + this.itemLengthOrg;
      }
    } else {
      this.realCurrent = this.current;
    }
    this.remainder = this.getRemainder();
    // console.log(this.current, this.realCurrent);
    if (typeof this.options.onSlideBefore === 'function') {
      this.options.onSlideBefore(this.oldIndex, this.realCurrent);
    }
    anime({
      targets: this.elem,
      translateX: () => {
        if (this.realCurrent > this.oldIndex) {
          return `-=${this.itemWidth * (this.realCurrent - this.oldIndex)}px`;
        } else {
          return `+=${this.itemWidth * (this.oldIndex - this.realCurrent)}px`;
        }
      },
      easing: this.options.easing,
      duration: this.options.duration,
      complete: () => {
        if (this.options.isLoop) {
          if (this.options.rootCount <= 1) {
            if (this.current >= this.pageLength) {
              this.elem.style.transform = `translateX(-${
                this.itemWidth * this.itemLengthOrg
              }px)`;
              this.current = 0;
            } else if (this.current < 0) {
              this.elem.style.transform = `translateX(-${
                this.itemWidth * (this.itemLengthOrg + (this.pageLength - 1))
              }px)`;
              this.current = this.pageLength - 1;
            }
            this.realCurrent = this.current + this.pageLength;
          } else {
            if (this.current > this.pageLength) {
              this.elem.style.transform = `translateX(-${
                this.itemWidth * this.itemLengthOrg
              }px)`;
              this.current = 0;
            } else if (this.current < 0) {
              this.elem.style.transform = `translateX(-${
                this.itemWidth * (this.itemLengthOrg + this.pageLength)
              }px)`;
              this.current = this.itemLengthOrg - 1;
            }
            this.realCurrent = this.current + this.itemLengthOrg;
          }
          this.oldIndex = this.oldIndex - this.pageLength;
        }
        if (this.options.pager) this.togglePager();
        if (this.options.ctrl) this.toggleCtrls();
        Array.from(this.elem.children).forEach((v, i) => {
          v.classList.remove('slide-old', 'slide-active');
        });
        this.elem.children[this.realCurrent].classList.add('slide-active');
        this.elem.children[this.oldIndex + this.pageLength]?.classList.add(
          'slide-old'
        );
        this.isAllowSlide = true;
        if (this.options.isLoop) {
          this.slideAuto();
        } else {
          if (this.current !== this.pageLength - 1) {
            this.slideAuto();
          }
        }
      },
    });
  }
  togglePager(): void {
    this.options.wrapper
      .querySelectorAll('.ss-pager-item a')
      .forEach((value) => {
        value.classList.remove('is-active');
      });
    const TARGET_INDEX = Math.ceil(
      this.current / Number(this.options.rootCount)
    );
    this.options.wrapper
      .querySelectorAll('.ss-pager-item')
      [TARGET_INDEX]?.querySelector('a')
      .classList.add('is-active');
  }
  toggleCtrls(): void {
    if (this.options.isLoop || !this.options.ctrl) return;
    this.prevBtn.classList.remove('is-disabled');
    this.nextBtn.classList.remove('is-disabled');
    if (this.current === 0) this.prevBtn.classList.add('is-disabled');
    if (this.itemLengthOrg - this.current <= this.options.rootCount)
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
      this.slide(this.getNextSlide());
    }, this.options.pause);
  }
  stopAuto(): void {
    clearTimeout(Number(this.rTimer));
    this.options.isAuto = false;
  }
  getNextSlide(): number | boolean {
    if (this.options.isLoop) {
      if (Number(this.options.rootCount) % this.pageLength !== 1) {
        if (this.current + 1 === this.itemLengthOrg - 1) {
          return 0;
        } else {
          return this.current + 1;
        }
      } else {
        return this.current + 1;
      }
    } else {
      if (this.current !== this.itemLength - 1) {
        if (this.remainder - this.options.slideCount < this.options.rootCount) {
          return this.current + (this.remainder - 1 - this.options.slideCount);
        } else {
          return this.current + this.options.slideCount;
        }
      } else {
        return false;
      }
    }
  }
  getPrevSlide(): number | boolean {
    if (this.options.isLoop) {
      if (Number(this.options.rootCount) % this.pageLength !== 1) {
        if (this.current - 1 < 0) {
          return this.pageLength - 1;
        } else {
          return this.current - 1;
        }
      } else {
        return this.current - 1;
      }
    } else {
      if (this.current !== 0) {
        if (this.remainder + this.options.slideCount > this.itemLengthOrg) {
          return 0;
        } else {
          return this.current - this.options.slideCount;
        }
      } else {
        return false;
      }
    }
  }
  getRemainder(): number {
    const REMAINDER = this.itemLengthOrg - this.current;
    return REMAINDER < 0 ? this.itemLengthOrg : REMAINDER;
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
  }
  /**
   * デバッグの準備
   */
  initDebug(): void {
    if (!this.options.isDebug) return;
    const SS_DEBUG = document.createElement('div');
    SS_DEBUG.id = `ssDebug_${Date.now()}`;
    Object.assign(SS_DEBUG.style, {
      position: 'fixed',
      zIndex: 99999,
      top: 0,
      right: 0,
      backgroundColor: 'rgba(200,0,0,0.8)',
      color: '#fff',
      padding: '1vw',
      width: '30vw',
      height: '100%',
      overflow: 'auto',
    });

    document.body.appendChild(SS_DEBUG);
    SS_DEBUG.innerHTML =
      '<div><a href="javascript:void(0)" class="toggle" style="color: #FFFFFF;">HIDE</a></div><div class="inner" />';

    const ELEM = {
      toggle: SS_DEBUG.querySelector<HTMLElement>('.toggle'),
      inner: SS_DEBUG.querySelector<HTMLElement>('.inner'),
    };
    ELEM.toggle.addEventListener('click', () => {
      if (ELEM.inner.style.display !== 'none') {
        ELEM.inner.style.display = 'none';
        SS_DEBUG.style.height = 'auto';
        ELEM.toggle.textContent = 'SHOW';
      } else {
        ELEM.inner.style.display = 'block';
        SS_DEBUG.style.height = '100%';
        ELEM.toggle.textContent = 'HIDE';
      }
    });

    this.showDebug(SS_DEBUG.id);
  }
  /**
   * デバッグ情報の出力
   */
  showDebug(id: string): void {
    let src = '';

    for (let key in this) {
      if (typeof this[key] === 'function') continue;
      if (key !== 'options') {
        src += `<div><span style="font-weight: bold;">${key}</span> : ${this[key]}</div>`;
      } else {
        src += 'options : ';
        for (let k in this[key]) {
          src += `<div style="padding-left: 1em"><span style="font-weight: bold;">${k}</span> : ${this[key][k]}</div>`;
        }
      }
    }

    document.querySelector(`#${id} .inner`).innerHTML = src;
    // document.querySelector('#ssDebug .inner').insertAdjacentHTML('afterbegin', src);
    this.runDebugAuto(id);
  }
  runDebugAuto(id: string): void {
    this.debugTimer = window.setTimeout(() => {
      this.showDebug(id);
    }, 500);
  }
}
