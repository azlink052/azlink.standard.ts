const viewportSettings = {
  width: 1280,
  dspWidth: parseInt(window.parent.screen.width),
  globalUA: window.navigator.userAgent.toLowerCase()
};
if ((viewportSettings.globalUA.indexOf('android') > 0 && viewportSettings.globalUA.indexOf('mobile') == -1) || viewportSettings.globalUA.indexOf('ipad') > -1 || (viewportSettings.globalUA.indexOf('macintosh') > -1 && 'ontouchend' in document) || (viewportSettings.dspWidth >= 768 && (viewportSettings.globalUA.indexOf('iphone') > 0 || viewportSettings.globalUA.indexOf('android') > 0 || viewportSettings.globalUA.indexOf('mobile') > 0))) {
  // tablet
  document.write('<meta name="viewport" content="width=' + viewportSettings.width + '">');
} else {
  // タブレット端末ではない場合の処理
  document.write('<meta name="viewport" content="width=device-width">');
}
