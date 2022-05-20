import * as Velocity from '../lib/velocity.min.js';
import {
  AzLib
} from '../global/main.class.js';

window.addEventListener('DOMContentLoaded', () => {
  const azlib = new AzLib({
    spBreakPoint: 960,
    isDebug: true
  });
  azlib.adjustSize('.vox01');
  azlib.popupAdjust({
    onComplete: () => {
      console.log('loaded')
    }
  });
  document.querySelectorAll('.popupBtItem.movie').forEach((v, i) => {
    v.addEventListener('click', () => {
      const movie = v.getAttribute('data-movie');
      const src = '<iframe src="https://www.youtube.com/embed/' + movie + '?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      document.querySelector('#popupWrapperMovie .content').innerHTML = src;
    });
  });
  azlib.replaceImageSP('.rplSPImg');
  azlib.flowVox('.flowVox');
  azlib.flowVox('.flowVox2');
  azlib.flowVox('.flowVox3', {
    isRepeat: true
  });
  azlib.adjustSize('.vox01');
});