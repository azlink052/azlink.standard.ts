/**
 * ================================================
 *
 * [aboutus]
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
          if (gmap.datas.length) {
            gmap.init();
          }
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
    gmap.init();

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

const gmap = {
  map: false,
  gMapObj: {},
  marker: {},
  infoWin: {},
  datas: {
    'access': {
      latlng: new google.maps.LatLng(35.163470, 136.911547),
      title: '<span class="fwB">有限会社アスリンク</span>',
      address: '愛知県名古屋市中区栄5-19-4 ケイポイントビル2F<br>TEL.052-263-0185',
      id: 'accessMap'
    }
  },
  init: function() {
    $('#accessMap').empty();

    $.each(gmap.datas, function(key, val) {
      const latlng = val.latlng;

      const opts = {
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latlng,
        scrollwheel: false
      };

      gmap.gMapObj[key] = new google.maps.Map(document.getElementById(val.id), opts);

      gmap.marker[key] = new google.maps.Marker({
        position: latlng,
        map: gmap.gMapObj[key],
        title: val.title,
        icon: assets_dir + 'images/content/aboutus/marker.png',
        animation: google.maps.Animation.DROP,
        optimized: false
      });

      gmap.infoWin[key] = new google.maps.InfoWindow({
        content: '<div id="gmapWin' + key + '"><div class="inner"><h2>' + val.title + '</h2><p class="address">' + val.address + '</p></div></div>'
      });

      google.maps.event.addListener(gmap.marker[key], 'click', function() {
        gmap.gMapObj[key].panTo(latlng);
        gmap.infoWin[key].open(gmap.gMapObj[key], gmap.marker[key]);
      });

      var styleOptions = [{
          "featureType": "administrative.neighborhood",
          "elementType": "all",
          "stylers": [{
            "visibility": "simplified"
          }]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry.fill",
          "stylers": [{
              "visibility": "on"
            },
            {
              "color": "#e0efef"
            }
          ]
        },
        {
          "featureType": "landscape.natural.landcover",
          "elementType": "all",
          "stylers": [{
            "visibility": "on"
          }]
        },
        {
          "featureType": "landscape.natural.landcover",
          "elementType": "geometry",
          "stylers": [{
            "visibility": "on"
          }]
        },
        {
          "featureType": "landscape.natural.terrain",
          "elementType": "all",
          "stylers": [{
            "visibility": "on"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [{
              "visibility": "on"
            },
            {
              "hue": "#1900ff"
            },
            {
              "color": "#c0e8e8"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.attraction",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.business",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.government",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.medical",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
              "visibility": "simplified"
            },
            {
              "color": "#cbe3cc"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.place_of_worship",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.school",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.sports_complex",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
              "lightness": 100
            },
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "all",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [{
            "visibility": "on"
          }]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels",
          "stylers": [{
              "visibility": "simplified"
            },
            {
              "invert_lightness": true
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [{
            "visibility": "simplified"
          }]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [{
            "visibility": "on"
          }]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry.fill",
          "stylers": [{
            "visibility": "on"
          }]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry.stroke",
          "stylers": [{
            "visibility": "on"
          }]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [{
            "invert_lightness": true
          }]
        },
        {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [{
            "visibility": "simplified"
          }]
        },
        {
          "featureType": "transit",
          "elementType": "labels",
          "stylers": [{
            "visibility": "simplified"
          }]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text",
          "stylers": [{
              "visibility": "simplified"
            },
            {
              "color": "#777777"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{
              "visibility": "off"
            },
            {
              "lightness": 700
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{
              "color": "#9cdfdf"
            },
            {
              "visibility": "simplified"
            }
          ]
        }
      ];

      var styledMapOptions = {
        name: 'azlink'
      };
      var azlinkType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
      gmap.gMapObj[key].mapTypes.set('azlinkMap', azlinkType);
      gmap.gMapObj[key].setMapTypeId('azlinkMap');
    });
  }
};
