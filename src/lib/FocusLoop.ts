import { Utilities } from './Utilities';

/**
 * 指定要素内でfocusをloopさせる
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2024.04.04
 *
 * @param {*} $selector
 * @param {*} $options
 * @returns
 */
interface Options {
  focusLoopElems: string[];
}
export class FocusLoop {
  public isRun: boolean;
  private wrapper: HTMLElement | Element;
  private options: Options;

  constructor(
    $selector: string,
    {
      focusLoopElems = [
        'a',
        'area',
        'button',
        // 'iframe',
        'input',
        'object',
        'select',
        'textarea',
      ], // focusLoopさせる際の要素名
    }: Partial<Options> = {}
  ) {
    this.isRun = false;
    this.wrapper = document.querySelector($selector);

    this.options = {
      focusLoopElems: focusLoopElems,
    };

    this.init();
  }
  init() {
    if (!this.options.focusLoopElems.length) return;

    document.addEventListener('keydown', (e) => {
      if (!this.isRun) return;
      const elements = (() => {
        return Array.from(
          this.wrapper.querySelectorAll(this.options.focusLoopElems.join(','))
        ).filter((item: any) => item.checkVisibility());
      })();

      const activeElem = document.activeElement;
      const firstElem = elements[0];
      const lastElem = elements[elements.length - 1];
      const isTabKey = 9 === e.keyCode;
      const isShiftKey = e.shiftKey;
      if (!isShiftKey && isTabKey && lastElem === activeElem) {
        e.preventDefault();
        (<HTMLElement>firstElem).focus();
      }
      if (isShiftKey && isTabKey && firstElem === activeElem) {
        e.preventDefault();
        (<HTMLElement>lastElem).focus();
      }
    });
  }
}
