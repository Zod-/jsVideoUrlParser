function YouTube() {
  'use strict';
  this.provider = 'youtube';
  this.alternatives = ['youtu', 'ytimg'];
  this.defaultFormat = 'long';
  this.formats = {
    short: this.createShortUrl,
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
    shortImage: this.createShortImageUrl,
    longImage: this.createLongImageUrl,
    share: this.createShareUrl
  };
  this.imageQualities = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    DEFAULT: 'default',
    HQDEFAULT: 'hqdefault',
    SDDEFAULT: 'sddefault',
    MQDEFAULT: 'mqdefault',
    MAXRESDEFAULT: 'maxresdefault',
  };
  this.defaultImageQuality = this.imageQualities.HQDEFAULT;
}

YouTube.prototype.parseUrl = function (url) {
  'use strict';
  var match = url.match(
    /(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)([\w\-]{11})/i
  );
  return match ? match[1] : undefined;
};

YouTube.prototype.parseTime = function (params) {
  'use strict';
  params.start = getTime(params.start || params.t);
  delete params.t;
  return params;
};

YouTube.prototype.parseParameters = function (params, result) {
  'use strict';
  if (params.start || params.t) {
    params.start = getTime(params.start || params.t);
    delete params.t;
  }
  if (params.v === result.id) {
    delete params.v;
  }
  if (params.list === result.id) {
    delete params.list;
  }

  return params;
};

YouTube.prototype.parseMediaType = function (result) {
  'use strict';
  if (result.params.list) {
    result.list = result.params.list;
  }
  if (result.id && !result.params.ci) {
    result.mediaType = 'video';
  } else if (result.params.list) {
    delete result.id;
    result.mediaType = 'playlist';
  } else if (result.params.ci){
    delete result.params.ci;
    result.mediaType = 'share';
  }else {
    return undefined;
  }
  return result;
};

YouTube.prototype.parse = function (url, params) {
  'use strict';
  var _this = this;
  var result = {
    params: params,
    id: _this.parseUrl(url)
  };
  result.params = _this.parseParameters(params, result);
  result = _this.parseMediaType(result);
  return result;
};

YouTube.prototype.createShortUrl = function (vi, params) {
  'use strict';
  var url = 'https://youtu.be/' + vi.id;
  if (params.start) {
    url += '#t=' + params.start;
  }
  return url;
};

YouTube.prototype.createLongUrl = function (vi, params) {
  'use strict';
  var url = '';
  var startTime = params.start;
  delete params.start;

  if (vi.mediaType === 'playlist') {
    params.feature = 'share';
    url += 'https://youtube.com/playlist';
  } else {
    params.v = vi.id;
    url += 'https://youtube.com/watch';
  }

  url += combineParams({
    params: params
  });

  if (vi.mediaType !== 'playlist' && startTime) {
    url += '#t=' + startTime;
  }
  return url;
};

YouTube.prototype.createEmbedUrl = function (vi, params) {
  'use strict';
  var url = '//youtube.com/embed';

  if (vi.mediaType === 'playlist') {
    params.listType = 'playlist';
  } else {
    url += '/' + vi.id;
    //loop hack
    if (params.loop === '1') {
      params.playlist = vi.id;
    }
  }

  url += combineParams({
    params: params
  });

  return url;
};

YouTube.prototype.createImageUrl = function (baseUrl, vi, params) {
  'use strict';
  var url = baseUrl + vi.id + '/';
  var quality = params.imageQuality || this.defaultImageQuality;

  return url + quality + '.jpg';
};

YouTube.prototype.createShortImageUrl = function (vi, params) {
  'use strict';
  return this.createImageUrl('https://i.ytimg.com/vi/', vi, params);
};

YouTube.prototype.createLongImageUrl = function (vi, params) {
  'use strict';
  return this.createImageUrl('https://img.youtube.com/vi/', vi, params);
};

YouTube.prototype.createShareUrl = function (vi, params) {
  'use strict';
  var url = 'https://www.youtube.com/shared';
  params.ci = vi.id;
  url += combineParams({
    params: params
  });
  return url;
};

urlParser.bind(new YouTube());
