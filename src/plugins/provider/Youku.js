function Youku() {
  'use strict';
  this.provider = 'youku';
  this.defaultFormat = 'embed';
  this.formats = {
    embed: this.createEmbedURL,
    long: this.createLongURL,
    flash: this.createFlashURL,
    static: this.createStaticURL
  };
}

Youku.prototype.parseUrl = function (url) {
  'use strict';
  var match = url.match(
    /(?:(?:embed|sid)\/|v_show\/id_|VideoIDS=)([a-zA-Z0-9]+)/
  );
  return match ? match[1] : undefined;
};

Youku.prototype.parseParameters = function (params) {
  'use strict';
  if (params.VideoIDS) {
    delete params.VideoIDS;
  }
  return params;
};

Youku.prototype.parse = function(url, params) {
  'use strict';
  var _this = this;
  var result = {
    mediaType: 'video',
    id: _this.parseUrl(url),
    params: _this.parseParameters(params)
  };

  if (!result.id) {
    return undefined;
  }
  return result;
};

Youku.prototype.createURL = function(baseURL, vi, params) {
  'use strict';
  var url = baseURL + vi.id;

  url += combineParams({
    params: params
  });
  return url;
};


Youku.prototype.createEmbedURL = function(vi, params) {
  'use strict';
  return this.createURL('http://player.youku.com/embed/', vi, params);
};

Youku.prototype.createLongURL = function(vi, params) {
  'use strict';
  return this.createURL('http://v.youku.com/v_show/id_', vi, params);
};

Youku.prototype.createStaticURL = function(vi, params) {
  'use strict';
  return this.createURL(
    'http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=',
    vi, params
  );
};

Youku.prototype.createFlashURL = function(vi, params) {
  'use strict';
  var url = 'http://player.youku.com/player.php/sid/' + vi.id + '/v.swf';

  url += combineParams({
    params: params
  });
  return url;
};

urlParser.bind(new Youku());
