function YouTube() {
  'use strict';
  this.provider = 'youtube';
  this.alternatives = ['youtu'];
  this.defaultFormat = 'long';
  this.formats = {
    short: this.createShortURL,
    long: this.createLongURL,
    embed: this.createEmbedURL
  };
}

YouTube.prototype.parseUrl = function (url) {
  'use strict';
  var match = url.match(
    /(?:(?:v|be|videos|embed)\/(?!videoseries)|v=)([\w\-]{11})/i
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
  if (result.id) {
    result.mediaType = 'video';
  } else if (result.params.list) {
    delete result.id;
    result.mediaType = 'playlist';
  } else {
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

YouTube.prototype.createShortURL = function (vi, params) {
  'use strict';
  var url = 'https://youtu.be/' + vi.id;
  if (params.start) {
    url += '#t=' + params.start;
  }
  return url;
};

YouTube.prototype.createLongURL = function (vi, params) {
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

YouTube.prototype.createEmbedURL = function (vi, params) {
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

urlParser.bind(new YouTube());
