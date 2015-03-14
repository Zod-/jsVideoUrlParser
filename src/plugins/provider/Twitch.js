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
  defaultFormat: 'long',
  formats: {
    long: function (vi, params) {
      "use strict";
      var url = '';
      if (vi.mediaType === 'stream') {
        url = 'https://twitch.tv/' + vi.channel;
      } else if (vi.mediaType === 'video') {
        url = 'https://twitch.tv/' + vi.channel + '/' + vi.idPrefix + '/' + vi.id;
      }
      url += combineParams({
        params: params
      });

      return url;
    },
    embed: function (vi, params) {
      "use strict";
      return '//www.twitch.tv/' +
        vi.channel +
        '/embed' +
        combineParams({
          params: params
        });
    },
  }
});
