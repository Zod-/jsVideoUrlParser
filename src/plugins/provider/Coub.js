urlParser.bind({
  provider: 'coub',
  parse: function (url, params) {
    'use strict';
    var match;
    var result = {
      mediaType: 'video',
      params: params
    };

    match = url.match(
      /coub\.com\/view\/([a-zA-Z\d]+)/i
    );
    result.id = match ? match[1] : undefined;

    if (!result.id) {
      return undefined;
    }

    if (params.hasOwnProperty('t')) {
      params.start = getTime(params.t);
      delete params.t;
    }

    return result;
  },
  defaultFormat: 'long',
  formats: {
    long: function (vi, params) {
      'use strict';
      var url = 'https://coub.com/view/' + vi.id;
      var startTime = params.start;
      delete params.start;
      url += combineParams({
        params: params
      });
      if (startTime) {
        url += '#t=' + startTime;
      }
      return url;
    },
    embed: function (vi, params) {
      'use strict';
      var url = '//coub.com/embed/' + vi.id;
      var startTime = params.start;
      delete params.start;
      url += combineParams({
        params: params
      });
      if (startTime) {
        url += '#t=' + startTime;
      }
      return url;
    }
  }
});
