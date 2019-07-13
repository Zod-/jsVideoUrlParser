const { combineParams } = require('../util');

function Coub() {
  this.provider = 'coub';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Coub;

Coub.prototype.parseUrl = function(url) {
  var match = url.match(
    /(?:embed|view)\/([a-zA-Z\d]+)/i
  );
  return match ? match[1] : undefined;
};

Coub.prototype.parse = function(url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: params,
    id: this.parseUrl(url),
  };

  if (!result.id) {
    return undefined;
  }
  return result;
};

Coub.prototype.createUrl = function(baseUrl, vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }
  var url = baseUrl + vi.id;
  url += combineParams(params);
  return url;
};

Coub.prototype.createLongUrl = function(vi, params) {
  return this.createUrl('https://coub.com/view/', vi, params);
};

Coub.prototype.createEmbedUrl = function(vi, params) {
  return this.createUrl('//coub.com/embed/', vi, params);
};

require('../base').bind(new Coub());
