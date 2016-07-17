function URLParser() {
  'use strict';
  this.plugins = {};
}

URLParser.prototype.parseProvider = function (url) {
  'use strict';
  var match = url.match(
    /(?:(?:https?:)?\/\/)?(?:[^\.]+\.)?(\w+)\./i
  );
  return match ? match[1] : undefined;
};

URLParser.prototype.removeEmptyParameters = function (result) {
  'use strict';
  if (result.params && Object.keys(result.params).length === 0) {
    delete result.params;
  }
  return result;
};

URLParser.prototype.parse = function (url) {
  'use strict';
  var _this = this;
  var provider = _this.parseProvider(url);
  var result;
  var plugin = _this.plugins[provider];
  if (!provider || !plugin || !plugin.parse) {
    return undefined;
  }
  result = plugin.parse.apply(
    plugin, [url, getQueryParams(url)]
  );
  if (result) {
    result = _this.removeEmptyParameters(result);
    result.provider = plugin.provider;
  }
  return result;
};

URLParser.prototype.bind = function (plugin) {
  'use strict';
  this.plugins[plugin.provider] = plugin;
  if (plugin.alternatives) {
    for (var i = 0; i < plugin.alternatives.length; i += 1) {
      this.plugins[plugin.alternatives[i]] = plugin;
    }
  }
};

URLParser.prototype.create = function (op) {
  'use strict';
  var vi = op.videoInfo;
  var params = op.params;
  var plugin = this.plugins[vi.provider];

  params = (params === 'internal') ? vi.params : params || {};

  if (plugin) {
    op.format = op.format || plugin.defaultFormat;
    if (plugin.formats.hasOwnProperty(op.format)) {
      return plugin.formats[op.format].apply(plugin, [vi, cloneObject(params)]);
    }
  }
  return undefined;
};
var urlParser = new URLParser();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = urlParser;
}
