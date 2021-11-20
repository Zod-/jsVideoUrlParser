(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.urlParser = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

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

  var combineParams = function combineParams(params, hasParams) {
    if (_typeof(params) !== 'object') {
      return '';
    }

    var combined = '';
    var i = 0;
    var keys = Object.keys(params);

    if (keys.length === 0) {
      return '';
    } //always have parameters in the same order


    keys.sort();

    if (!hasParams) {
      combined += '?' + keys[0] + '=' + params[keys[0]];
      i += 1;
    }

    for (; i < keys.length; i += 1) {
      combined += '&' + keys[i] + '=' + params[keys[i]];
    }

    return combined;
  }; //parses strings like 1h30m20s to seconds


  function getLetterTime(timeString) {
    var totalSeconds = 0;
    var timeValues = {
      's': 1,
      'm': 1 * 60,
      'h': 1 * 60 * 60,
      'd': 1 * 60 * 60 * 24,
      'w': 1 * 60 * 60 * 24 * 7
    };
    var timePairs; //expand to "1 h 30 m 20 s" and split

    timeString = timeString.replace(/([smhdw])/g, ' $1 ').trim();
    timePairs = timeString.split(' ');

    for (var i = 0; i < timePairs.length; i += 2) {
      totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs[i + 1] || 's'];
    }

    return totalSeconds;
  } //parses strings like 1:30:20 to seconds


  function getColonTime(timeString) {
    var totalSeconds = 0;
    var timeValues = [1, 1 * 60, 1 * 60 * 60, 1 * 60 * 60 * 24, 1 * 60 * 60 * 24 * 7];
    var timePairs = timeString.split(':');

    for (var i = 0; i < timePairs.length; i++) {
      totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs.length - i - 1];
    }

    return totalSeconds;
  }

  var getTime = function getTime(timeString) {
    if (typeof timeString === 'undefined') {
      return 0;
    }

    if (timeString.match(/^(\d+[smhdw]?)+$/)) {
      return getLetterTime(timeString);
    }

    if (timeString.match(/^(\d+:?)+$/)) {
      return getColonTime(timeString);
    }

    return 0;
  };

  var util = {
    getQueryParams: getQueryParams,
    combineParams: combineParams,
    getTime: getTime
  };

  var getQueryParams$1 = util.getQueryParams;

  function UrlParser() {
    for (var _i = 0, _arr = ['parseProvider', 'parse', 'bind', 'create']; _i < _arr.length; _i++) {
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
    if (typeof url === 'undefined') {
      return undefined;
    }

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
    if (_typeof(op) !== 'object' || _typeof(op.videoInfo) !== 'object') {
      return undefined;
    }

    var vi = op.videoInfo;
    var params = op.params;
    var plugin = this.plugins[vi.provider];
    params = params === 'internal' ? vi.params : params || {};

    if (plugin) {
      op.format = op.format || plugin.defaultFormat; // eslint-disable-next-line no-prototype-builtins

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

  var parser = new urlParser();
  var base = parser;

  function Allocine() {
    this.provider = 'allocine';
    this.alternatives = [];
    this.defaultFormat = 'embed';
    this.formats = {
      embed: this.createEmbedUrl
    };
    this.mediaTypes = {
      VIDEO: 'video'
    };
  }

  Allocine.prototype.parseUrl = function (url) {
    var match = url.match(/(?:\/video\/player_gen_cmedia=)([A-Za-z0-9]+)/i);
    return match ? match[1] : undefined;
  };

  Allocine.prototype.parse = function (url) {
    var result = {
      mediaType: this.mediaTypes.VIDEO,
      id: this.parseUrl(url)
    };
    return result.id ? result : undefined;
  };

  Allocine.prototype.createEmbedUrl = function (vi) {
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    return 'https://player.allocine.fr/' + vi.id + '.html';
  };

  base.bind(new Allocine());

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
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    var url = 'http://player.canalplus.fr/embed/';
    params.vid = vi.id;
    url += combineParams$1(params);
    return url;
  };

  base.bind(new CanalPlus());

  var combineParams$2 = util.combineParams;

  function Coub() {
    this.provider = 'coub';
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl,
      embed: this.createEmbedUrl
    };
    this.mediaTypes = {
      VIDEO: 'video'
    };
  }

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
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    var url = baseUrl + vi.id;
    url += combineParams$2(params);
    return url;
  };

  Coub.prototype.createLongUrl = function (vi, params) {
    return this.createUrl('https://coub.com/view/', vi, params);
  };

  Coub.prototype.createEmbedUrl = function (vi, params) {
    return this.createUrl('//coub.com/embed/', vi, params);
  };

  base.bind(new Coub());

  var combineParams$3 = util.combineParams,
      getTime$1 = util.getTime;

  function Dailymotion() {
    this.provider = 'dailymotion';
    this.alternatives = ['dai'];
    this.defaultFormat = 'long';
    this.formats = {
      "short": this.createShortUrl,
      "long": this.createLongUrl,
      embed: this.createEmbedUrl,
      image: this.createImageUrl
    };
    this.mediaTypes = {
      VIDEO: 'video'
    };
  }

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
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    return base + vi.id + combineParams$3(params);
  };

  Dailymotion.prototype.createShortUrl = function (vi, params) {
    return this.createUrl('https://dai.ly/', vi, params);
  };

  Dailymotion.prototype.createLongUrl = function (vi, params) {
    return this.createUrl('https://dailymotion.com/video/', vi, params);
  };

  Dailymotion.prototype.createEmbedUrl = function (vi, params) {
    return this.createUrl('https://www.dailymotion.com/embed/video/', vi, params);
  };

  Dailymotion.prototype.createImageUrl = function (vi, params) {
    delete params.start;
    return this.createUrl('https://www.dailymotion.com/thumbnail/video/', vi, params);
  };

  base.bind(new Dailymotion());

  var combineParams$4 = util.combineParams;

  function Loom() {
    this.provider = 'loom';
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl,
      embed: this.createEmbedUrl
    };
    this.mediaTypes = {
      VIDEO: 'video'
    };
  }

  Loom.prototype.parseUrl = function (url) {
    var match = url.match(/(?:share|embed)\/([a-zA-Z\d]+)/i);
    return match ? match[1] : undefined;
  };

  Loom.prototype.parse = function (url, params) {
    var result = {
      mediaType: this.mediaTypes.VIDEO,
      params: params,
      id: this.parseUrl(url)
    };
    return result.id ? result : undefined;
  };

  Loom.prototype.createUrl = function (baseUrl, vi, params) {
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    var url = baseUrl + vi.id;
    url += combineParams$4(params);
    return url;
  };

  Loom.prototype.createLongUrl = function (vi, params) {
    return this.createUrl('https://loom.com/share/', vi, params);
  };

  Loom.prototype.createEmbedUrl = function (vi, params) {
    return this.createUrl('//loom.com/embed/', vi, params);
  };

  base.bind(new Loom());

  var combineParams$5 = util.combineParams,
      getTime$2 = util.getTime;

  function Twitch() {
    this.provider = 'twitch';
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl,
      embed: this.createEmbedUrl
    };
    this.mediaTypes = {
      VIDEO: 'video',
      STREAM: 'stream',
      CLIP: 'clip'
    };
  }

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
    match = url.match(/(clips\.)?twitch\.tv\/(?:(?:videos\/(\d+))|(\w+(?:-[\w\d-]+)?)(?:\/clip\/(\w+))?)/i);

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
      //clips.twitch.tv/id
      result.id = match[3];
      result.isClip = true;
    } else if (match && match[3] && match[4]) {
      //twitch.tv/channel/clip/id
      result.channel = match[3];
      result.id = match[4];
      result.isClip = true;
    } else if (match && match[3]) {
      result.channel = match[3];
    }

    return result;
  };

  Twitch.prototype.parseMediaType = function (result) {
    var mediaType;

    if (result.id) {
      if (result.isClip) {
        mediaType = this.mediaTypes.CLIP;
        delete result.isClip;
      } else {
        mediaType = this.mediaTypes.VIDEO;
      }
    } else if (result.channel) {
      mediaType = this.mediaTypes.STREAM;
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

    if (vi.mediaType === this.mediaTypes.STREAM && vi.channel) {
      url = 'https://twitch.tv/' + vi.channel;
    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
      var sep = this.seperateId(vi.id);
      url = 'https://twitch.tv/videos/' + sep.id;

      if (params.start) {
        params.t = params.start + 's';
        delete params.start;
      }
    } else if (vi.mediaType === this.mediaTypes.CLIP && vi.id) {
      if (vi.channel) {
        url = 'https://www.twitch.tv/' + vi.channel + '/clip/' + vi.id;
      } else {
        url = 'https://clips.twitch.tv/' + vi.id;
      }
    } else {
      return undefined;
    }

    url += combineParams$5(params);
    return url;
  };

  Twitch.prototype.createEmbedUrl = function (vi, params) {
    var url = 'https://player.twitch.tv/';

    if (vi.mediaType === this.mediaTypes.STREAM && vi.channel) {
      params.channel = vi.channel;
    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
      params.video = vi.id;

      if (params.start) {
        params.t = params.start + 's';
        delete params.start;
      }
    } else if (vi.mediaType === this.mediaTypes.CLIP && vi.id) {
      url = 'https://clips.twitch.tv/embed';
      params.clip = vi.id;
    } else {
      return undefined;
    }

    url += combineParams$5(params);
    return url;
  };

  base.bind(new Twitch());

  var combineParams$6 = util.combineParams,
      getTime$3 = util.getTime;

  function Vimeo() {
    this.provider = 'vimeo';
    this.alternatives = ['vimeopro'];
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl,
      embed: this.createEmbedUrl
    };
    this.mediaTypes = {
      VIDEO: 'video'
    };
  }

  Vimeo.prototype.parseUrl = function (url) {
    var match = url.match(/(?:\/showcase\/\d+)?(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i);
    return match ? match[1] : undefined;
  };

  Vimeo.prototype.parseHash = function (url) {
    var match = url.match(/\/\d+\/(\w+)$/i);
    return match ? match[1] : undefined;
  };

  Vimeo.prototype.parseParameters = function (params) {
    if (params.t) {
      params.start = getTime$3(params.t);
      delete params.t;
    }

    if (params.h) {
      params.hash = params.h;
      delete params.h;
    }

    return params;
  };

  Vimeo.prototype.parse = function (url, params) {
    var result = {
      mediaType: this.mediaTypes.VIDEO,
      params: this.parseParameters(params),
      id: this.parseUrl(url)
    };
    var hash = this.parseHash(url, params);

    if (hash) {
      result.params.hash = hash;
    }

    return result.id ? result : undefined;
  };

  Vimeo.prototype.createUrl = function (baseUrl, vi, params, type) {
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    var url = baseUrl + vi.id;
    var startTime = params.start;
    delete params.start;

    if (params.hash) {
      if (type === 'embed') {
        params.h = params.hash;
      } else if (type === 'long') {
        url += '/' + params.hash;
      }

      delete params.hash;
    }

    url += combineParams$6(params);

    if (startTime) {
      url += '#t=' + startTime;
    }

    return url;
  };

  Vimeo.prototype.createLongUrl = function (vi, params) {
    return this.createUrl('https://vimeo.com/', vi, params, 'long');
  };

  Vimeo.prototype.createEmbedUrl = function (vi, params) {
    return this.createUrl('//player.vimeo.com/video/', vi, params, 'embed');
  };

  base.bind(new Vimeo());

  var combineParams$7 = util.combineParams,
      getTime$4 = util.getTime;

  function Wistia() {
    this.provider = 'wistia';
    this.alternatives = [];
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl,
      embed: this.createEmbedUrl,
      embedjsonp: this.createEmbedJsonpUrl
    };
    this.mediaTypes = {
      VIDEO: 'video',
      EMBEDVIDEO: 'embedvideo'
    };
  }

  Wistia.prototype.parseUrl = function (url) {
    var match = url.match(/(?:(?:medias|iframe)\/|wvideo=)([\w-]+)/);
    return match ? match[1] : undefined;
  };

  Wistia.prototype.parseChannel = function (url) {
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
    var result = {
      id: this.parseUrl(url),
      channel: this.parseChannel(url)
    };
    result.params = this.parseParameters(params, result);
    result.mediaType = this.parseMediaType(result);

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

    url += combineParams$7(params);
    return url;
  };

  Wistia.prototype.createLongUrl = function (vi, params) {
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    var url = 'https://' + vi.channel + '.wistia.com/medias/' + vi.id;
    return this.createUrl(vi, params, url);
  };

  Wistia.prototype.createEmbedUrl = function (vi, params) {
    if (!vi.id || !(vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.EMBEDVIDEO)) {
      return undefined;
    }

    var url = 'https://fast.wistia.com/embed/iframe/' + vi.id;
    return this.createUrl(vi, params, url);
  };

  Wistia.prototype.createEmbedJsonpUrl = function (vi) {
    if (!vi.id || !(vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.EMBEDVIDEO)) {
      return undefined;
    }

    return 'https://fast.wistia.com/embed/medias/' + vi.id + '.jsonp';
  };

  base.bind(new Wistia());

  var combineParams$8 = util.combineParams;

  function Youku() {
    this.provider = 'youku';
    this.defaultFormat = 'long';
    this.formats = {
      embed: this.createEmbedUrl,
      "long": this.createLongUrl,
      flash: this.createFlashUrl,
      "static": this.createStaticUrl
    };
    this.mediaTypes = {
      VIDEO: 'video'
    };
  }

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
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    var url = baseUrl + vi.id;
    url += combineParams$8(params);
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
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

    var url = 'http://player.youku.com/player.php/sid/' + vi.id + '/v.swf';
    url += combineParams$8(params);
    return url;
  };

  base.bind(new Youku());

  var combineParams$9 = util.combineParams,
      getTime$5 = util.getTime;

  function YouTube() {
    this.provider = 'youtube';
    this.alternatives = ['youtu', 'ytimg'];
    this.defaultFormat = 'long';
    this.formats = {
      "short": this.createShortUrl,
      "long": this.createLongUrl,
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
      SHARE: 'share',
      CHANNEL: 'channel'
    };
  }

  YouTube.prototype.parseVideoUrl = function (url) {
    var match = url.match(/(?:(?:v|vi|be|videos|embed)\/(?!videoseries)|(?:v|ci)=)([\w-]{11})/i);
    return match ? match[1] : undefined;
  };

  YouTube.prototype.parseChannelUrl = function (url) {
    // Match an opaque channel ID
    var match = url.match(/\/channel\/([\w-]+)/);

    if (match) {
      return {
        id: match[1],
        mediaType: this.mediaTypes.CHANNEL
      };
    } // Match a vanity channel name or a user name. User urls are deprecated and
    // currently redirect to the channel of that same name.


    match = url.match(/\/(?:c|user)\/([\w-]+)/);

    if (match) {
      return {
        name: match[1],
        mediaType: this.mediaTypes.CHANNEL
      };
    }
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
    var channelResult = this.parseChannelUrl(url);

    if (channelResult) {
      return channelResult;
    } else {
      var result = {
        params: params,
        id: this.parseVideoUrl(url)
      };
      result.params = this.parseParameters(params, result);
      result = this.parseMediaType(result);
      return result;
    }
  };

  YouTube.prototype.createShortUrl = function (vi, params) {
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

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

    if (vi.mediaType === this.mediaTypes.CHANNEL) {
      if (vi.id) {
        url += 'https://www.youtube.com/channel/' + vi.id;
      } else if (vi.name) {
        url += 'https://www.youtube.com/c/' + vi.name;
      } else {
        return undefined;
      }
    } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list) {
      params.feature = 'share';
      url += 'https://www.youtube.com/playlist';
    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
      params.v = vi.id;
      url += 'https://www.youtube.com/watch';
    } else if (vi.mediaType === this.mediaTypes.SHARE && vi.id) {
      params.ci = vi.id;
      url += 'https://www.youtube.com/shared';
    } else {
      return undefined;
    }

    if (vi.list) {
      params.list = vi.list;
    }

    url += combineParams$9(params);

    if (vi.mediaType !== this.mediaTypes.PLAYLIST && startTime) {
      url += '#t=' + startTime;
    }

    return url;
  };

  YouTube.prototype.createEmbedUrl = function (vi, params) {
    var url = 'https://www.youtube.com/embed';

    if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list) {
      params.listType = 'playlist';
    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
      url += '/' + vi.id; //loop hack

      if (params.loop === '1') {
        params.playlist = vi.id;
      }
    } else {
      return undefined;
    }

    if (vi.list) {
      params.list = vi.list;
    }

    url += combineParams$9(params);
    return url;
  };

  YouTube.prototype.createImageUrl = function (baseUrl, vi, params) {
    if (!vi.id || vi.mediaType !== this.mediaTypes.VIDEO) {
      return undefined;
    }

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

  base.bind(new YouTube());

  var combineParams$a = util.combineParams,
      getTime$6 = util.getTime;

  function SoundCloud() {
    this.provider = 'soundcloud';
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl,
      embed: this.createEmbedUrl
    };
    this.mediaTypes = {
      TRACK: 'track',
      PLAYLIST: 'playlist',
      APITRACK: 'apitrack',
      APIPLAYLIST: 'apiplaylist'
    };
  }

  SoundCloud.prototype.parseUrl = function (url, result) {
    var match = url.match(/(?:m\.)?soundcloud\.com\/(?:([\w-]+)\/(sets\/)?)([\w-]+)/i);

    if (!match) {
      return result;
    }

    result.channel = match[1];

    if (match[1] === 'playlists' || match[2]) {
      //playlist
      result.list = match[3];
    } else {
      //track
      result.id = match[3];
    }

    return result;
  };

  SoundCloud.prototype.parseParameters = function (params) {
    if (params.t) {
      params.start = getTime$6(params.t);
      delete params.t;
    }

    return params;
  };

  SoundCloud.prototype.parseMediaType = function (result) {
    if (result.id) {
      if (result.channel === 'tracks') {
        delete result.channel;
        delete result.params.url;
        result.mediaType = this.mediaTypes.APITRACK;
      } else {
        result.mediaType = this.mediaTypes.TRACK;
      }
    }

    if (result.list) {
      if (result.channel === 'playlists') {
        delete result.channel;
        delete result.params.url;
        result.mediaType = this.mediaTypes.APIPLAYLIST;
      } else {
        result.mediaType = this.mediaTypes.PLAYLIST;
      }
    }

    return result;
  };

  SoundCloud.prototype.parse = function (url, params) {
    var result = {};
    result = this.parseUrl(url, result);
    result.params = this.parseParameters(params);
    result = this.parseMediaType(result);

    if (!result.id && !result.list) {
      return undefined;
    }

    return result;
  };

  SoundCloud.prototype.createLongUrl = function (vi, params) {
    var url = '';
    var startTime = params.start;
    delete params.start;

    if (vi.mediaType === this.mediaTypes.TRACK && vi.id && vi.channel) {
      url = 'https://soundcloud.com/' + vi.channel + '/' + vi.id;
    } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list && vi.channel) {
      url = 'https://soundcloud.com/' + vi.channel + '/sets/' + vi.list;
    } else if (vi.mediaType === this.mediaTypes.APITRACK && vi.id) {
      url = 'https://api.soundcloud.com/tracks/' + vi.id;
    } else if (vi.mediaType === this.mediaTypes.APIPLAYLIST && vi.list) {
      url = 'https://api.soundcloud.com/playlists/' + vi.list;
    } else {
      return undefined;
    }

    url += combineParams$a(params);

    if (startTime) {
      url += '#t=' + startTime;
    }

    return url;
  };

  SoundCloud.prototype.createEmbedUrl = function (vi, params) {
    var url = 'https://w.soundcloud.com/player/';
    delete params.start;

    if (vi.mediaType === this.mediaTypes.APITRACK && vi.id) {
      params.url = 'https%3A//api.soundcloud.com/tracks/' + vi.id;
    } else if (vi.mediaType === this.mediaTypes.APIPLAYLIST && vi.list) {
      params.url = 'https%3A//api.soundcloud.com/playlists/' + vi.list;
    } else {
      return undefined;
    }

    url += combineParams$a(params);
    return url;
  };

  base.bind(new SoundCloud());

  var combineParams$b = util.combineParams;

  function TeacherTube() {
    this.provider = 'teachertube';
    this.alternatives = [];
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl,
      embed: this.createEmbedUrl
    };
    this.mediaTypes = {
      VIDEO: 'video',
      AUDIO: 'audio',
      DOCUMENT: 'document',
      CHANNEL: 'channel',
      COLLECTION: 'collection',
      GROUP: 'group'
    };
  }

  TeacherTube.prototype.parse = function (url, params) {
    var result = {};
    result.list = this.parsePlaylist(params);
    result.params = params;
    var match = url.match(/\/(audio|video|document|user\/channel|collection|group)\/(?:[\w-]+-)?(\w+)/);

    if (!match) {
      return undefined;
    }

    result.mediaType = this.parseMediaType(match[1]);
    result.id = match[2];
    return result;
  };

  TeacherTube.prototype.parsePlaylist = function (params) {
    if (params['playlist-id']) {
      var list = params['playlist-id'];
      delete params['playlist-id'];
      return list;
    }

    return undefined;
  };

  TeacherTube.prototype.parseMediaType = function (mediaTypeMatch) {
    switch (mediaTypeMatch) {
      case 'audio':
        return this.mediaTypes.AUDIO;

      case 'video':
        return this.mediaTypes.VIDEO;

      case 'document':
        return this.mediaTypes.DOCUMENT;

      case 'user/channel':
        return this.mediaTypes.CHANNEL;

      case 'collection':
        return this.mediaTypes.COLLECTION;

      case 'group':
        return this.mediaTypes.GROUP;
    }
  };

  TeacherTube.prototype.createLongUrl = function (vi, params) {
    if (!vi.id) {
      return undefined;
    }

    var url = 'https://www.teachertube.com/';

    if (vi.list) {
      params['playlist-id'] = vi.list;
    }

    if (vi.mediaType === this.mediaTypes.CHANNEL) {
      url += 'user/channel/';
    } else {
      url += vi.mediaType + '/';
    }

    url += vi.id;
    url += combineParams$b(params);
    return url;
  };

  TeacherTube.prototype.createEmbedUrl = function (vi, params) {
    if (!vi.id) {
      return undefined;
    }

    var url = 'https://www.teachertube.com/embed/';

    if (vi.mediaType === this.mediaTypes.VIDEO || vi.mediaType === this.mediaTypes.AUDIO) {
      url += vi.mediaType + '/' + vi.id;
    } else {
      return undefined;
    }

    url += combineParams$b(params);
    return url;
  };

  base.bind(new TeacherTube());

  var combineParams$c = util.combineParams;

  function TikTok() {
    this.provider = 'tiktok';
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl
    };
    this.mediaTypes = {
      VIDEO: 'video'
    };
  }

  TikTok.prototype.parse = function (url, params) {
    var result = {
      params: params,
      mediaType: this.mediaTypes.VIDEO
    };
    var match = url.match(/@([^/]+)\/video\/(\d{19})/);

    if (!match) {
      return;
    }

    result.channel = match[1];
    result.id = match[2];
    return result;
  };

  TikTok.prototype.createLongUrl = function (vi, params) {
    var url = '';

    if (vi.mediaType === this.mediaTypes.VIDEO && vi.id && vi.channel) {
      url += "https://www.tiktok.com/@".concat(vi.channel, "/video/").concat(vi.id);
    } else {
      return undefined;
    }

    url += combineParams$c(params);
    return url;
  };

  base.bind(new TikTok());

  var combineParams$d = util.combineParams;

  function Ted() {
    this.provider = 'ted';
    this.formats = {
      "long": this.createLongUrl,
      embed: this.createEmbedUrl
    };
    this.mediaTypes = {
      VIDEO: 'video',
      PLAYLIST: 'playlist'
    };
  }

  Ted.prototype.parseUrl = function (url, result) {
    var match = url.match(/\/(talks|playlists\/(\d+))\/([\w-]+)/i);
    var channel = match ? match[1] : undefined;

    if (!channel) {
      return result;
    }

    result.channel = channel.split('/')[0];
    result.id = match[3];

    if (result.channel === 'playlists') {
      result.list = match[2];
    }

    return result;
  };

  Ted.prototype.parseMediaType = function (result) {
    if (result.id && result.channel === 'playlists') {
      delete result.channel;
      result.mediaType = this.mediaTypes.PLAYLIST;
    }

    if (result.id && result.channel === 'talks') {
      delete result.channel;
      result.mediaType = this.mediaTypes.VIDEO;
    }

    return result;
  };

  Ted.prototype.parse = function (url, params) {
    var result = {
      params: params
    };
    result = this.parseUrl(url, result);
    result = this.parseMediaType(result);

    if (!result.id) {
      return undefined;
    }

    return result;
  };

  Ted.prototype.createLongUrl = function (vi, params) {
    var url = '';

    if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
      url += 'https://ted.com/talks/' + vi.id;
    } else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.id) {
      url += 'https://ted.com/playlists/' + vi.list + '/' + vi.id;
    } else {
      return undefined;
    }

    url += combineParams$d(params);
    return url;
  };

  Ted.prototype.createEmbedUrl = function (vi, params) {
    var url = 'https://embed.ted.com/';

    if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.id) {
      url += 'playlists/' + vi.list + '/' + vi.id;
    } else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
      url += 'talks/' + vi.id;
    } else {
      return undefined;
    }

    url += combineParams$d(params);
    return url;
  };

  base.bind(new Ted());

  var combineParams$e = util.combineParams;

  function Facebook() {
    this.provider = 'facebook';
    this.alternatives = [];
    this.defaultFormat = 'long';
    this.formats = {
      "long": this.createLongUrl,
      watch: this.createWatchUrl
    };
    this.mediaTypes = {
      VIDEO: 'video'
    };
  }

  Facebook.prototype.parse = function (url, params) {
    var result = {
      params: params,
      mediaType: this.mediaTypes.VIDEO
    };
    var match = url.match(/(?:\/(\d+))?\/videos(?:\/.*?)?\/(\d+)/i);

    if (match) {
      if (match[1]) {
        result.pageId = match[1];
      }

      result.id = match[2];
    }

    if (params.v && !result.id) {
      result.id = params.v;
      delete params.v;
      result.params = params;
    }

    if (!result.id) {
      return undefined;
    }

    return result;
  };

  Facebook.prototype.createWatchUrl = function (vi, params) {
    var url = 'https://facebook.com/watch/';

    if (vi.mediaType !== this.mediaTypes.VIDEO || !vi.id) {
      return undefined;
    }

    params = {
      v: vi.id
    };
    url += combineParams$e(params);
    return url;
  };

  Facebook.prototype.createLongUrl = function (vi, params) {
    var url = 'https://facebook.com/';

    if (vi.pageId) {
      url += vi.pageId;
    } else {
      return undefined;
    }

    if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
      url += '/videos/' + vi.id;
    } else {
      return undefined;
    }

    url += combineParams$e(params);
    return url;
  };

  base.bind(new Facebook());

  var lib = base;

  return lib;

})));
