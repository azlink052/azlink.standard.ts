/**
 * ================================================
 *
 * [sns]
 *
 * ================================================
 */
let rTimer = false,
  isFirst = true;

(function($) {
  $(function() {
    /**
     ********************************************
     * load event
     ********************************************
     */
    functions.init();
    /**
     ********************************************
     * resize event
     ********************************************
     */
    $(window).on('resize', function() {
      if (rTimer !== false) {
        clearTimeout(rTimer);
      }

      rTimer = setTimeout(function() {
        functions.adjust();
        if ($.params.isChangeMode) {

        }
      }, 1000);
    });
  });
}(jQuery));
/**
 **********************************************************
 *
 * functions
 *
 **********************************************************
 */
const functions = {
  init: function() {
    $('#instaFeed').instaFeed({
      igID: '17841404596521497',
      count: 10,
      version: '10.0',
      token: 'EAAEVi72IIG0BAPdbryeLHMIAbZBiIW1Y8Y4kr8rFwm85HByZAbGZArctOk1pWoZA63VuENudBd9UbgtZBI7nyxuupuBZBcYUFOOPDSkUoM42TlAIlDM2ZCBWJJ1sH5dYcPLIu9z3ZB2dspAJACv9gAheqdZAZCSICnuwuU8rZCRYZBA5JgZDZD'
    });
    setTimeout(function() {
      functions.adjust();
    }, 500);
  },
  adjust: function() {
    if (!$.params.isRespMode) {

    } else {

    }
  }
};
