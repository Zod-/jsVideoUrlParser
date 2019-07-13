const { combineParams } = require('../util');

function CanalPlus() {
  this.provider = 'canalplus';
  this.defaultFormat = 'embed';
  this.formats = {
    embed: this.createEmbedUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = CanalPlus;

CanalPlus.prototype.parseParameters = function(params) {
  delete params.vid;
  return params;
};

CanalPlus.prototype.parse = function(url, params) {
  var _this = this;
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    id: params.vid,
  };
  result.params = _this.parseParameters(params);

  if (!result.id) {
    return undefined;
  }
  return result;
};

CanalPlus.prototype.createEmbedUrl = function(vi, params) {
  if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
    return undefined;
  }
  var url = 'http://player.canalplus.fr/embed/';
  params.vid = vi.id;

  url += combineParams(params);
  return url;
};

require('../base').bind(new CanalPlus());
