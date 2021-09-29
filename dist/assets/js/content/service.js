/**
 * ================================================
 *
 * [service]
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
    $('.itemWrapper .item').each(function() {
      var type = $(this).data('type'),
        target = $(this).find('.itemImg');
      $.ajax({
        url: assets_dir + 'images/content/content/' + type + '.svg',
        type: 'GET',
        beforeSend: function() {
          //
        }
      }).then(function(data) {
        var svg = $(data).find('svg');
        console.log(svg)
        target.append(svg);
      }, function(jqXHR, textStatus) {
        if (textStatus !== 'success') {
          console.log(jqXHR);
        }
      });
    });

    setTimeout(function() {
      functions.adjust();
    }, 500);
  },
  adjust: function() {
    if (!$.params.isRespMode) {
      // $('.itemWrapper figure').adjustSize();
    } else {

    }
  }
};
