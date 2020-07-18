const {
  combineParams,
} = require('../util');

function TikTok() {
  //Main urls that the provider users
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
  if (
    url.startsWith('http://wwww.tiktok.com/') ||
    url.startsWith('http://tiktok.com/') ||
    url.startsWith('https://www.tiktok.com/') ||
    url.startsWith('https://tiktok.com/') ||
    url.startsWith('www.tiktok.com/') ||
    url.startsWith('tiktok.com/')
  ) {
    var split = url.split('tiktok.com/');
    var res = split[1] ? split[1].split('/video/') : undefined;
    if (!res) {
      return undefined;
    }
    console.log('sisi', res);
    result.channel = res[0].replace('@', '');
    result.id = res[1];
  } else {
    return undefined;
  }

  if (!result.id) {
    return undefined;
  }

  if (!result.channel) {
    return undefined;
  }

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
