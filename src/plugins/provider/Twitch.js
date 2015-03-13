urlParser.bind({
  'provider': 'twitch',
  'parse': function (url, params) {
    "use strict";
    var match,
      id,
      channel,
      idPrefix,
      result = {};

    match = url.match(/twitch\.tv\/(\w+)(?:\/(.)\/(\d+))?/i);
    channel = match ? match[1] : undefined;
    idPrefix = match ? match[2] : undefined;
    id = match ? match[3] : undefined;

    channel = params.channel || params.utm_content || channel;

    if (!channel) {
      return undefined;
    }
    if (id) {
      result.mediaType = 'video';
      result.id = id;
      result.idPrefix = idPrefix;
    } else {
      result.mediaType = 'stream';
    }
    result.channel = channel;

    return result;
  },
  'create': function (op) {
    "use strict";
    var vi = op.videoInfo,
      url = '';
    if (vi.mediaType === 'stream') {
      url = 'https://twitch.tv/' + vi.channel;
    }else{
      url = 'https://twitch.tv/' + vi.channel + '/' + vi.idPrefix + '/' + vi.id;
    }
    url += combineParams({hasParams:false, params: op.params});

    return url;
  }
});
