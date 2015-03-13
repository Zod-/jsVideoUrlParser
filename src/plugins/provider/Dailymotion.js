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
  'create': function (op) {
    "use strict";
    var vi = op.videoInfo,
      url = '';

    if (op.format === 'short') {
      url = 'https://dai.ly/' + vi.id;
    } else {
      url = 'https://dailymotion.com/video/' + vi.id;
      url += combineParams({params: op.params});
    }

    return url;
  }
});
