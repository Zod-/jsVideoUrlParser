urlParser.bind({
  provider: 'vimeo',
  alternatives: ['vimeopro'],
  parse: function (url, params) {
    "use strict";
    var match;
    var result = {
      mediaType: 'video',
      params: params
    };

    match = url.match(
      /(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i
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
      "use strict";
      var url = 'https://vimeo.com/' + vi.id;
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
      "use strict";
      var url = '//player.vimeo.com/video/' + vi.id;
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
