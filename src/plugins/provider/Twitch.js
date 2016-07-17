function Twitch() {
  'use strict';
  this.provider = 'twitch';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongURL,
    embed: this.createEmbedURL
  };
}

Twitch.prototype.parseChannel = function (result, params) {
  'use strict';
  /*jshint camelcase:false */
  return params.channel || params.utm_content || result.channel;
  /*jshint camelcase:true */
};


Twitch.prototype.parseUrl = function (url, result) {
  'use strict';
  var match;
  match = url.match(/twitch\.tv\/(\w+)(?:\/(.)\/(\d+))?/i);
  result.channel = match ? match[1] : undefined;
  if (match && match[2] && match[3]) {
    result.idPrefix = match[2];
    result.id = match[3];
  }
  return result;
};

Twitch.prototype.parseMediaType = function (result) {
  'use strict';
  return result.id ? 'video' : 'stream';
};

Twitch.prototype.parse = function (url, params) {
  'use strict';
  var _this = this;
  var result = {};
  result = _this.parseUrl(url, result);
  result.channel = _this.parseChannel(result, params);
  result.mediaType = _this.parseMediaType(result);
  return result.channel ? result : undefined;
};

Twitch.prototype.createLongURL = function (vi, params) {
  'use strict';
  var url = '';
  if (vi.mediaType === 'stream') {
    url = 'https://twitch.tv/' + vi.channel;
  } else if (vi.mediaType === 'video') {
    url = 'https://twitch.tv/' + vi.channel + '/' + vi.idPrefix + '/' +
      vi.id;
  }
  url += combineParams({
    params: params
  });

  return url;
};

Twitch.prototype.createEmbedURL = function (vi, params) {
  'use strict';
  return '//www.twitch.tv/' +
    vi.channel +
    '/embed' +
    combineParams({
      params: params
    });
};

urlParser.bind(new Twitch());
