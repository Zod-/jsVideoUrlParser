const {
  combineParams,
  getTime,
} = require('../util');

function Facebook() {
  this.provider = 'facebook';
  this.alternatives = [];
  this.defaultFormat = 'full';
  this.formats = {
    full: this.createFullUrl,
    watch: this.createWatchUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Facebook;

Facebook.prototype.parse = function(url, params) {
  var result = {
    params: this.parseParameters(params),
    mediaType: this.mediaTypes.VIDEO,
  };

  var matchVideoId = url.match(
    /videos\/(\d+)/
  );
  result.id = matchVideoId ? matchVideoId[1] : params.v;

  var matchPageId = url.match(
    /(\d+)\/videos/
  );
  result.pageId = matchPageId ? matchPageId[1] : undefined;

  if (!result.id) {
    return undefined;
  }

  return result;
};

Facebook.prototype.parseParameters = function(params) {
  if (params.t) {
    return {
      start: getTime(params.t),
    }
  }
  return {};
};

Facebook.prototype.createWatchUrl = function(vi, params) {
  var url = 'https://www.facebook.com/watch/';

  if (vi.mediaType !== this.mediaTypes.VIDEO || !vi.id) {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

Facebook.prototype.createFullUrl = function(vi, params) {
  var url = 'https://www.facebook.com/';

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
