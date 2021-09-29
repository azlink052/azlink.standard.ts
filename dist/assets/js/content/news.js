/**
 * ================================================
 *
 * [privacy]
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
