const { combineParams, getTime } = require('../util');

function Vimeo() {
  this.provider = 'vimeo';
  this.alternatives = ['vimeopro', 'vimeocdn'];
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
    image: this.createImageUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Vimeo;

Vimeo.prototype.parseUrl = function(url, result) {
  var match = url.match(
    /(vimeo(?:cdn|pro)?)\.com\/(?:(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+|staff\/frame)\/)?videos?)\/)?(\d+)(?:_(\d+)(?:x(\d+))?)?(\.\w+)?/i
  );
  if (!match) {
    return result;
  }
  result.id = match[2];
  if (match[1] === 'vimeocdn') {
    if (match[3]) {
      result.imageWidth = parseInt(match[3]);
      if (match[4]) { //height can only be set when width is also set
        result.imageHeight = parseInt(match[4]);
      }
    }
    result.imageExtension = match[5];
  }
  return result;
};

Vimeo.prototype.parseParameters = function(params) {
  return this.parseTime(params);
};

Vimeo.prototype.parseTime = function(params) {
  if (params.t) {
    params.start = getTime(params.t);
    delete params.t;
  }
  return params;
};

Vimeo.prototype.parse = function(url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: this.parseParameters(params),
  };
  result = this.parseUrl(url, result);
  return result.id ? result : undefined;
};

Vimeo.prototype.createUrl = function(baseUrl, vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }

  var url = baseUrl + vi.id;
  var startTime = params.start;
  delete params.start;

  url += combineParams(params);

  if (startTime) {
    url += '#t=' + startTime;
  }
  return url;
};

Vimeo.prototype.createLongUrl = function(vi, params) {
  return this.createUrl('https://vimeo.com/', vi, params);
};

Vimeo.prototype.createEmbedUrl = function(vi, params) {
  return this.createUrl('//player.vimeo.com/video/', vi, params);
};

Vimeo.prototype.createImageUrl = function(vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }

  var url = 'https://i.vimeocdn.com/video/' + vi.id;

  if (vi.imageWidth && vi.imageHeight) {
    url += '_' + vi.imageWidth + 'x' + vi.imageHeight;
  } else if (vi.imageWidth) {
    url += '_' + vi.imageWidth;
  }

  if (vi.imageExtension === undefined) {
    vi.imageExtension = '.webp';
  }
  url += vi.imageExtension;
  delete vi.imageExtension;

  url += combineParams(params);
  return url;
};

require('../base').bind(new Vimeo());
