const { combineParams, getTime } = require('../util');

function Vimeo() {
  this.provider = 'vimeo';
  this.alternatives = ['vimeopro'];
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Vimeo;

Vimeo.prototype.parseUrl = function(url) {
  var match = url.match(
    /(?:\/showcase\/\d+)?(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i
  );
  return match ? match[1] : undefined;
};

Vimeo.prototype.parseHash = function(url) {
  var match = url.match(/\/\d+\/(\w+)$/i);
  return match ? match[1] : undefined;
};

Vimeo.prototype.parseParameters = function(params) {
  if (params.t) {
    params.start = getTime(params.t);
    delete params.t;
  }
  if (params.h) {
    params.hash = params.h;
    delete params.h;
  }
  return params;
};

Vimeo.prototype.parse = function(url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: this.parseParameters(params),
    id: this.parseUrl(url),
  };
  var hash = this.parseHash(url, params);
  if (hash) {
    result.params.hash = hash;
  }
  return result.id ? result : undefined;
};

Vimeo.prototype.createUrl = function(baseUrl, vi, params, type) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }

  var url = baseUrl + vi.id;
  var startTime = params.start;
  delete params.start;

  if (params.hash) {
    if (type === 'embed') {
      params.h = params.hash;
    } else if (type === 'long') {
      url += '/' + params.hash;
    }
    delete params.hash;
  }

  url += combineParams(params);

  if (startTime) {
    url += '#t=' + startTime;
  }
  return url;
};

Vimeo.prototype.createLongUrl = function(vi, params) {
  return this.createUrl('https://vimeo.com/', vi, params, 'long');
};

Vimeo.prototype.createEmbedUrl = function(vi, params) {
  return this.createUrl('//player.vimeo.com/video/', vi, params, 'embed');
};

require('../base').bind(new Vimeo());
