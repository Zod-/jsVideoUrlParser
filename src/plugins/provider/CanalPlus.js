function CanalPlus() {
  'use strict';
  this.provider = 'canalplus';
  this.defaultFormat = 'embed';
  this.formats = {
    embed: this.createEmbedURL
  };
}

CanalPlus.prototype.parseParameters = function (params) {
  'use strict';
  delete params.vid;
  return params;
};

CanalPlus.prototype.parse = function (url, params) {
  'use strict';
  var _this = this;
  var result = {
    mediaType: 'video',
    id: params.vid
  };
  result.params = _this.parseParameters(params);

  if (!result.id) {
    return undefined;
  }
  return result;
};

CanalPlus.prototype.createEmbedURL = function (vi, params) {
  'use strict';
  var url = 'http://player.canalplus.fr/embed/';
  params.vid = vi.id;

  url += combineParams({
    params: params
  });
  return url;
};

urlParser.bind(new CanalPlus());
