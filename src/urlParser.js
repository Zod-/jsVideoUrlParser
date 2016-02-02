function URLParser() {
  "use strict";
  this.plugins = {};
}
URLParser.prototype.parse = function (url) {
  "use strict";
  var th = this,
    match = url.match(/(?:(?:https?:)?\/\/)?(?:[^\.]+\.)?(\w+)\./i),
    provider = match ? match[1] : undefined,
    result;
  if (match && provider && th.plugins[provider] && th.plugins[provider].parse) {
    result = th.plugins[provider].parse.call(this, url, getQueryParams(url));
    if (result) {
      if (result.params && Object.keys(result.params).length === 0) {
        delete result.params;
      }
      result.provider = th.plugins[provider].provider;
      return result;
    }
  }
  return undefined;
};
URLParser.prototype.bind = function (plugin) {
  "use strict";
  var th = this;
  th.plugins[plugin.provider] = plugin;
  if (plugin.alternatives) {
    for (var i = 0; i < plugin.alternatives.length; i += 1) {
      th.plugins[plugin.alternatives[i]] = plugin;
    }
  }
};
URLParser.prototype.create = function (op) {
  "use strict";
  var th = this,
    vi = op.videoInfo,
    params = op.params,
    plugin = th.plugins[vi.provider];

  params = (params === 'internal') ? vi.params : params || {};

  if (plugin) {
    op.format = op.format || plugin.defaultFormat;
    if (plugin.formats.hasOwnProperty(op.format)) {
      return plugin.formats[op.format](vi, cloneObject(params));
    }
  }
  return undefined;
};
var urlParser = new URLParser();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = urlParser;
}
