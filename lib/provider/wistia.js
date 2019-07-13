const {
  combineParams,
  getTime,
} = require('../util');

function Wistia() {
  this.provider = 'wistia';
  this.alternatives = [];
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
    embedjsonp: this.createEmbedJsonpUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
    EMBEDVIDEO: 'embedvideo',
  };
}

module.exports = Wistia;

Wistia.prototype.parseUrl = function(url) {
  var match = url.match(
    /(?:(?:medias|iframe)\/|wvideo=)([\w-]+)/
  );
  return match ? match[1] : undefined;
};

Wistia.prototype.parseChannel = function(url) {
  var match = url.match(
    /(?:(?:https?:)?\/\/)?([^.]*)\.wistia\./
  );
  var channel = match ? match[1] : undefined;
  if (channel === 'fast' || channel === 'content') {
    return undefined;
  }
  return channel;
};

Wistia.prototype.parseParameters = function(params, result) {
  if (params.wtime) {
    params.start = getTime(params.wtime);
    delete params.wtime;
  }
  if (params.wvideo === result.id) {
    delete params.wvideo;
  }
  return params;
};

Wistia.prototype.parseMediaType = function(result) {
  if (result.id && result.channel) {
    return this.mediaTypes.VIDEO;
  } else if (result.id) {
    delete result.channel;
    return this.mediaTypes.EMBEDVIDEO;
  } else {
    return undefined;
  }
};

Wistia.prototype.parse = function(url, params) {
  var result = {
    id: this.parseUrl(url),
    channel: this.parseChannel(url),
  };
  result.params = this.parseParameters(params, result);
  result.mediaType = this.parseMediaType(result);

  if (!result.id) {
    return undefined;
  }

  return result;
};

Wistia.prototype.createUrl = function(vi, params, url) {
  if (params.start) {
    params.wtime = params.start;
    delete params.start;
  }

  url += combineParams(params);

  return url;
};

Wistia.prototype.createLongUrl = function(vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }
  var url = 'https://' + vi.channel + '.wistia.com/medias/' + vi.id;
  return this.createUrl(vi, params, url);
};

Wistia.prototype.createEmbedUrl = function(vi, params) {
  if (!vi.id || !(vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.EMBEDVIDEO)) {
    return undefined;
  }
  var url = 'https://fast.wistia.com/embed/iframe/' + vi.id;
  return this.createUrl(vi, params, url);
};

Wistia.prototype.createEmbedJsonpUrl = function(vi) {
  if (!vi.id || !(vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.EMBEDVIDEO)) {
    return undefined;
  }
  return 'https://fast.wistia.com/embed/medias/' + vi.id + '.jsonp';
};

require('../base').bind(new Wistia());