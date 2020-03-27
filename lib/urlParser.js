const {
  getQueryParams,
} = require('./util');

function UrlParser() {
  for (const key of [
    'parseProvider',
    'parse',
    'bind',
    'create',
  ]) {
    this[key] = this[key].bind(this);
  }
  this.plugins = {};
}

module.exports = UrlParser;

UrlParser.prototype.parseProvider = function(url) {
  var match = url.match(
    /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(\w+)\./i
  );
  return match ? match[1] : undefined;
};

UrlParser.prototype.parse = function(url) {
  if (typeof url === 'undefined') {
    return undefined;
  }
  var provider = this.parseProvider(url);
  var result;
  var plugin = this.plugins[provider];
  if (!provider || !plugin || !plugin.parse) {
    return undefined;
  }
  result = plugin.parse.call(
    plugin, url, getQueryParams(url)
  );
  if (result) {
    result = removeEmptyParameters(result);
    result.provider = plugin.provider;
  }
  return result;
};

UrlParser.prototype.bind = function(plugin) {
  this.plugins[plugin.provider] = plugin;
  if (plugin.alternatives) {
    for (var i = 0; i < plugin.alternatives.length; i += 1) {
      this.plugins[plugin.alternatives[i]] = plugin;
    }
  }
};

UrlParser.prototype.create = function(op) {
  if (typeof (op) !== 'object' || typeof (op.videoInfo) !== 'object') {
    return undefined;
  }

  var vi = op.videoInfo;
  var params = op.params;
  var plugin = this.plugins[vi.provider];

  params = (params === 'internal') ? vi.params : params || {};

  if (plugin) {
    op.format = op.format || plugin.defaultFormat;
    // eslint-disable-next-line no-prototype-builtins
    if (plugin.formats.hasOwnProperty(op.format)) {
      return plugin.formats[op.format].apply(plugin, [vi, Object.assign({}, params)]);
    }
  }
  return undefined;
};

function removeEmptyParameters(result) {
  if (result.params && Object.keys(result.params).length === 0) {
    delete result.params;
  }
  return result;
}