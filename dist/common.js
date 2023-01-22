class ContentJS {
  constructor() {
    this.isSkip = false;
    this.isFlowAnime = false;
    this.isPopup = false;
    this.isAcc = false;
    this.isOpen = false;
    this.isAllowClose = false;
    this.isDefaultFirst = true;
    this.isScroll = true;
    this.hHeight = 0;
    this.hHeightOrg = 0;
    this.hWidth = 0;
    this.isNavMainHover = [];
    this.isNavSubHover = [];
    this.subHeights = [];
    this.resizeTimer = false;
    this.adminMargin = 0;
  }
  init() {
    this.isSkip = document.body.classList.contains('is-skip') ? true : false;
    this.isFlowAnime =
      document.body.classList.contains('is-flowAnime') && !util.isMobile
        ? true
        : false;
    this.isPopup = document.body.classList.contains('is-popup') ? true : false;
    this.isAcc = document.body.classList.contains('is-acc') ? true : false;

    // ロケーションハッシュ
    window.addEventListener('load', () => {
      if (location.hash !== '') {
        const target = location.hash;
        const offset = util.isRespMode
          ? -(this.hHeight + this.adminMargin)
          : -this.adminMargin;
        new azlib.anime({
          targets: 'html, body',
          scrollTop: target.offsetTop + offset,
          duration: 10,
          easing: 'easeInQuad',
        });
      }
    });

    window.addEventListener('resize', () => {
      if (this.resizeTimer !== false) {
        clearTimeout(this.resizeTimer);
      }

      this.resizeTimer = setTimeout(() => {
        this.adjust();
        if (util.isChangeMode) {
          if (!util.isRespMode) {
            document.getElementById('gNavWrapper').style.display = 'block';
          } else {
            if (util.isNavOpen) document.getElementById('gNavWrapper').click();
          }
        }
      }, 500);
    });

    if (document.getElementById('pageTopVox')) {
      document.querySelector('#pageTopVox a').addEventListener('click', (e) => {
        new azlib.anime({
          targets: 'html, body',
          scrollTop: 0,
          duration: 500,
          easing: 'easeInOutQuart',
        });
      });
    }

    const rplSPImg = new azlib.ReplaceImageSP('.rplSPImg', {
      spBreakPoint: util.spBreakPoint,
    });

    if (this.isPopup) {
      const popup = new azlib.PopupAdjust('.popupBtItem', {
        onComplete: () => {
          console.log('loaded');
        },
      });
    }

    if (this.isAcc) {
      const acc = new azlib.SimpleAccordion('.accVox');
    }

    const flowVox = new azlib.FlowVox('.flowVox', {
      isRepeat: true,
    });

    setTimeout(() => {
      this.runIntro();
    }, 500);

    this.adjust();
  }
  adjust() {
    this.hHeight = document.getElementById('siteHeader').clientHeight;
    this.adminMargin = document.documentElement.style.marginTop;

    util.sScroll(
      -(Number(this.adminMargin) + Number(this.hHeight)),
      500,
      'easeInQuad'
    );

    this.adjustHeader();
  }
  runIntro() {
    if (this.isSkip) return;

    // document.getElementById('wrapper').style.visibility = 'visible';

    new azlib.anime({
      targets: '#loading',
      opacity: [1, 0],
      complete: (anim) => {
        if (document.getElementById('loading')) {
          document.getElementById('loading').style.display = 'none';
        }
      },
    });

    new azlib.anime({
      targets: '#wrapper',
      opacity: 1,
      delay: 400,
      duration: 250,
      easing: 'linear',
      complete: (anim) => {
        this.isDefaultFirst = false;
      },
    });
  }
  adjustHeader() {}
  // initAcc() {
  //   // 汎用アコーディオン
  //   document
  //     .querySelectorAll('.accVox')
  //     .forEach((v, i) => {
  //       const itemDate = (() => {
  //         const time = new Date();
  //         return time.getTime();
  //       })();
  //       const accParams = {
  //         wrap: v,
  //         opener: v.querySelector('.opener'),
  //         body: v.querySelector('.accContent'),
  //         height: 0,
  //         isAllowChange: false,
  //         id: parseInt(`${itemDate}_${i}`),
  //       };
  //       accParams.height = accParams.body.clientHeight;
  //       // console.log(accParams);
  //       new azlib.anime({
  //         targets: accParams.body,
  //         height: 0,
  //         duration: 1,
  //         complete: () => {
  //           accParams.isAllowChange = true;
  //           Object.assign(accParams.body.style, {
  //             display: 'none',
  //             overflow: 'hidden',
  //           });
  //           document.body.classList.add('is-allowChangeAcc');
  //         },
  //       });
  //       accParams.wrap.classList.remove('is-open');
  //       // イベント
  //       accParams.opener.addEventListener('click', (e) => {
  //         if (!accParams.isAllowChange) return;
  //         accParams.isAllowChange = false;
  //         if (accParams.body.style.display === 'block') {
  //           accParams.wrap.classList.remove('is-open');
  //           accParams.body.style.removeProperty('height');
  //           new azlib.anime({
  //             targets: accParams.body,
  //             height: 0,
  //             duration: 400,
  //             easing: 'easeOutCubic',
  //             complete: () => {
  //               accParams.isAllowChange = true;
  //               accParams.body.style.display = 'none';
  //             },
  //           });
  //         } else {
  //           accParams.wrap.classList.add('is-open');
  //           Object.assign(accParams.body.style, {
  //             display: 'block',
  //             visibility: 'hidden',
  //             position: 'absolute',
  //             height: 'auto',
  //           });
  //           // accParams.height = accParams.body.clientHeight;
  //           // console.log(accParams.height);
  //           Object.assign(accParams.body.style, {
  //             visibility: 'visible',
  //             position: 'static',
  //             height: '0px',
  //           });
  //           // console.log(accParams.height);
  //           new azlib.anime({
  //             targets: accParams.body,
  //             height: [0, accParams.height],
  //             duration: 400,
  //             easing: 'easeOutCubic',
  //             complete: () => {
  //               accParams.body.style.height = 'auto';
  //               accParams.height = accParams.body.clientHeight;
  //               accParams.isAllowChange = true;
  //               // console.log(accParams);
  //             },
  //           });
  //         }
  //       });
  //     });
  // }
}
