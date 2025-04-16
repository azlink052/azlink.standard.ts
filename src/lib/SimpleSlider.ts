import anime from 'animejs/lib/anime.es';
/**
 * シンプルなカルーセルスライダ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2025.04.16
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
  spaceBetween: number;
  ctrl: boolean;
  pager: boolean;
  nextEl: string;
  prevEl: string;
  pagerEl: string;
  wrapper: HTMLElement | ParentNode;
  wrapperHeight: number | null;
  rootCount: number;
  slideCount: number;
  cloneCount: number;
  threshold: number;
  isResizeAuto: boolean;
  mode: string;
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
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private pager: HTMLElement;
  private itemWidth: number;
  private itemHeight: number;
  private itemLength: number;
  private itemLengthOrg: number;
  private current: number;
  private realCurrent: number;
  private oldIndex: number;
  private remainder: number;
  private pageLength: number;
  private isAllowSlide: boolean;
  private rTimer: number | boolean;
  private startX: number;
  private moveX: number;
  private startY: number;
  private moveY: number;
  private orgElement: Element | boolean;
  private debugTimer: number | boolean;
  private isHover: boolean;
  private rsTimer: number | boolean;

  constructor(
    $selector: string,
    {
      isAuto = true,
      isLoop = true,
      pause = 5000,
      speed = 500,
      easing = 'cubicBezier(0.33, 1, 0.68, 1)',
      spaceBetween = 0,
      ctrl = false,
      pager = false,
      nextEl = '',
      prevEl = '',
      pagerEl = '',
      wrapper = document.querySelector($selector).parentNode,
      wrapperHeight = null,
      rootCount = 0, // 1ページに表示する量
      slideCount = 1, // 1度に動かす量 ※isLoopがtrueで1以外の場合rootCountと同じになる
      cloneCount = 1,
      threshold = 30,
      isResizeAuto = false,
      mode = 'horizontal', // !vertical を指定する場合は wrapper の高さ指定が必須
      onSliderLoad = false, // this
      onSlideBefore = false, // this.current this.realCurrent
      onSlideAfter = false, // this.current this.realCurrent
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
    this.orgElement = document.querySelector($selector);
    this.isHover = false;
    this.rsTimer = false;
    this.options = {
      isAuto: isAuto,
      isLoop: isLoop,
      pause: pause,
      speed: speed,
      easing: easing,
      spaceBetween: spaceBetween,
      ctrl: ctrl,
      pager: pager,
      nextEl: nextEl,
      prevEl: prevEl,
      pagerEl: pagerEl,
      wrapper: wrapper,
      wrapperHeight: wrapperHeight,
      rootCount: rootCount,
      slideCount: slideCount,
      cloneCount: cloneCount,
      threshold: threshold,
      isResizeAuto: isResizeAuto,
      mode: mode,
      onSliderLoad: onSliderLoad,
      onSlideBefore: onSlideBefore,
      onSlideAfter: onSlideAfter,
      isDebug: isDebug,
    };
    // console.log(this.options, this.options.rootCount);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrev = this.gotoPrev.bind(this);
    this.gotoPage = this.gotoPage.bind(this);
    this.stopAuto = this.stopAuto.bind(this);

    this.init();
  }
  init(): void {
    this.initDebug();

    // if (!this.options.isAuto) {
    //   this.options.pause = 0;
    // }
    // if (this.options.pause < this.options.speed) {
    //   this.options.speed = this.options.pause - 1;
    // }
    this.itemLength = this.itemLengthOrg = this.elem.children.length;

    // console.log(this.options.rootCount, this.itemLength);
    if (this.itemLength <= this.options.rootCount) {
      this.elem.classList.add('is-noSlider');
      return;
    }

    Object.assign(this.elem.style, {
      display: 'flex',
      flexWrap: 'nowrap',
      flexDirection: this.options.mode === 'vertical' ? 'column' : 'row',
    });

    if (this.itemLength > 1) {
      if (this.options.rootCount) {
        if (this.options.rootCount === 1) this.options.slideCount = 1;
        if (this.options.mode === 'vertical') {
          this.elem.outerHTML = `<div class="sliderContainer">${this.elem.outerHTML}</div>`;
          this.elem = document.querySelector(this.selector);
          this.container = this.elem.closest('.sliderContainer');
          Object.assign(this.container.style, {
            overflow: 'hidden',
            height: `${this.options.wrapperHeight}px`,
          });
          this.itemHeight = Math.floor(
            this.container.clientHeight / Number(this.options.rootCount)
          );
          if (this.options.spaceBetween)
            this.itemHeight +=
              this.options.spaceBetween / Number(this.options.rootCount);
        } else {
          this.itemWidth =
            Math.floor(
              (<HTMLElement>this.options.wrapper).clientWidth /
                Number(this.options.rootCount)
            ) + this.options.spaceBetween;
        }
      } else {
        // console.log(this.options.wrapper);
        this.options.rootCount = 1 as number;
        if (this.options.mode === 'vertical') {
          this.elem.outerHTML = `<div class="sliderContainer">${this.elem.outerHTML}</div>`;
          this.elem = document.querySelector(this.selector);
          this.container = this.elem.closest('.sliderContainer');
          this.container.style.height = `${this.options.wrapperHeight}px`;
          this.itemHeight = (<HTMLElement>this.options.wrapper).clientHeight;
        } else {
          this.itemWidth =
            (<HTMLElement>this.options.wrapper).clientWidth +
            this.options.spaceBetween;
        }
      }
      if (this.options.isLoop) {
        if (this.options.slideCount !== 1) {
          this.options.slideCount = Number(this.options.rootCount);
        }
      }
      Array.from(this.elem.children).forEach((v: HTMLElement) => {
        if (this.options.mode === 'vertical') {
          v.style.height = `${this.itemHeight}px`;
          v.style.marginBottom = `${this.options.spaceBetween}px`;
        } else {
          v.style.width = `${this.itemWidth}px`;
          v.style.marginRight = `${this.options.spaceBetween}px`;
        }
        v.classList.add('slide-item');
      });
      // console.log(this.options.rootCount, this.itemLength, this.itemWidth);
      if (this.itemLength > this.options.rootCount) {
        if (this.options.mode !== 'vertical') {
          this.elem.outerHTML = `<div class="sliderContainer">${this.elem.outerHTML}</div>`;
          this.elem = document.querySelector(this.selector);
          this.container = this.elem.closest('.sliderContainer');
          // console.log(this.container);
          Object.assign(this.container.style, {
            overflow: 'hidden',
          });
        }
        if (this.options.mode === 'vertical') {
          this.elem.style.height = `${this.itemHeight * this.itemLengthOrg}px`;
        } else {
          this.elem.style.width = `${this.itemWidth * this.itemLengthOrg}px`;
        }
        this.pageLength =
          this.options.slideCount !== 1
            ? Math.ceil(this.itemLength / Number(this.options.rootCount))
            : this.itemLength;
        if (this.options.isLoop) {
          const items = Array.from(
            this.elem.querySelectorAll('.slide-item')
          ).map((v) => v.cloneNode(true) as HTMLElement);
          items.forEach((v: HTMLElement) => v.classList.add('slide-clone'));
          // console.log(items);
          for (let i = 0; i < this.options.cloneCount; i++) {
            const fragment1 = document.createDocumentFragment();
            items.forEach((v) => fragment1.append(v.cloneNode(true))); // クローンを Fragment に追加
            this.elem.prepend(fragment1);
            const fragment2 = document.createDocumentFragment();
            items.forEach((v) => fragment2.append(v.cloneNode(true))); // 再びクローンを Fragment に追加
            this.elem.append(fragment2);
            this.itemLength = this.elem.childElementCount;
            if (this.options.mode === 'vertical') {
              this.elem.style.height = `${this.itemHeight * this.itemLength}px`;
            } else {
              this.elem.style.width = `${this.itemWidth * this.itemLength}px`;
            }
            // w = this.elem.clientWidth;
          }
          // console.log(this.elem.children.length);
          if (this.options.mode === 'vertical') {
            this.elem.style.transform = `translateY(-${
              this.itemHeight * this.itemLengthOrg
            }px)`;
          } else {
            this.elem.style.transform = `translateX(-${
              this.itemWidth * this.itemLengthOrg
            }px)`;
          }
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
                <button type="button" class="ss-prev" aria-label="前のスライドへ">Prev</button>
                <button type="button" class="ss-next" aria-label="次のスライドへ">Next</button>
              `
            );
          this.prevBtn = this.options.wrapper.querySelector('.ss-prev');
          this.nextBtn = this.options.wrapper.querySelector('.ss-next');
          this.prevBtn.addEventListener('click', this.gotoPrev, false);
          this.nextBtn.addEventListener('click', this.gotoNext, false);
        } else {
          if (
            this.options.nextEl &&
            document.querySelector(this.options.nextEl)
          ) {
            this.nextBtn = document.querySelector(this.options.nextEl);
            this.nextBtn.addEventListener('click', this.gotoNext, false);
          }
          if (
            this.options.prevEl &&
            document.querySelector(this.options.prevEl)
          ) {
            this.prevBtn = document.querySelector(this.options.prevEl);
            this.prevBtn.addEventListener('click', this.gotoPrev, false);
          }
        }
        if (this.options.pager) {
          (<HTMLElement>this.options.wrapper).insertAdjacentHTML(
            'beforeend',
            '<div class="ss-pager" />'
          );
          this.pager = this.options.wrapper.querySelector('.ss-pager');
          // console.log(this.pageLength);
        } else {
          if (document.querySelector(this.options.pagerEl)) {
            // console.log(this.pageLength);
            this.pager = document.querySelector(this.options.pagerEl);
          }
        }
        if (this.pager) {
          for (let i = 0; i < this.pageLength; i++) {
            this.pager.insertAdjacentHTML(
              'beforeend',
              `
                <div class="ss-pager-item"><button data-index="${i}" aria-label="${
                i + 1
              }のスライドへ">${i + 1}</button></div>`
            );
          }
          this.pager
            .querySelectorAll('.ss-pager-item')
            [this.current]?.querySelector('button')
            .classList.add('is-active');
          this.pager
            .querySelectorAll('.ss-pager-item button')
            .forEach((v, i) => {
              v.addEventListener('click', this.gotoPage, false);
            });
        }
        // スワイプ処理
        this.elem.addEventListener('touchmove', (e) => {
          e.preventDefault();
          this.moveX = e.changedTouches[0].pageX;
          this.moveY = e.changedTouches[0].pageY;
        });
        this.elem.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.startX = e.touches[0].pageX;
          this.moveX = 0;
          this.startY = e.touches[0].pageY;
          this.moveY = 0;
        });
        this.elem.addEventListener('touchend', (e) => {
          e.preventDefault();
          // console.log(`startX: ${this.startX}, moveX: ${this.moveX}`);
          if (this.options.mode === 'vertical') {
            if (this.moveY === 0) {
              (<HTMLAnchorElement>e.target)?.click();
            } else {
              if (this.startY + this.options.threshold < this.moveY) {
                // 右向き
                // console.log('→');
                if (!this.isAllowSlide) return;
                if (!this.options.isLoop && this.current <= 0) return;
                this.slide(this.getPrevSlide());
              }
              if (this.startY > this.moveY + this.options.threshold) {
                // 左向き
                // console.log('←');
                if (!this.isAllowSlide) return;
                if (
                  !this.options.isLoop &&
                  this.remainder <= this.options.rootCount
                )
                  return;
                this.slide(this.getNextSlide());
              }
            }
          } else {
            if (this.moveX === 0) {
              (<HTMLAnchorElement>e.target)?.click();
            } else {
              if (this.startX + this.options.threshold < this.moveX) {
                // 右向き
                // console.log('→');
                if (!this.isAllowSlide) return;
                if (!this.options.isLoop && this.current <= 0) return;
                this.slide(this.getPrevSlide());
              }
              if (this.startX > this.moveX + this.options.threshold) {
                // 左向き
                // console.log('←');
                if (!this.isAllowSlide) return;
                if (
                  !this.options.isLoop &&
                  this.remainder <= this.options.rootCount
                )
                  return;
                this.slide(this.getNextSlide());
              }
            }
          }
        });
      }
    }
    this.options.wrapper.addEventListener(
      'mouseover',
      (e) => (this.isHover = true)
    );
    this.options.wrapper.addEventListener(
      'mouseout',
      (e) => (this.isHover = false)
    );
    this.isAllowSlide = true;
    this.slide(this.current);
    this.slideAuto();
    if (typeof this.options.onSliderLoad === 'function') {
      this.options.onSliderLoad(this);
    }

    if (this.options.isResizeAuto) {
      window.addEventListener('resize', () => {
        if (this.rsTimer !== false) {
          clearTimeout(Number(this.rsTimer));
          this.rsTimer = false;
        }
        this.rsTimer = window.setTimeout(() => {
          this.destroy();
          this.init();
        }, 500);
      });
    }
  }
  slide(target?: number | boolean): void {
    // console.log(target);
    clearTimeout(Number(this.rTimer));
    if (!this.isAllowSlide) return;
    if (target === false) return;
    this.isAllowSlide = false;
    if (typeof this.options.onSlideBefore === 'function') {
      this.options.onSlideBefore(this.current, this.realCurrent);
    }
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
    const completeAction = () => {
      if (this.pager) this.togglePager();
      if (this.prevBtn && this.nextBtn) this.toggleCtrls();
      Array.from(this.elem.children).forEach((v, i) => {
        v.classList.remove('slide-old', 'slide-active');
      });
      this.elem.children[this.realCurrent]?.classList.add('slide-active');
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
    };
    if (this.options.mode === 'vertical') {
      anime({
        targets: this.elem,
        translateY: () => {
          if (this.realCurrent > this.oldIndex) {
            return `-=${
              this.itemHeight * (this.realCurrent - this.oldIndex)
            }px`;
          } else {
            return `+=${
              this.itemHeight * (this.oldIndex - this.realCurrent)
            }px`;
          }
        },
        easing: this.options.easing,
        duration: this.options.speed,
        complete: () => {
          if (this.options.isLoop) {
            if (this.options.rootCount <= 1) {
              if (this.current >= this.pageLength) {
                this.elem.style.transform = `translateY(-${
                  this.itemHeight * this.itemLengthOrg
                }px)`;
                this.current = 0;
              } else if (this.current < 0) {
                this.elem.style.transform = `translateY(-${
                  this.itemHeight * (this.itemLengthOrg + (this.pageLength - 1))
                }px)`;
                this.current = this.pageLength - 1;
              }
              this.realCurrent = this.current + this.pageLength;
            } else {
              if (this.current > this.itemLengthOrg - 1) {
                this.elem.style.transform = `translateY(-${
                  this.itemHeight * this.itemLengthOrg
                }px)`;
                this.current = 0;
              } else if (this.current < 0) {
                if (this.options.rootCount === 1) {
                  this.elem.style.transform = `translateY(-${
                    this.itemHeight * (this.itemLengthOrg + this.pageLength)
                  }px)`;
                  this.current =
                    this.itemLengthOrg - Number(this.options.rootCount);
                } else {
                  this.elem.style.transform = `translateY(-${
                    this.itemHeight * (this.itemLengthOrg + this.pageLength - 1)
                  }px)`;
                  this.current = this.itemLengthOrg - 1;
                }
              }
              this.realCurrent = this.current + this.itemLengthOrg;
            }
            this.oldIndex = this.oldIndex - this.pageLength;
          }
          // console.log(this.current, this.realCurrent);
          if (typeof this.options.onSlideAfter === 'function') {
            this.options.onSlideAfter(this.current, this.realCurrent);
          }
          completeAction();
        },
      });
    } else {
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
        duration: this.options.speed,
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
              if (this.current > this.itemLengthOrg - 1) {
                this.elem.style.transform = `translateX(-${
                  this.itemWidth * this.itemLengthOrg
                }px)`;
                this.current = 0;
              } else if (this.current < 0) {
                if (this.options.rootCount === 1) {
                  this.elem.style.transform = `translateX(-${
                    this.itemWidth * (this.itemLengthOrg + this.pageLength)
                  }px)`;
                } else {
                  this.elem.style.transform = `translateX(-${
                    this.itemWidth *
                    (this.itemLengthOrg +
                      this.pageLength * Number(this.options.rootCount) -
                      Number(this.options.rootCount))
                  }px)`;
                }
                this.current =
                  this.itemLengthOrg - Number(this.options.rootCount);
              }
              this.realCurrent = this.current + this.itemLengthOrg;
            }
            this.oldIndex = this.oldIndex - this.pageLength;
          }
          // console.log(this.current, this.realCurrent);
          if (typeof this.options.onSlideAfter === 'function') {
            this.options.onSlideAfter(this.current, this.realCurrent);
          }
          completeAction();
        },
      });
    }
  }
  togglePager(): void {
    // console.log(this.pager);
    this.pager.querySelectorAll('.ss-pager-item button').forEach((value) => {
      value.classList.remove('is-active');
    });
    const targetIndex =
      this.options.slideCount !== 1
        ? Math.ceil(this.current / Number(this.options.rootCount))
        : this.current;
    // console.log(targetIndex, this.current, this.options.rootCount);
    this.pager
      .querySelectorAll('.ss-pager-item')
      [targetIndex]?.querySelector('button')
      .classList.add('is-active');
  }
  toggleCtrls(): void {
    if (this.options.isLoop) return;
    this.prevBtn.classList.remove('is-disabled');
    this.nextBtn.classList.remove('is-disabled');
    this.prevBtn.disabled = false;
    this.nextBtn.disabled = false;
    if (this.current === 0) {
      this.prevBtn.classList.add('is-disabled');
      this.prevBtn.disabled = true;
    }
    if (this.itemLengthOrg - this.current <= this.options.rootCount) {
      this.nextBtn.classList.add('is-disabled');
      this.nextBtn.disabled = true;
    }
  }
  slideAuto(): void {
    if (!this.isAllowSlide || !this.options.isAuto) return;
    this.startSlideAuto();
  }
  startSlideAuto(): void {
    this.isAllowSlide = this.options.isAuto = true;
    // console.log('slideAuto');
    this.rTimer = window.setTimeout(() => {
      if (!this.isHover) this.slide(this.getNextSlide());
    }, this.options.pause);
    // console.log(this.rTimer);
  }
  stopAuto(): void {
    clearTimeout(Number(this.rTimer));
    this.options.isAuto = this.rTimer = false;
  }
  getNextSlide(): number | boolean {
    if (this.options.isLoop) {
      if (this.itemLengthOrg % Number(this.options.rootCount)) {
        if (this.current !== 0 && this.remainder <= this.options.rootCount) {
          return 0;
        } else {
          return this.current + this.options.slideCount;
        }
      } else {
        return this.current + this.options.slideCount;
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
      if (this.itemLengthOrg % Number(this.options.rootCount)) {
        if (this.remainder === this.itemLengthOrg) {
          const r = Math.floor(
            this.itemLengthOrg % Number(this.options.rootCount)
          );
          // const p = Math.floor(
          //   this.itemLengthOrg / Number(this.options.rootCount)
          // );
          // console.log(p * Number(this.options.rootCount));

          // console.log(
          //   (this.pageLength - 1) * Number(this.options.rootCount) + r
          // );
          // console.log(this.itemLengthOrg - r);
          // return r;
          return this.itemLengthOrg - r;
        } else {
          return this.current - this.options.slideCount;
        }
      } else {
        return this.current - this.options.slideCount;
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
    const remainder = this.itemLengthOrg - this.current;
    return remainder < 0 ? this.itemLengthOrg : remainder;
  }
  gotoPrev(e: Event): void {
    if (!this.isAllowSlide) return;
    if ((<HTMLElement>e.target).classList.contains('is-disabled')) return;
    this.slide(this.getPrevSlide());
  }
  gotoNext(e: Event): void {
    if (!this.isAllowSlide) return;
    if ((<HTMLElement>e.target).classList.contains('is-disabled')) return;
    this.slide(this.getNextSlide());
  }
  gotoPage(e: Event): void {
    if (!this.isAllowSlide) return;
    if ((<HTMLElement>e.target).classList.contains('is-active')) return;
    const i = (<HTMLElement>e.target).getAttribute('data-index');
    const targetIndex = (() => {
      const index = Number(i) * this.options.slideCount;
      if (this.options.isLoop) {
        return index;
      } else {
        if (index + Number(this.options.rootCount) > this.itemLengthOrg) {
          return (
            this.current + this.getRemainder() - Number(this.options.rootCount)
          );
          // return this.itemLengthOrg - index;
        } else {
          return index;
        }
      }
    })();
    this.slide(targetIndex);
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
    this.stopAuto();
    this.slide(0);
    this.options.wrapper.querySelector('.ss-ctrls')?.remove();
    this.options.wrapper.querySelector('.ss-pager')?.remove();
    this.prevBtn.removeEventListener('click', this.gotoPrev);
    this.nextBtn.removeEventListener('click', this.gotoNext);
    this.options.wrapper
      .querySelectorAll('.ss-pager-item button')
      .forEach((v, i) => v.removeEventListener('click', this.gotoPage));
    this.pager.querySelectorAll('.ss-pager-item').forEach((v) => v.remove());
    this.elem.querySelectorAll('.slide-clone').forEach((v) => v.remove());
    this.elem.removeAttribute('style');
    Array.from(this.elem.children).forEach((v: HTMLElement) => {
      v.removeAttribute('style');
      v.classList.remove('slide-item', 'slide-old', 'slide-active');
    });
    if (this.container) {
      const parent = this.container.parentNode;
      while (this.container.firstChild) {
        parent.insertBefore(this.container.firstChild, this.container);
      }
      this.container.remove();
    }
  }
  /**
   * デバッグの準備
   */
  initDebug(): void {
    if (!this.options.isDebug) return;
    if (document.querySelector('.azlib_ssDebug')) return;
    const ssDebug = document.createElement('div');
    ssDebug.id = `ssDebug_${Date.now()}`;
    ssDebug.classList.add('azlib_ssDebug');
    Object.assign(ssDebug.style, {
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

    document.body.appendChild(ssDebug);
    ssDebug.innerHTML =
      '<div><button class="toggle" style="color: #FFFFFF;">HIDE</button></div><div class="inner" />';

    const elem = {
      toggle: ssDebug.querySelector<HTMLElement>('.toggle'),
      inner: ssDebug.querySelector<HTMLElement>('.inner'),
    };
    elem.toggle.addEventListener('click', () => {
      if (elem.inner.style.display !== 'none') {
        elem.inner.style.display = 'none';
        ssDebug.style.height = 'auto';
        elem.toggle.textContent = 'SHOW';
      } else {
        elem.inner.style.display = 'block';
        ssDebug.style.height = '100%';
        elem.toggle.textContent = 'HIDE';
      }
    });

    this.showDebug(ssDebug.id);
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
