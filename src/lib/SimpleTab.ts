/**
 * A11y対応のシンプルなタブ
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2024.08.12
 *
 * @param {*} $selector
 * @param {*} $options
 */
interface Options {
  // isAddAriaLabel: boolean;
  activeClassName: string;
  current: number;
  isAdjustHeight: boolean;
  heightPlus: number;
  onComplete: any;
}
interface TabParam {
  wrap: HTMLElement;
  tabs: HTMLElement;
  body: HTMLElement;
  tabItems: HTMLCollection;
  tabContents: HTMLCollection;
  isAllowChange: boolean;
  id: string;
  current: number;
  length: number;
}
export class SimpleTab {
  private collection: NodeListOf<HTMLElement>;
  private tabParams: {} = {};
  public options: Options;
  private rTimer: number | boolean;

  constructor(
    $selector: string = '.tabVoxWrapper',
    {
      // isAddAriaLabel = false,
      activeClassName = 'is-active',
      current = 0,
      isAdjustHeight = true,
      heightPlus = 0,
      onComplete = false, // simpleTabの準備完了コールバック
    }: Partial<Options> = {}
  ) {
    this.collection = document.querySelectorAll($selector);
    this.options = {
      // isAddAriaLabel: isAddAriaLabel,
      activeClassName: activeClassName,
      current: current,
      isAdjustHeight: isAdjustHeight,
      heightPlus: heightPlus,
      onComplete: onComplete,
    };
    this.rTimer;

    this.init();
  }
  init(): void {
    if (!this.collection.length) return;

    this.collection.forEach((v: HTMLElement, i: number) => {
      const itemDate: number = (() => {
        const time: Date = new Date();
        return time.getTime();
      })();
      const tabParam: TabParam = {
        wrap: v,
        tabs: v.querySelector('.tabs'),
        body: v.querySelector('.body'),
        tabItems: v.querySelector('.tabs').children,
        tabContents: v.querySelector('.body').children,
        isAllowChange: false,
        id: ((): string => {
          const num: number = parseInt(`${itemDate}${i}`);
          return `tabItem_${num}`;
        })(),
        current: this.options.current,
        length: v.querySelector('.tabs').children.length,
      };
      v.id = tabParam.id;
      // タブアイテムの初期化
      tabParam.tabs.setAttribute('role', 'tablist');
      Array.from(tabParam.tabItems).forEach((vv: HTMLElement, ii: number) => {
        vv.setAttribute('role', 'tab');
        vv.setAttribute('aria-controls', `tabContents${tabParam.id}${ii}`);
        // if (this.options.isAddAriaLabel)
        //   vv.setAttribute('aria-label', vv.textContent);
        vv.setAttribute('aria-selected', 'true');
        vv.id = `tab_${tabParam.id}${ii}`;
      });
      let h: number = 0;
      Array.from(tabParam.tabContents).forEach(
        (vv: HTMLElement, ii: number) => {
          vv.classList.add('tabContents');
          vv.id = `tabContents${tabParam.id}${ii}`;
          vv.setAttribute('role', 'tabpanel');
          // vv.setAttribute('tabindex', '0');
          vv.setAttribute('aria-labelledby', `tab_${tabParam.id}${ii}`);
        }
      );

      window.addEventListener('load', () => {
        tabParam.tabItems[tabParam.current].classList.add(
          this.options.activeClassName
        );
        tabParam.tabContents[tabParam.current].classList.add(
          this.options.activeClassName
        );
      });

      tabParam.wrap.classList.add('is-initTab');
      tabParam.isAllowChange = true;
      this.tabParams[tabParam.id] = tabParam;

      if (i + 1 >= this.collection.length) {
        if (typeof this.options.onComplete === 'function') {
          if (this.options.isAdjustHeight) this.adjustHeight();
          this.options.onComplete();
          this.run();
        }
      }
    });
  }
  run() {
    for (const key of Object.keys(this.tabParams)) {
      // console.log(this.tabParams[key]);
      const thisTab = this.tabParams[key];

      Array.from(thisTab.tabItems).forEach((v: HTMLElement, i: number) => {
        if (thisTab.current !== i) {
          v.setAttribute('aria-selected', 'false');
          v.setAttribute('tabindex', '-1');
          // thisTab.tabContents[i].setAttribute('aria-hidden', 'true');
        } else {
          v.setAttribute('aria-selected', 'true');
          v.setAttribute('tabindex', '0');
          thisTab.tabContents[i].setAttribute('tabindex', '0');
        }
        v.addEventListener('click', (e) => {
          if (!thisTab.isAllowChange) return false;
          thisTab.current = i;
          Array.from(thisTab.tabItems).forEach((item: HTMLElement) => {
            item.classList.remove('is-active');
            item.setAttribute('aria-selected', 'false');
            item.setAttribute('tabindex', '-1');
          });
          Array.from(thisTab.tabContents).forEach((item: HTMLElement) => {
            // item.setAttribute('aria-hidden', 'true');
            // item.setAttribute('tabindex', '0');
            item.removeAttribute('tabindex');
            item.classList.remove(this.options.activeClassName);
          });

          (<HTMLElement>e.currentTarget).classList.add(
            this.options.activeClassName
          );
          thisTab.tabItems[thisTab.current].setAttribute(
            'aria-selected',
            'true'
          );
          thisTab.tabItems[thisTab.current].setAttribute('tabindex', '0');
          thisTab.tabContents[thisTab.current].setAttribute('tabindex', '0');
          thisTab.tabContents[thisTab.current].classList.add(
            this.options.activeClassName
          );
        });
      });

      thisTab.tabs?.addEventListener('keydown', (e: KeyboardEvent) => {
        // console.log(e.code);
        if (
          e.code === 'ArrowRight' ||
          e.code === 'ArrowLeft' ||
          e.code === 'ArrowDown' ||
          e.code === 'ArrowUp'
        ) {
          e.preventDefault();
          thisTab.current = (() => {
            switch (e.code) {
              case 'ArrowRight':
              case 'ArrowDown':
                return thisTab.current !== thisTab.length - 1
                  ? thisTab.current + 1
                  : 0;
                break;
              case 'ArrowLeft':
              case 'ArrowUp':
                return thisTab.current !== 0
                  ? thisTab.current - 1
                  : thisTab.length - 1;
                break;
            }
          })();
          // console.log(thisTab.current);
          // console.log(thisTab.tabItems[thisTab.current]);
          (<HTMLInputElement>thisTab.tabItems[thisTab.current]).focus();
          // list[a].click();
        }
      });
    }
    window.addEventListener('resize', () => {
      if (this.rTimer !== false) {
        clearTimeout(Number(this.rTimer));
        this.rTimer = false;
      }

      this.rTimer = window.setTimeout(() => {
        if (this.options.isAdjustHeight) this.adjustHeight();
      }, 500);
    });
  }
  adjustHeight() {
    for (const key of Object.keys(this.tabParams)) {
      // console.log(this.tabParams[key]);
      const thisTab = this.tabParams[key];

      let h: number = 0;
      thisTab.body.style.visibility = 'hidden';
      Array.from(thisTab.tabContents).forEach(
        (v: HTMLElement) => (v.style.display = 'block')
      );
      Array.from(thisTab.tabContents).forEach((v: HTMLElement, i: number) => {
        if (v.clientHeight > h) h = v.clientHeight;
      });
      thisTab.body.style.height = `${h + this.options.heightPlus}px`;
      Array.from(thisTab.tabContents).forEach((v: HTMLElement) =>
        v.style.removeProperty('display')
      );
      thisTab.tabItems[thisTab.current].click();
      thisTab.body.style.removeProperty('visibility');
    }
  }
}
