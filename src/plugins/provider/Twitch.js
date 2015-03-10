urlParser.bind({
  'provider': 'twitch',
  'parse': function (url) {
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

    match = url.match(/(?:\?channel|\&utm_content)=(\w+)/i);
    channel = match ? match[1] : channel;

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
    var vi = op.videoInfo;
    if (vi.mediaType === 'stream') {
      return 'https://twitch.tv/' + vi.channel;
    }

    return 'https://twitch.tv/' + vi.channel + '/' + vi.idPrefix + '/' + vi.id;
  }
});
