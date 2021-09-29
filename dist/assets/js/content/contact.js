/**
 * ================================================
 *
 * [contact]
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
    /**
     ********************************************
     * click event
     ********************************************
     */
    $('#entryPriv').on('click', function() {
      functions.checkParams();
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
    if ($('body').hasClass('error')) {
      var errBgColor = '#f9cdd1';

      $('.caution').each(function() {
        $(this).parent().css('background-color', errBgColor).addClass('error');
      });
    }

    if ($('body').hasClass('finish')) {
      $('#contact').velocity('scroll', 10);
    }

    functions.checkParams();

    setTimeout(function() {
      functions.adjust();
    }, 500);
  },
  adjust: function() {
    if (!$.params.isRespMode) {

    } else {

    }
  },
  checkParams: function() {
    if (!$('#entryPriv').prop('checked')) {
      $('input[name="entrySubmit"]').prop('disabled', true).addClass('disabled');
    } else {
      $('input[name="entrySubmit"]').prop('disabled', false).removeClass('disabled');
    }
  }
};
