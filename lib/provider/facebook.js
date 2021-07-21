const {
  combineParams,
} = require('../util');

function Facebook() {
  //Main urls that the provider users
  this.provider = 'facebook';
  //Alternatives such as shortened versions e.g. youtube.com, youtu.be
  this.alternatives = [];
  this.defaultFormat = 'full';
  //List of formats and their functions
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
  //Set up the videoInfo object with relevant information
  var result = {
    params: params,
    mediaType: this.mediaTypes.VIDEO,
  };

  //Parse the url with regex or the query parameters might contain the id
  var matchVideoId = url.match(
    /videos\/(\d+)/
  );
  result.id = matchVideoId ? matchVideoId[1] : params.v;

  var matchPageId = url.match(
    /(\d+)\/videos/
  );
  result.pageId = matchPageId ? matchPageId[1] : undefined;

  //Return nothing when parsing failed
  if (!result.id) {
    return undefined;
  }

  return result;
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
