urlParser.bind({
  'provider': 'dailymotion',
  'alternatives': ['dai'],
  'parse': function (url) {
    "use strict";
    var match,
      id,
      startTime,
      result = {};

    match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
    id = match ? match[1] : undefined;

    match = url.match(/[#\?&]start=([A-Za-z0-9]+)/i);
    startTime = match ? getTime(match[1]) : undefined;

    if (!id) {
      return undefined;
    }
    result.mediaType = 'video';
    result.id = id;
    if (startTime) {
      result.startTime = startTime;
    }
    return result;
  },
  'create': function (op) {
    "use strict";
    var vi = op.videoInfo;
    if (vi.startTime) {
      return 'https://www.dailymotion.com/video/' + vi.id + '?start=' + vi.startTime;
    }

    if (op.format === 'short') {
      return 'https://dai.ly/' + vi.id;
    }

    return 'https://www.dailymotion.com/video/' + vi.id;
  }
});
