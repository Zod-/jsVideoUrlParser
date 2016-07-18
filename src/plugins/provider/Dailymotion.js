function Dailymotion() {
  'use strict';
  this.provider = 'dailymotion';
  this.alternatives = ['dai'];
  this.defaultFormat = 'long';
  this.formats = {
    short: this.createShortUrl,
    long: this.createLongUrl,
    embed: this.createEmbedUrl
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

Dailymotion.prototype.createUrl = function (base, vi, params) {
  'use strict';
  return base + vi.id +
    combineParams({
      params: params
    });
};

Dailymotion.prototype.createShortUrl = function (vi) {
  'use strict';
  return this.createUrl('https://dai.ly/', vi, {});
};

Dailymotion.prototype.createLongUrl = function (vi, params) {
  'use strict';
  return this.createUrl('https://dailymotion.com/video/', vi, params);
};

Dailymotion.prototype.createEmbedUrl = function (vi, params) {
  'use strict';
  return this.createUrl('//www.dailymotion.com/embed/video/', vi, params);
};

urlParser.bind(new Dailymotion());
