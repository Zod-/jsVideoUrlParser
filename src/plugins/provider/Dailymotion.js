urlParser.bind({
  'provider': 'dailymotion',
  'alternatives': ['dai'],
  'parse': function(url) {
    "use strict";
    var match,
      videoId,
      startTime,
      result = {};

    match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
    videoId = match ? match[1] : undefined;

    match = url.match(/[#\?&]start=([A-Za-z0-9]+)/i);
    startTime = match ? getTime(match[1]) : undefined;

    if (!videoId) {
      return undefined;
    }
    result.mediaType = 'video';
    result.videoId = videoId;
    if (startTime) {
      result.startTime = startTime;
    }
    return result;
  },
  'create': function(op) {
    "use strict";
    var vi = op.videoInfo;
    if (vi.startTime) {
      return 'https://www.dailymotion.com/video/{0}?start={1}'.format(vi.videoId, vi.startTime);
    }

    if (op.format === 'short') {
      return 'https://dai.ly/{0}'.format(vi.videoId);
    }

    return 'https://www.dailymotion.com/video/{0}'.format(vi.videoId);
  }
});
