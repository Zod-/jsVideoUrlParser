urlParser.bind({
  'provider': 'twitch',
  'parse': function(url) {
    "use strict";
    var match,
      id,
      channel,
      videoIdPrefix,
      result = {};

    match = url.match(/twitch\.tv\/(\w+)(?:\/(.)\/(\d+))?/i);
    channel = match ? match[1] : undefined;
    videoIdPrefix = match ? match[2] : undefined;
    id = match ? match[3] : undefined;

    match = url.match(/(?:\?channel|\&utm_content)=(\w+)/i);
    channel = match ? match[1] : channel;

    if (!channel) {
      return undefined;
    }
    if (id) {
      result.mediaType = 'video';
      result.id = id;
      result.videoIdPrefix = videoIdPrefix;
    } else {
      result.mediaType = 'stream';
    }
    result.channel = channel;

    return result;
  },
  'create': function(videoInfo) {
    "use strict";
    var url;
    if (videoInfo.mediaType === 'stream') {
      url = 'http://twitch.tv/{0}'.format(videoInfo.channel);
    } else if (videoInfo.mediaType === 'video') {
      url = 'http://twitch.tv/{0}/{1}/{2}'.format(videoInfo.channel, videoInfo.videoIdPrefix, videoInfo.id);
    }
    return url;
  }
});
