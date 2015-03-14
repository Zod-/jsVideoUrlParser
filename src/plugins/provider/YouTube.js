urlParser.bind({
  'provider': 'youtube',
  'alternatives': ['youtu'],
  'parse': function (url, params) {
    "use strict";
    var match,
      id,
      list,
      result = {
        params: params
      };

    match = url.match(/(?:(?:v|be|videos|embed)\/(?!videoseries)|v=)([\w\-]{11})/i);
    id = match ? match[1] : undefined;
    if (params.v === id) {
      delete params.v;
    }

    if (params.list === id) {
      delete params.list;
    } else {
      list = params.list;
    }

    if (params.hasOwnProperty('start')) {
      params.start = getTime(params.start);
    }
    if (params.hasOwnProperty('t')) {
      params.start = getTime(params.t);
      delete params.t;
    }

    if (id) {
      result.mediaType = 'video';
      result.id = id;
      if (list) {
        result.list = list;
      }
    } else if (list) {
      result.mediaType = 'playlist';
      result.list = list;
    } else {
      return undefined;
    }

    return result;
  },
  defaultFormat: 'long',
  formats: {
    short: function (vi, params) {
      "use strict";
      var url = 'https://youtu.be/' + vi.id;
      if (params.start) {
        url += '#t=' + params.start;
      }
      return url;
    },
    embed: function (vi, params) {
      "use strict";
      var url = '//youtube.com/embed';

      if (vi.mediaType === 'playlist') {
        params.listType = 'playlist';
      } else {
        url += '/' + vi.id;
        //loop hack
        if (params.loop == 1) {
          params.playlist = vi.id;
        }
      }

      url += combineParams({
        params: params
      });

      return url;
    },
    long: function (vi, params) {
      "use strict";
      var url = '',
        startTime = params.start;
      delete params.start;

      if (vi.mediaType === 'playlist') {
        params.feature = 'share';
        url += 'https://youtube.com/playlist';
      } else {
        params.v = vi.id;
        url += 'https://youtube.com/watch';
      }

      url += combineParams({
        params: params
      });

      if (vi.mediaType !== 'playlist' && startTime) {
        url += '#t=' + startTime;
      }
      return url;
    },
    'default': 'long'
  }
});
