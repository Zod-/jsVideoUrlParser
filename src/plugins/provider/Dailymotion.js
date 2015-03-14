urlParser.bind({
  'provider': 'dailymotion',
  'alternatives': ['dai'],
  'parse': function (url, params) {
    "use strict";
    var match,
      id,
      result = {
        params: params
      };

    match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
    id = match ? match[1] : undefined;

    if (params.hasOwnProperty('start')) {
      params.start = getTime(params.start);
    }

    if (!id) {
      return undefined;
    }
    result.mediaType = 'video';
    result.id = id;

    return result;
  },
  defaultFormat: 'long',
  formats: {
    short: function (vi) {
      "use strict";
      return 'https://dai.ly/' + vi.id;
    },
    long: function (vi, params) {
      "use strict";
      return 'https://dailymotion.com/video/' +
        vi.id +
        combineParams({
          params: params
        });
    },
    embed: function (vi, params) {
      "use strict";
      return '//www.dailymotion.com/embed/video/' +
        vi.id +
        combineParams({
          params: params
        });
    }
  }
  //
});
