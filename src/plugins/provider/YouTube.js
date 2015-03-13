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

    match = url.match(/(?:(?:v|be|videos)\/|v=)([\w\-]{11})/i);
    id = match ? match[1] : undefined;
    if (params.v === id) {
      delete params.v;
    }

    list = params.list;

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
  'create': function (op) {
    "use strict";
    var url,
      vi = op.videoInfo,
      params = cloneObject(op.params),
      startTime = params.start;
    delete params.start;

    if (vi.mediaType === 'playlist') {
      return 'https://youtube.com/playlist?feature=share&list=' + vi.list;
    }

    if (op.format === 'short') {
      url = 'https://youtu.be/' + vi.id;
    } else {
      url = 'https://youtube.com/watch?v=' + vi.id;
      url += combineParams({hasParams:true, params: params});
    }

    if (startTime) {
      url += '#t=' + startTime;
    }
    return url;
  }
});
