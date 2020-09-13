const {
  combineParams,
} = require('../util');

function TikTok() {
  this.provider = 'tiktok';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = TikTok;

TikTok.prototype.parse = function(url, params) {
  var result = {
    params: params,
    mediaType: this.mediaTypes.VIDEO,
  };

  var match = url.match(/@([^/]+)\/video\/(\d{19})/);

  if (!match) {
    return;
  }

  result.channel = match[1];
  result.id = match[2];

  return result;
};

TikTok.prototype.createLongUrl = function(vi, params) {
  var url = '';

  if (vi.mediaType === this.mediaTypes.VIDEO && vi.id && vi.channel) {
    url += `https://www.tiktok.com/@${vi.channel}/video/${vi.id}`;
  } else {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

require('../base').bind(new TikTok());
