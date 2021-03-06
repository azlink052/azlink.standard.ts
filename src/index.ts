// import 'core-js/stable';
// import Utilities from './lib/Utilities';
// import AdjustSize from './lib/AdjustSize';
// import PopupAdjust from './lib/PopupAdjust';
// import FlowVox from './lib/FlowVox';
// import FadeSlider from './lib/FadeSlider';
// import ReplaceImageSP from './lib/ReplaceImageSP';
// import RSSFeed from './lib/RSSFeed';
// import InstaFeed from './lib/InstaFeed';
import * as azlib from './azlib';

const util = new azlib.Utilities({
  spBreakPoint: 960,
  isDebug: true,
});

window.addEventListener('DOMContentLoaded', () => {
  util.init();
  console.log(util.qsParm);
  // const ADJUST_SIZE = [];
  // document.querySelectorAll('.vox01, .vox02').forEach((v, i) => {
  //   ADJUST_SIZE[i] = new AdjustSize(v.querySelectorAll('p'));
  // });
  const ADJUST_SIZE1 = new azlib.AdjustSize('.vox01 p');
  const ADJUST_SIZE2 = new azlib.AdjustSize('.vox02 p');
  // util.adjustSize('.vox01, .vox02');
  const popup = new azlib.PopupAdjust('.popupBtItem', {
    onComplete: () => {
      console.log('popup loaded.');
    },
  });
  document.querySelectorAll('.popupBtItem.movie').forEach((v, i) => {
    v.addEventListener('click', () => {
      const movie = v.getAttribute('data-movie');
      const src =
        '<iframe src="https://www.youtube.com/embed/' +
        movie +
        '?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      document
        .querySelector('#popupWrapperMovie .content')
        .insertAdjacentHTML('beforeend', src);
    });
  });
  const rplSPImg1 = new azlib.ReplaceImageSP();
  // setTimeout(() => {
  //   rplSPImg1.destroy();
  // }, 5000);
  const flowVox1 = new azlib.FlowVox('.flowVox', {
    isRepeat: true,
    per: 0.3,
    duration: 5000,
  });
  const flowVox2 = new azlib.FlowVox('.flowVox2', {
    isRepeat: true,
    delay: 2000,
  });
  const flowVox3 = new azlib.FlowVox('.flowVox3', {
    isRepeat: true,
  });
  const flowVox4 = new azlib.FlowVox('.flowVox4', {
    isRepeat: true,
    per: 0.3,
  });
  document.querySelectorAll('.slider').forEach((value, index) => {
    Array.from(value.children).forEach((v, i) => {
      const src = v.querySelector('img').src;
      // console.log(src)
      if (src) {
        (<HTMLElement>v).style.backgroundImage = 'url(' + src + ')';
        v.querySelector('img').remove();
      }
    });
  });
  if (document.getElementById('slider01')) {
    const slider01 = new azlib.FadeSlider('#slider01', {
      ctrl: true,
      pager: true,
      speed: 1500,
      pause: 3000,
      // easing: 'easeOutCubic',
      onSliderLoad: () => {
        console.log('slider loaded.');
      },
    });
  }
  if (document.getElementById('slider02')) {
    const slider02 = new azlib.FadeSlider('#slider02', {
      ctrl: true,
      pager: true,
      speed: 500,
      pause: 3000,
    });
  }
});
if (document.getElementById('feedVox')) {
  // feed????????????
  const FEED01 = new azlib.RSSFeed({
    feed_url: 'https://azlink.jp/content/feed?post_type=web_works',
    callback: 'result01',
    count: 10,
    onComplete: (response) => {
      // console.log(response);
      if (response.length > 0) {
        const UL = document.createElement('ul');
        document.getElementById('feedVox').appendChild(UL);
      }
      for (const item of response) {
        console.log(item);
      }
    },
  });
}
if (document.getElementById('instaVox')) {
  // instafeed
  // const INSTAFEED01 = new azlib.InstaFeed({
  //   igID: '17841412223846154',
  //   count: 10,
  //   version: '10.0',
  //   token:
  //     'EAAHZBBdclfd0BALKdxmUsOqd1B7APEMwOBwTozZBtmIX7txrtYvhdlo4gx2m81ZBRQBkwd9mhrHZBNZAezPVXKYgpHQAPe5InhORTWSOit8y1r1gMsoJVQIDLhUZAkqPGE7jlCQ3BxuZBN8WIIIu5yMAeP9hrxbKer8rnmdYdHa98hrI1tKqC2G',
  //   elem: '#instaVox',
  //   onComplete: (response) => {
  //     console.log(response);
  //   },
  // });
}
