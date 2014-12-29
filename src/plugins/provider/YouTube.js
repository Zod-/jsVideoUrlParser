urlParser.bind({
  'provider': 'youtube',
  'alternatives': ['youtu'],
  'parse': function(url) {
    "use strict";
    var match,
      videoId,
      playlistId,
      startTime,
      result = {};

    match = url.match(/(?:(?:v|be|videos)\/|v=)([\w\-]{11})/i);
    videoId = match ? match[1] : undefined;

    match = url.match(/list=([\w\-]+)/i);
    playlistId = match ? match[1] : undefined;

    match = url.match(/[#\?&](?:star)?t=([A-Za-z0-9]+)/i);
    startTime = match ? getTime(match[1]) : undefined;


    if (videoId) {
      result.mediaType = 'video';
      result.videoId = videoId;
      if (playlistId) {
        result.playlistId = playlistId;
      }
      if (startTime) {
        result.startTime = startTime;
      }
    } else if (playlistId) {
      result.mediaType = 'playlist';
      result.playlistId = playlistId;
    } else {
      return undefined;
    }

    return result;
  },
  'create': function(op) {
    "use strict";
    var url,
      vi = op.videoInfo;
    if (vi.mediaType === 'playlist') {
      return 'https://www.youtube.com/playlist?feature=share&list={0}'.format(vi.playlistId);
    }

    if (vi.playlistId) {
      url = 'https://www.youtube.com/watch?v={0}&list={1}'.format(vi.videoId, vi.playlistId);
    } else {
      if (op.format === 'short') {
        url = 'https://youtu.be/{0}'.format(vi.videoId);
      } else {
        url = 'https://www.youtube.com/watch?v={0}'.format(vi.videoId);
      }
    }

    if (vi.startTime) {
      url += '#t={0}'.format(vi.startTime);
    }
    return url;
  }
});
