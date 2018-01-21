(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.urlParser = factory());
}(this, (function () { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var getQueryParams = function getQueryParams(qs) {
  if (typeof qs !== 'string') {
    return {};
  }

  qs = qs.split('+').join(' ');
  var params = {};
  var match = qs.match(/(?:[?](?:[^=]+)=(?:[^&#]*)(?:[&](?:[^=]+)=(?:[^&#]*))*(?:[#].*)?)|(?:[#].*)/);
  var split;

  if (match === null) {
    return {};
  }

  split = match[0].substr(1).split(/[&#=]/);

  for (var i = 0; i < split.length; i += 2) {
    params[decodeURIComponent(split[i])] = decodeURIComponent(split[i + 1] || '');
  }

  return params;
};

var combineParams = function combineParams(op) {
  if (_typeof(op) !== 'object') {
    return '';
  }

  op.params = op.params || {};
  var combined = '',
      i = 0,
      keys = Object.keys(op.params);

  if (keys.length === 0) {
    return '';
  } //always have parameters in the same order


  keys.sort();

  if (!op.hasParams) {
    combined += '?' + keys[0] + '=' + op.params[keys[0]];
    i += 1;
  }

  for (; i < keys.length; i += 1) {
    combined += '&' + keys[i] + '=' + op.params[keys[i]];
  }

  return combined;
}; //parses strings like 1h30m20s to seconds


var getTime = function getTime(timeString) {
  var totalSeconds = 0;
  var timeValues = {
    's': 1,
    'm': 1 * 60,
    'h': 1 * 60 * 60,
    'd': 1 * 60 * 60 * 24,
    'w': 1 * 60 * 60 * 24 * 7
  };
  var timePairs; //is the format 1h30m20s etc

  if (!timeString.match(/^(\d+[smhdw]?)+$/)) {
    return 0;
  } //expand to "1 h 30 m 20 s" and split


  timeString = timeString.replace(/([smhdw])/g, ' $1 ').trim();
  timePairs = timeString.split(' ');

  for (var i = 0; i < timePairs.length; i += 2) {
    totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs[i + 1] || 's'];
  }

  return totalSeconds;
};

var util = {
  getQueryParams: getQueryParams,
  combineParams: combineParams,
  getTime: getTime
};

var getQueryParams$1 = util.getQueryParams;

function UrlParser() {
  var _arr = ['parseProvider', 'parse', 'bind', 'create'];

  for (var _i = 0; _i < _arr.length; _i++) {
    var key = _arr[_i];
    this[key] = this[key].bind(this);
  }

  this.plugins = {};
}

var urlParser = UrlParser;

UrlParser.prototype.parseProvider = function (url) {
  var match = url.match(/(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(\w+)\./i);
  return match ? match[1] : undefined;
};

UrlParser.prototype.parse = function (url) {
  var provider = this.parseProvider(url);
  var result;
  var plugin = this.plugins[provider];

  if (!provider || !plugin || !plugin.parse) {
    return undefined;
  }

  result = plugin.parse.call(plugin, url, getQueryParams$1(url));

  if (result) {
    result = removeEmptyParameters(result);
    result.provider = plugin.provider;
  }

  return result;
};

UrlParser.prototype.bind = function (plugin) {
  this.plugins[plugin.provider] = plugin;

  if (plugin.alternatives) {
    for (var i = 0; i < plugin.alternatives.length; i += 1) {
      this.plugins[plugin.alternatives[i]] = plugin;
    }
  }
};

UrlParser.prototype.create = function (op) {
  var vi = op.videoInfo;
  var params = op.params;
  var plugin = this.plugins[vi.provider];
  params = params === 'internal' ? vi.params : params || {};

  if (plugin) {
    op.format = op.format || plugin.defaultFormat;

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

var combineParams$1 = util.combineParams;

function CanalPlus() {
  this.provider = 'canalplus';
  this.defaultFormat = 'embed';
  this.formats = {
    embed: this.createEmbedUrl
  };
  this.mediaTypes = {
    VIDEO: 'video'
  };
}

var canalplus = CanalPlus;

CanalPlus.prototype.parseParameters = function (params) {
  delete params.vid;
  return params;
};

CanalPlus.prototype.parse = function (url, params) {
  var _this = this;

  var result = {
    mediaType: this.mediaTypes.VIDEO,
    id: params.vid
  };
  result.params = _this.parseParameters(params);

  if (!result.id) {
    return undefined;
  }

  return result;
};

CanalPlus.prototype.createEmbedUrl = function (vi, params) {
  var url = 'http://player.canalplus.fr/embed/';
  params.vid = vi.id;
  url += combineParams$1({
    params: params
  });
  return url;
};

var combineParams$2 = util.combineParams;

function Coub() {
  this.provider = 'coub';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl
  };
  this.mediaTypes = {
    VIDEO: 'video'
  };
}

var coub = Coub;

Coub.prototype.parseUrl = function (url) {
  var match = url.match(/(?:embed|view)\/([a-zA-Z\d]+)/i);
  return match ? match[1] : undefined;
};

Coub.prototype.parse = function (url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: params,
    id: this.parseUrl(url)
  };

  if (!result.id) {
    return undefined;
  }

  return result;
};

Coub.prototype.createUrl = function (baseUrl, vi, params) {
  var url = baseUrl + vi.id;
  url += combineParams$2({
    params: params
  });
  return url;
};

Coub.prototype.createLongUrl = function (vi, params) {
  return this.createUrl('https://coub.com/view/', vi, params);
};

Coub.prototype.createEmbedUrl = function (vi, params) {
  return this.createUrl('//coub.com/embed/', vi, params);
};

var combineParams$3 = util.combineParams;
var getTime$1 = util.getTime;

function Dailymotion() {
  this.provider = 'dailymotion';
  this.alternatives = ['dai'];
  this.defaultFormat = 'long';
  this.formats = {
    short: this.createShortUrl,
    long: this.createLongUrl,
    embed: this.createEmbedUrl
  };
  this.mediaTypes = {
    VIDEO: 'video'
  };
}

var dailymotion = Dailymotion;

Dailymotion.prototype.parseParameters = function (params) {
  return this.parseTime(params);
};

Dailymotion.prototype.parseTime = function (params) {
  if (params.start) {
    params.start = getTime$1(params.start);
  }

  return params;
};

Dailymotion.prototype.parseUrl = function (url) {
  var match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
  return match ? match[1] : undefined;
};

Dailymotion.prototype.parse = function (url, params) {
  var _this = this;

  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: _this.parseParameters(params),
    id: _this.parseUrl(url)
  };
  return result.id ? result : undefined;
};

Dailymotion.prototype.createUrl = function (base, vi, params) {
  return base + vi.id + combineParams$3({
    params: params
  });
};

Dailymotion.prototype.createShortUrl = function (vi) {
  return this.createUrl('https://dai.ly/', vi, {});
};

Dailymotion.prototype.createLongUrl = function (vi, params) {
  return this.createUrl('https://dailymotion.com/video/', vi, params);
};

Dailymotion.prototype.createEmbedUrl = function (vi, params) {
  return this.createUrl('//www.dailymotion.com/embed/video/', vi, params);
};

var combineParams$4 = util.combineParams;
var getTime$2 = util.getTime;

function Twitch() {
  this.provider = 'twitch';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl
  };
  this.mediaTypes = {
    VIDEO: 'video',
    STREAM: 'stream',
    CLIP: 'clip'
  };
}

var twitch = Twitch;

Twitch.prototype.seperateId = function (id) {
  return {
    pre: id[0],
    id: id.substr(1)
  };
};

Twitch.prototype.parseChannel = function (result, params) {
  var channel = params.channel || params.utm_content || result.channel;
  delete params.utm_content;
  delete params.channel;
  return channel;
};

Twitch.prototype.parseUrl = function (url, result, params) {
  var match;
  match = url.match(/(clips\.)?twitch\.tv\/(?:(?:videos\/(\d+))|(\w+))?/i);

  if (match && match[2]) {
    //video
    result.id = 'v' + match[2];
  } else if (params.video) {
    //video embed
    result.id = params.video;
    delete params.video;
  } else if (params.clip) {
    //clips embed
    result.id = params.clip;
    result.isClip = true;
    delete params.clip;
  } else if (match && match[1] && match[3]) {
    //clips
    result.id = match[3];
    result.isClip = true;
  } else if (match && match[3]) {
    result.channel = match[3];
  }

  return result;
};

Twitch.prototype.parseMediaType = function (result) {
  var mediaType;

  if (result.channel) {
    mediaType = this.mediaTypes.STREAM;
  } else if (result.id) {
    if (result.isClip) {
      mediaType = this.mediaTypes.CLIP;
      delete result.isClip;
    } else {
      mediaType = this.mediaTypes.VIDEO;
    }

    delete result.channel;
  }

  return mediaType;
};

Twitch.prototype.parseParameters = function (params) {
  if (params.t) {
    params.start = getTime$2(params.t);
    delete params.t;
  }

  return params;
};

Twitch.prototype.parse = function (url, params) {
  var _this = this;

  var result = {};
  result = _this.parseUrl(url, result, params);
  result.channel = _this.parseChannel(result, params);
  result.mediaType = _this.parseMediaType(result);
  result.params = _this.parseParameters(params);
  return result.channel || result.id ? result : undefined;
};

Twitch.prototype.createLongUrl = function (vi, params) {
  var url = '';

  if (vi.mediaType === this.mediaTypes.STREAM) {
    url = 'https://twitch.tv/' + vi.channel;
  } else if (vi.mediaType === this.mediaTypes.VIDEO) {
    var sep = this.seperateId(vi.id);
    url = 'https://twitch.tv/videos/' + sep.id;

    if (params.start) {
      params.t = params.start + 's';
      delete params.start;
    }
  } else if (vi.mediaType === this.mediaTypes.CLIP) {
    url = 'https://clips.twitch.tv/' + vi.id;
  }

  url += combineParams$4({
    params: params
  });
  return url;
};

Twitch.prototype.createEmbedUrl = function (vi, params) {
  var url = 'https://player.twitch.tv/';

  if (vi.mediaType === this.mediaTypes.STREAM) {
    params.channel = vi.channel;
  } else if (vi.mediaType === this.mediaTypes.VIDEO) {
    params.video = vi.id;

    if (params.start) {
      params.t = params.start + 's';
      delete params.start;
    }
  } else if (vi.mediaType === this.mediaTypes.CLIP) {
    url = 'https://clips.twitch.tv/embed';
    params.clip = vi.id;
  }

  url += combineParams$4({
    params: params
  });
  return url;
};

var combineParams$5 = util.combineParams;
var getTime$3 = util.getTime;

function Vimeo() {
  this.provider = 'vimeo';
  this.alternatives = ['vimeopro'];
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl
  };
  this.mediaTypes = {
    VIDEO: 'video'
  };
}

var vimeo = Vimeo;

Vimeo.prototype.parseUrl = function (url) {
  var match = url.match(/(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i);
  return match ? match[1] : undefined;
};

Vimeo.prototype.parseParameters = function (params) {
  return this.parseTime(params);
};

Vimeo.prototype.parseTime = function (params) {
  if (params.t) {
    params.start = getTime$3(params.t);
    delete params.t;
  }

  return params;
};

Vimeo.prototype.parse = function (url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: this.parseParameters(params),
    id: this.parseUrl(url)
  };
  return result.id ? result : undefined;
};

Vimeo.prototype.createUrl = function (baseUrl, vi, params) {
  var url = baseUrl + vi.id;
  var startTime = params.start;
  delete params.start;
  url += combineParams$5({
    params: params
  });

  if (startTime) {
    url += '#t=' + startTime;
  }

  return url;
};

Vimeo.prototype.createLongUrl = function (vi, params) {
  return this.createUrl('https://vimeo.com/', vi, params);
};

Vimeo.prototype.createEmbedUrl = function (vi, params) {
  return this.createUrl('//player.vimeo.com/video/', vi, params);
};

var combineParams$6 = util.combineParams;
var getTime$4 = util.getTime;

function Wistia() {
  this.provider = 'wistia';
  this.alternatives = [];
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
    embedjsonp: this.createEmbedJsonpUrl
  };
  this.mediaTypes = {
    VIDEO: 'video',
    EMBEDVIDEO: 'embedvideo'
  };
}

var wistia = Wistia;

Wistia.prototype.parseUrl = function (url, params) {
  var match = url.match(/(?:(?:medias|iframe)\/|wvideo=)([\w-]+)/);
  return match ? match[1] : undefined;
};

Wistia.prototype.parseChannel = function (url, params) {
  var match = url.match(/(?:(?:https?:)?\/\/)?([^.]*)\.wistia\./);
  var channel = match ? match[1] : undefined;

  if (channel === 'fast' || channel === 'content') {
    return undefined;
  }

  return channel;
};

Wistia.prototype.parseParameters = function (params, result) {
  if (params.wtime) {
    params.start = getTime$4(params.wtime);
    delete params.wtime;
  }

  if (params.wvideo === result.id) {
    delete params.wvideo;
  }

  return params;
};

Wistia.prototype.parseMediaType = function (result) {
  if (result.id && result.channel) {
    return this.mediaTypes.VIDEO;
  } else if (result.id) {
    delete result.channel;
    return this.mediaTypes.EMBEDVIDEO;
  } else {
    return undefined;
  }
};

Wistia.prototype.parse = function (url, params) {
  var _this = this;

  var result = {
    params: params,
    id: _this.parseUrl(url),
    channel: _this.parseChannel(url)
  };
  result.params = _this.parseParameters(params, result);
  result.mediaType = _this.parseMediaType(result);

  if (!result.id) {
    return undefined;
  }

  return result;
};

Wistia.prototype.createUrl = function (vi, params, url) {
  if (params.start) {
    params.wtime = params.start;
    delete params.start;
  }

  url += combineParams$6({
    params: params
  });
  return url;
};

Wistia.prototype.createLongUrl = function (vi, params) {
  if (vi.mediaType !== this.mediaTypes.VIDEO) {
    return;
  }

  var url = 'https://' + vi.channel + '.wistia.com/medias/' + vi.id;
  return this.createUrl(vi, params, url);
};

Wistia.prototype.createEmbedUrl = function (vi, params) {
  var url = 'https://fast.wistia.com/embed/iframe/' + vi.id;
  return this.createUrl(vi, params, url);
};

Wistia.prototype.createEmbedJsonpUrl = function (vi, params) {
  return 'https://fast.wistia.com/embed/medias/' + vi.id + '.jsonp';
};

var combineParams$7 = util.combineParams;

function Youku() {
  this.provider = 'youku';
  this.defaultFormat = 'long';
  this.formats = {
    embed: this.createEmbedUrl,
    long: this.createLongUrl,
    flash: this.createFlashUrl,
    static: this.createStaticUrl
  };
  this.mediaTypes = {
    VIDEO: 'video'
  };
}

var youku = Youku;

Youku.prototype.parseUrl = function (url) {
  var match = url.match(/(?:(?:embed|sid)\/|v_show\/id_|VideoIDS=)([a-zA-Z0-9]+)/);
  return match ? match[1] : undefined;
};

Youku.prototype.parseParameters = function (params) {
  if (params.VideoIDS) {
    delete params.VideoIDS;
  }

  return params;
};

Youku.prototype.parse = function (url, params) {
  var _this = this;

  var result = {
    mediaType: this.mediaTypes.VIDEO,
    id: _this.parseUrl(url),
    params: _this.parseParameters(params)
  };

  if (!result.id) {
    return undefined;
  }

  return result;
};

Youku.prototype.createUrl = function (baseUrl, vi, params) {
  var url = baseUrl + vi.id;
  url += combineParams$7({
    params: params
  });
  return url;
};

Youku.prototype.createEmbedUrl = function (vi, params) {
  return this.createUrl('http://player.youku.com/embed/', vi, params);
};

Youku.prototype.createLongUrl = function (vi, params) {
  return this.createUrl('http://v.youku.com/v_show/id_', vi, params);
};

Youku.prototype.createStaticUrl = function (vi, params) {
  return this.createUrl('http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=', vi, params);
};

Youku.prototype.createFlashUrl = function (vi, params) {
  var url = 'http://player.youku.com/player.php/sid/' + vi.id + '/v.swf';
  url += combineParams$7({
    params: params
  });
  return url;
};

var combineParams$8 = util.combineParams;
var getTime$5 = util.getTime;

function YouTube() {
  this.provider = 'youtube';
  this.alternatives = ['youtu', 'ytimg'];
  this.defaultFormat = 'long';
  this.formats = {
    short: this.createShortUrl,
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
    shortImage: this.createShortImageUrl,
    longImage: this.createLongImageUrl
  };
  this.imageQualities = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    DEFAULT: 'default',
    HQDEFAULT: 'hqdefault',
    SDDEFAULT: 'sddefault',
    MQDEFAULT: 'mqdefault',
    MAXRESDEFAULT: 'maxresdefault'
  };
  this.defaultImageQuality = this.imageQualities.HQDEFAULT;
  this.mediaTypes = {
    VIDEO: 'video',
    PLAYLIST: 'playlist',
    SHARE: 'share'
  };
}

var youtube = YouTube;

YouTube.prototype.parseUrl = function (url) {
  var match = url.match(/(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)([\w-]{11})/i);
  return match ? match[1] : undefined;
};

YouTube.prototype.parseParameters = function (params, result) {
  if (params.start || params.t) {
    params.start = getTime$5(params.start || params.t);
    delete params.t;
  }

  if (params.v === result.id) {
    delete params.v;
  }

  if (params.list === result.id) {
    delete params.list;
  }

  return params;
};

YouTube.prototype.parseMediaType = function (result) {
  if (result.params.list) {
    result.list = result.params.list;
    delete result.params.list;
  }

  if (result.id && !result.params.ci) {
    result.mediaType = this.mediaTypes.VIDEO;
  } else if (result.list) {
    delete result.id;
    result.mediaType = this.mediaTypes.PLAYLIST;
  } else if (result.params.ci) {
    delete result.params.ci;
    result.mediaType = this.mediaTypes.SHARE;
  } else {
    return undefined;
  }

  return result;
};

YouTube.prototype.parse = function (url, params) {
  var result = {
    params: params,
    id: this.parseUrl(url)
  };
  result.params = this.parseParameters(params, result);
  result = this.parseMediaType(result);
  return result;
};

YouTube.prototype.createShortUrl = function (vi, params) {
  var url = 'https://youtu.be/' + vi.id;

  if (params.start) {
    url += '#t=' + params.start;
  }

  return url;
};

YouTube.prototype.createLongUrl = function (vi, params) {
  var url = '';
  var startTime = params.start;
  delete params.start;

  if (vi.mediaType === this.mediaTypes.PLAYLIST) {
    params.feature = 'share';
    url += 'https://youtube.com/playlist';
  } else if (vi.mediaType === this.mediaTypes.VIDEO) {
    params.v = vi.id;
    url += 'https://youtube.com/watch';
  } else if (vi.mediaType === this.mediaTypes.SHARE) {
    params.ci = vi.id;
    url += 'https://www.youtube.com/shared';
  }

  if (vi.list) {
    params.list = vi.list;
  }

  url += combineParams$8({
    params: params
  });

  if (vi.mediaType !== this.mediaTypes.PLAYLIST && startTime) {
    url += '#t=' + startTime;
  }

  return url;
};

YouTube.prototype.createEmbedUrl = function (vi, params) {
  var url = '//youtube.com/embed';

  if (vi.mediaType === this.mediaTypes.PLAYLIST) {
    params.listType = 'playlist';
  } else {
    url += '/' + vi.id; //loop hack

    if (params.loop === '1') {
      params.playlist = vi.id;
    }
  }

  if (vi.list) {
    params.list = vi.list;
  }

  url += combineParams$8({
    params: params
  });
  return url;
};

YouTube.prototype.createImageUrl = function (baseUrl, vi, params) {
  var url = baseUrl + vi.id + '/';
  var quality = params.imageQuality || this.defaultImageQuality;
  return url + quality + '.jpg';
};

YouTube.prototype.createShortImageUrl = function (vi, params) {
  return this.createImageUrl('https://i.ytimg.com/vi/', vi, params);
};

YouTube.prototype.createLongImageUrl = function (vi, params) {
  return this.createImageUrl('https://img.youtube.com/vi/', vi, params);
};

var parser = new urlParser();
parser.bind(canalplus);
parser.bind(coub);
parser.bind(dailymotion);
parser.bind(twitch);
parser.bind(vimeo);
parser.bind(wistia);
parser.bind(youku);
parser.bind(youtube);
parser.UrlParser = urlParser;
var src = parser;

return src;

})));
