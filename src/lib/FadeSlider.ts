import anime from 'animejs/lib/anime.es';
/**
 * シンプルなフェードスライダ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2023.06.25
 *
 * @param {*} $selector
 * @param {*} $options
 */
interface Options {
  isAuto: boolean;
  isLoop: boolean;
  isChangeOpacity: boolean;
  pause: number;
  speed: number;
  easing: string;
  ctrl: boolean;
  pager: boolean;
  wrapper: HTMLElement | ParentNode;
  activeIndexInt: number;
  oldIndexInt: number;
  etcIndexInt: number;
  onSliderLoad: any;
  onSlideBefore: any;
  onSlideAfter: any;
}
export class FadeSlider {
  private time: number;
  public options: Options;
  private elem: HTMLElement;
  private current: number;
  private count: number;
  private isAllowSlide: boolean;
  private rTimer: number | boolean;
  private pagerEvent: string[];
  private length: number;

  constructor(
    $selector: string,
    {
      isAuto = true,
      isLoop = true,
      isChangeOpacity = true,
      pause = 5000,
      speed = 500,
      easing = 'cubicBezier(0.33, 1, 0.68, 1)',
      ctrl = false,
      pager = false,
      wrapper = document.querySelector($selector).parentNode,
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
      isChangeOpacity: isChangeOpacity,
      pause: pause,
      speed: speed,
      easing: easing,
      ctrl: ctrl,
      pager: pager,
      wrapper: wrapper,
      activeIndexInt: activeIndexInt,
      oldIndexInt: oldIndexInt,
      etcIndexInt: etcIndexInt,
      onSliderLoad: onSliderLoad,
      onSlideBefore: onSlideBefore,
      onSlideAfter: onSlideAfter,
    };

    this.init();
  }
  init(): void {
    // console.log(this)
    if (this.options.pause < this.options.speed) {
      this.options.speed = this.options.pause - 1;
    }
    this.count = this.elem.children.length;
    this.elem.style.position = 'relative';

    Array.from(this.elem.children).forEach((v: HTMLElement, i: number) => {
      Object.assign(v.style, {
        // opacity: this.options.isChangeOpacity ? 0 : 1,
        zIndex: this.options.etcIndexInt,
        position: 'absolute',
        left: 0,
        top: 0,
      });
      if (this.options.isChangeOpacity) v.style.opacity = '0';
      // console.log(i, this.current);
      if (i === this.current) {
        Object.assign(v.style, {
          // opacity: this.options.isChangeOpacity ? 1 : 1,
          zIndex: this.options.activeIndexInt,
        });
        if (this.options.isChangeOpacity) v.style.opacity = '1';
      }
    });

    if (this.options.ctrl) {
      (<HTMLElement>this.options.wrapper).insertAdjacentHTML(
        'beforeend',
        `
        <div class="fs-ctrls">
          <div class="fs-ctrls-direction" />
        </div>
      `
      );
      this.options.wrapper
        .querySelector('.fs-ctrls-direction')
        .insertAdjacentHTML(
          'beforeend',
          `
            <button class="fs-prev" aria-label="前のスライドへ">Prev</button>
            <button class="fs-next" aria-label="次のスライドへ">Next</button>
          `
        );
      this.pagerEvent['prev'] = this.options.wrapper
        .querySelector('.fs-prev')
        .addEventListener('click', (e) => {
          if (!this.isAllowSlide) return;
          this.change(this.getPrevSlide());
        });
      this.pagerEvent['next'] = this.options.wrapper
        .querySelector('.fs-next')
        .addEventListener('click', (e) => {
          if (!this.isAllowSlide) return;
          this.change(this.getNextSlide());
        });
    }

    if (this.options.pager) {
      (<HTMLElement>this.options.wrapper).insertAdjacentHTML(
        'beforeend',
        '<div class="fs-pager" />'
      );
      for (let i = 0; i < this.count; i++) {
        this.options.wrapper.querySelector('.fs-pager').insertAdjacentHTML(
          'beforeend',
          `
          <div class="fs-pager-item">
            <button data-index="${i}" aria-label="${i + 1}のスライドへ">${
            i + 1
          }</button>
          </div>
        `
        );
      }
      this.options.wrapper
        .querySelectorAll('.fs-pager-item')
        [this.current]?.querySelector('button')
        .classList.add('is-active');
      this.pagerEvent['pager'] = this.options.wrapper
        .querySelectorAll('.fs-pager-item button')
        .forEach((v, i) => {
          v.addEventListener('click', (e) => {
            if (!this.isAllowSlide) return;
            const index = (<HTMLElement>e.target).getAttribute('data-index'); // 文字列変換

            this.change(Number(index));
          });
        });
    }
    this.isAllowSlide = true;
    this.slideAuto();
    if (typeof this.options.onSliderLoad === 'function') {
      this.options.onSliderLoad();
    }
  }
  change(target?: number | boolean): void {
    clearTimeout(Number(this.rTimer));
    if (!this.isAllowSlide) return;
    if (target === false) return;
    this.isAllowSlide = false;
    const oldIndex = this.current;
    const newIndex =
      Number(target) >= 0
        ? Number(target)
        : this.current !== this.count - 1
        ? this.current + 1
        : 0;
    this.current = newIndex === this.count ? 0 : newIndex;
    if (typeof this.options.onSlideBefore === 'function') {
      this.options.onSlideBefore(oldIndex, newIndex);
    }
    if (this.options.pager) this.togglePager();
    Array.from(this.elem.children).forEach((v, i) => {
      v.classList.remove('slide-old', 'slide-active');
    });
    // console.log(oldIndex, newIndex)
    Array.from(this.elem.children).forEach((v, i) => {
      (<HTMLElement>v).style.zIndex = String(this.options.etcIndexInt);
    });
    Array.from(this.elem.children).forEach((v, i) => {
      if (i === oldIndex) {
        (<HTMLElement>v).style.zIndex = String(this.options.oldIndexInt);
        v.classList.add('slide-old');
      }
    });
    Array.from(this.elem.children).forEach((v: HTMLElement, i: number) => {
      if (i === this.current) {
        v.style.zIndex = String(this.options.activeIndexInt);
        v.classList.add('slide-active');
        if (this.options.isChangeOpacity) {
          anime({
            targets: v,
            opacity: 1,
            duration: this.options.speed,
            easing: this.options.easing,
            complete: () => {
              if (typeof this.options.onSlideAfter === 'function') {
                this.options.onSlideAfter(oldIndex, this.current);
              }
              Array.from(this.elem.children).forEach(
                (v: HTMLElement, i: number) => {
                  if (i !== this.current) {
                    v.style.opacity = '0';
                  }
                }
              );
              this.isAllowSlide = true;
              if (this.options.isLoop) {
                this.slideAuto();
              } else {
                if (this.current !== this.count - 1) {
                  this.slideAuto();
                }
              }
            },
          });
        } else {
          anime({
            targets: v,
            duration: this.options.speed,
            easing: this.options.easing,
            complete: () => {
              if (typeof this.options.onSlideAfter === 'function') {
                this.options.onSlideAfter(oldIndex, this.current);
              }
              this.isAllowSlide = true;
              if (this.options.isLoop) {
                this.slideAuto();
              } else {
                if (this.current !== this.count - 1) {
                  this.slideAuto();
                }
              }
            },
          });
        }
      }
    });
  }
  togglePager(): void {
    this.options.wrapper
      .querySelectorAll('.fs-pager-item button')
      .forEach((value) => {
        value.classList.remove('is-active');
      });
    this.options.wrapper
      .querySelectorAll('.fs-pager-item')
      [this.current]?.querySelector('button')
      .classList.add('is-active');
  }
  slideAuto(): void {
    if (!this.isAllowSlide || !this.options.isAuto) return;
    this.startSlideAuto();
  }
  startSlideAuto(): void {
    this.isAllowSlide = this.options.isAuto = true;
    // console.log('slideAuto');
    this.rTimer = window.setTimeout(() => {
      this.change();
    }, this.options.pause);
  }
  stopAuto(): void {
    clearTimeout(Number(this.rTimer));
    this.options.isAuto = false;
  }
  getNextSlide(): number | boolean {
    if (this.options.isLoop) {
      return this.current === this.count - 1 ? 0 : this.current + 1;
    } else {
      if (this.current !== this.count - 1) {
        return this.current + 1;
      } else {
        return false;
      }
    }
  }
  getPrevSlide(): number | boolean {
    if (this.options.isLoop) {
      return this.current === 0 ? this.count - 1 : this.current - 1;
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
    this.current = this.count - 1;
    this.change(0);
  }
  destroy(): void {
    clearTimeout(Number(this.rTimer));
    for (const event of this.pagerEvent) {
      document.removeEventListener('click', this.pagerEvent[event]);
    }
    this.options.wrapper.querySelector('.fs-ctrls').remove();
    this.options.wrapper.querySelector('.fs-pager').remove();
    this.length = 0;
  }
}
