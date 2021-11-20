const {
  combineParams,
} = require('../util');

function Facebook() {
  this.provider = 'facebook';
  this.alternatives = [];
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    watch: this.createWatchUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Facebook;

Facebook.prototype.parse = function(url, params) {
  var result = {
    params: params,
    mediaType: this.mediaTypes.VIDEO,
  };

  var match = url.match(/(?:\/(\d+))?\/videos(?:\/.*?)?\/(\d+)/i);
  if (match) {
    if (match[1]) {
      result.pageId = match[1];
    }
    result.id = match[2];
  }
  if (params.v && !result.id) {
    result.id = params.v;
    delete params.v;
    result.params = params;
  }

  if (!result.id) {
    return undefined;
  }

  return result;
};

Facebook.prototype.createWatchUrl = function(vi, params) {
  var url = 'https://facebook.com/watch/';

  if (vi.mediaType !== this.mediaTypes.VIDEO || !vi.id) {
    return undefined;
  }
  params = { v: vi.id };
  url += combineParams(params);

  return url;
};

Facebook.prototype.createLongUrl = function(vi, params) {
  var url = 'https://facebook.com/';

  if (vi.pageId) {
    url += vi.pageId;
  } else {
    return undefined;
  }

  if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    url += '/videos/' + vi.id;
  } else {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

require('../base').bind(new Facebook());
