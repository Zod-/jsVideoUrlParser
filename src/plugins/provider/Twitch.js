urlParser.bind({
  'provider': 'twitch',
  'parse': function(url) {
    "use strict";
    var match,
      videoId,
      channel,
      videoIdPrefix,
      result = {};

    match = url.match(/twitch\.tv\/(\w+)(?:\/(.)\/(\d+))?/i);
    channel = match ? match[1] : undefined;
    videoIdPrefix = match ? match[2] : undefined;
    videoId = match ? match[3] : undefined;

    match = url.match(/(?:\?channel|\&utm_content)=(\w+)/i);
    channel = match ? match[1] : channel;

    if (!channel) {
      return undefined;
    }
    if (videoId) {
      result.mediaType = 'video';
      result.videoId = videoId;
      result.videoIdPrefix = videoIdPrefix;
    } else {
      result.mediaType = 'stream';
    }
    result.channel = channel;

    return result;
  },
  'create': function(videoInfo) {
    "use strict";
    var url,
      vi = op.videoInfo;
    if (vi.mediaType === 'stream') {
      return 'https://twitch.tv/{0}'.format(vi.channel);
    }

    return 'https://twitch.tv/{0}/{1}/{2}'.format(vi.channel, vi.videoIdPrefix, vi.videoId);
  }
});
