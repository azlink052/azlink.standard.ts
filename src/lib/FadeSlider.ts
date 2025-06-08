import { SimpleSlider } from './SimpleSlider';
/**
 * シンプルなフェードスライダ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2025.06.08
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
export class FadeSlider extends SimpleSlider {
  public fadeOptions: Options;

  constructor(
    $selector: string,
    {
      isAuto = true,
      isLoop = true,
      isChangeOpacity = true,
      pause = 5000,
      speed = 500,
      easing = 'cubicBezier(0.25, 1, 0.75, 1)',
      ctrl = false,
      pager = false,
      wrapper = document.querySelector($selector).parentNode,
      activeIndexInt = 52,
      oldIndexInt = 51,
      etcIndexInt = 50,
      onSliderLoad = false,
      onSlideBefore = false,
      onSlideAfter = false,
    }: Partial<Options> = {}
  ) {
    super($selector, {
      mode: 'fade',
      isAuto,
      isLoop,
      isChangeOpacity,
      pause,
      speed,
      easing,
      ctrl,
      pager,
      wrapper,
      activeIndexInt,
      oldIndexInt,
      etcIndexInt,
      onSliderLoad,
      onSlideBefore,
      onSlideAfter,
    });

    this.fadeOptions = {
      isAuto,
      isLoop,
      isChangeOpacity,
      pause,
      speed,
      easing,
      ctrl,
      pager,
      wrapper,
      activeIndexInt,
      oldIndexInt,
      etcIndexInt,
      onSliderLoad,
      onSlideBefore,
      onSlideAfter,
    };
  }
}
