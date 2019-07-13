const {combineParams} = require('../util');

function Youku() {
  this.provider = 'youku';
  this.defaultFormat = 'long';
  this.formats = {
    embed: this.createEmbedUrl,
    long: this.createLongUrl,
    flash: this.createFlashUrl,
    static: this.createStaticUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Youku;

Youku.prototype.parseUrl = function(url) {
  var match = url.match(
    /(?:(?:embed|sid)\/|v_show\/id_|VideoIDS=)([a-zA-Z0-9]+)/
  );
  return match ? match[1] : undefined;
};

Youku.prototype.parseParameters = function(params) {
  if (params.VideoIDS) {
    delete params.VideoIDS;
  }
  return params;
};

Youku.prototype.parse = function(url, params) {
  var _this = this;
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    id: _this.parseUrl(url),
    params: _this.parseParameters(params),
  };

  if (!result.id) {
    return undefined;
  }
  return result;
};

Youku.prototype.createUrl = function(baseUrl, vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }
  var url = baseUrl + vi.id;

  url += combineParams(params);
  return url;
};


Youku.prototype.createEmbedUrl = function(vi, params) {
  return this.createUrl('http://player.youku.com/embed/', vi, params);
};

Youku.prototype.createLongUrl = function(vi, params) {
  return this.createUrl('http://v.youku.com/v_show/id_', vi, params);
};

Youku.prototype.createStaticUrl = function(vi, params) {
  return this.createUrl(
    'http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=',
    vi, params
  );
};

Youku.prototype.createFlashUrl = function(vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }
  var url = 'http://player.youku.com/player.php/sid/' + vi.id + '/v.swf';

  url += combineParams(params);
  return url;
};

require('../base').bind(new Youku());
