function Dailymotion() {
  'use strict';
  this.provider = 'dailymotion';
  this.alternatives = ['dai'];
  this.defaultFormat = 'long';
  this.formats = {
    short: this.createShortURL,
    long: this.createLongURL,
    embed: this.createEmbedURL
  };
}

Dailymotion.prototype.parseParameters = function (params) {
  'use strict';
  return this.parseTime(params);
};

Dailymotion.prototype.parseTime = function (params) {
  'use strict';
  if (params.start) {
    params.start = getTime(params.start);
  }
  return params;
};

Dailymotion.prototype.parseUrl = function (url) {
  'use strict';
  var match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
  return match ? match[1] : undefined;
};

Dailymotion.prototype.parse = function (url, params) {
  'use strict';
  var _this = this;
  var result = {
    mediaType: 'video',
    params: _this.parseParameters(params),
    id: _this.parseUrl(url)
  };
  return result.id ? result : undefined;
};

Dailymotion.prototype.createURL = function (base, vi, params) {
  'use strict';
  return base + vi.id +
    combineParams({
      params: params
    });
};

Dailymotion.prototype.createShortURL = function (vi) {
  'use strict';
  return this.createURL('https://dai.ly/', vi, {});
};

Dailymotion.prototype.createLongURL = function (vi, params) {
  'use strict';
  return this.createURL('https://dailymotion.com/video/', vi, params);
};

Dailymotion.prototype.createEmbedURL = function (vi, params) {
  'use strict';
  return this.createURL('//www.dailymotion.com/embed/video/', vi, params);
};

urlParser.bind(new Dailymotion());
