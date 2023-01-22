class Sample1JS {
  constructor() {
    this.rTimer = false;
    this.isFirst = true;
  }
  init() {
    console.log(util);
    window.addEventListener('resize', () => {
      if (this.rTimer !== false) {
        clearTimeout(this.rTimer);
      }

      this.rTimer = setTimeout(() => {
        this.adjust();
        if (util.isChangeMode) {
          location.reload();
          // this.adjust();
        }
      }, 500);
    });
    this.adjust();
  }
  adjust() {}
  runIntro() {
    this.isFirst = false;

    Object.assign(document.getElementById('wrapper').style, {
      visibility: 'visible',
      opacity: 0,
    });
    new azlib.anime({
      targets: '#wrapper',
      opacity: 1,
      duration: 500,
    });
  }
}
/**
 * インスタンス化
 */
const util = new azlib.Utilities({
  spBreakPoint: 991,
  isDebug: true,
});
const contentJS = new ContentJS();
const sample1JS = new Sample1JS();
/**
 * 実行
 */
document.addEventListener('DOMContentLoaded', () => {
  util.init();
  contentJS.init();
  sample1JS.init();
});
