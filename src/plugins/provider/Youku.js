function Youku() {
  'use strict';
  this.provider = 'youku';
  this.defaultFormat = 'embed';
  this.formats = {
    embed: this.createEmbedURL
  };
}

Youku.prototype.parseUrl = function (url) {
  'use strict';
  var match = url.match(
    /(?:embed\/|sid\/|v_show\/id_)(\w+)/
  );
  return match ? match[1] : undefined;
};

Youku.prototype.parse = function(url, params) {
  'use strict';
  var _this = this;
  var result = {
    mediaType: 'video',
    id: _this.parseUrl(url),
    params: params
  };

  if (!result.id) {
    return undefined;
  }
  return result;
};

Youku.prototype.createEmbedURL = function(vi, params) {
  'use strict';
  var url = 'http://player.youku.com/embed/' + vi.id;

  url += combineParams({
    params: params
  });
  return url;
};

urlParser.bind(new Youku());
