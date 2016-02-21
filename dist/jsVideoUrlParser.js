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

/*jshint unused:false */
function cloneObject(obj) {
  /*jshint unused:true */
  "use strict";
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  var temp = obj.constructor(); // give temp the original obj's constructor
  for (var key in obj) {
    temp[key] = cloneObject(obj[key]);
  }

  return temp;
}

/*jshint unused:false */
function getQueryParams(qs) {
  /*jshint unused:true */
  "use strict";
  if (typeof qs !== 'string') {
    return {};
  }
  qs = qs.split('+').join(' ');

  var params = {},
    match = qs.match(
      /(?:[\?](?:[^=]+)=(?:[^&#]*)(?:[&](?:[^=]+)=(?:[^&#]*))*(?:[#].*)?)|(?:[#].*)/
    ),
    split;

  if (match === null) {
    return {};
  }

  split = match[0].substr(1).split(/[&#=]/);

  for (var i = 0; i < split.length; i += 2) {
    params[decodeURIComponent(split[i])] =
      decodeURIComponent(split[i + 1] || '');
  }

  return params;
}

/*jshint unused:false */
function combineParams(op) {
  /*jshint unused:true */
  "use strict";
  if (typeof op !== 'object') {
    return '';
  }
  op.params = op.params || {};
  var combined = '',
    i = 0,
    keys = Object.keys(op.params);

  if (keys.length === 0) {
    return '';
  }

  //always have parameters in the same order
  keys.sort();

  if (!op.hasParams) {
    combined += '?' + keys[0] + '=' + op.params[keys[0]];
    i += 1;
  }

  for (; i < keys.length; i += 1) {
    combined += '&' + keys[i] + '=' + op.params[keys[i]];
  }
  return combined;
}

//parses strings like 1h30m20s to seconds
/*jshint unused:false */
function getTime(timeString) {
  /*jshint unused:true */
  "use strict";
  var totalSeconds = 0,
    timeValues = {
      's': 1,
      'm': 1 * 60,
      'h': 1 * 60 * 60,
      'd': 1 * 60 * 60 * 24,
      'w': 1 * 60 * 60 * 24 * 7
    },
    timePairs;

  //is the format 1h30m20s etc
  if (!timeString.match(/^(\d+[smhdw]?)+$/)) {
    return 0;
  }
  //expand to "1 h 30 m 20 s" and split
  timeString = timeString.replace(/([smhdw])/g, ' $1 ').trim();
  timePairs = timeString.split(' ');

  for (var i = 0; i < timePairs.length; i += 2) {
    totalSeconds += parseInt(timePairs[i], 10) *
      timeValues[timePairs[i + 1] || 's'];
  }
  return totalSeconds;
}

urlParser.bind({
  'provider': 'dailymotion',
  'alternatives': ['dai'],
  'parse': function (url, params) {
    "use strict";
    var match,
      id,
      result = {
        params: params
      };

    match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
    id = match ? match[1] : undefined;

    if (params.hasOwnProperty('start')) {
      params.start = getTime(params.start);
    }

    if (!id) {
      return undefined;
    }
    result.mediaType = 'video';
    result.id = id;

    return result;
  },
  defaultFormat: 'long',
  formats: {
    short: function (vi) {
      "use strict";
      return 'https://dai.ly/' + vi.id;
    },
    long: function (vi, params) {
      "use strict";
      return 'https://dailymotion.com/video/' +
        vi.id +
        combineParams({
          params: params
        });
    },
    embed: function (vi, params) {
      "use strict";
      return '//www.dailymotion.com/embed/video/' +
        vi.id +
        combineParams({
          params: params
        });
    }
  }
  //
});

urlParser.bind({
  'provider': 'twitch',
  'parse': function (url, params) {
    "use strict";
    var match,
      id,
      channel,
      idPrefix,
      result = {};

    match = url.match(/twitch\.tv\/(\w+)(?:\/(.)\/(\d+))?/i);
    channel = match ? match[1] : undefined;
    idPrefix = match ? match[2] : undefined;
    id = match ? match[3] : undefined;

    channel = params.channel || params.utm_content || channel;

    if (!channel) {
      return undefined;
    }
    if (id) {
      result.mediaType = 'video';
      result.id = id;
      result.idPrefix = idPrefix;
    } else {
      result.mediaType = 'stream';
    }
    result.channel = channel;

    return result;
  },
  defaultFormat: 'long',
  formats: {
    long: function (vi, params) {
      "use strict";
      var url = '';
      if (vi.mediaType === 'stream') {
        url = 'https://twitch.tv/' + vi.channel;
      } else if (vi.mediaType === 'video') {
        url = 'https://twitch.tv/' + vi.channel + '/' + vi.idPrefix + '/' + vi.id;
      }
      url += combineParams({
        params: params
      });

      return url;
    },
    embed: function (vi, params) {
      "use strict";
      return '//www.twitch.tv/' +
        vi.channel +
        '/embed' +
        combineParams({
          params: params
        });
    },
  }
});

urlParser.bind({
  provider: 'vimeo',
  alternatives: ['vimeopro'],
  parse: function (url, params) {
    "use strict";
    var match;
    var result = {
      mediaType: 'video',
      params: params
    };

    match = url.match(
      /(?:\/(?:channels\/[\w]+|(?:(?:album\/\d+|groups\/[\w]+)\/)?videos?))?\/(\d+)/i
    );
    result.id = match ? match[1] : undefined;

    if (!result.id) {
      return undefined;
    }

    if (params.hasOwnProperty('t')) {
      params.start = getTime(params.t);
      delete params.t;
    }

    return result;
  },
  defaultFormat: 'long',
  formats: {
    long: function (vi, params) {
      "use strict";
      var url = 'https://vimeo.com/' + vi.id;
      var startTime = params.start;
      delete params.start;
      url += combineParams({
        params: params
      });
      if (startTime) {
        url += '#t=' + startTime;
      }
      return url;
    },
    embed: function (vi, params) {
      "use strict";
      var url = '//player.vimeo.com/video/' + vi.id;
      var startTime = params.start;
      delete params.start;
      url += combineParams({
        params: params
      });
      if (startTime) {
        url += '#t=' + startTime;
      }
      return url;
    }
  }
});

urlParser.bind({
  'provider': 'youtube',
  'alternatives': ['youtu'],
  'parse': function (url, params) {
    "use strict";
    var match,
      id,
      list,
      result = {
        params: params
      };

    match = url.match(/(?:(?:v|be|videos|embed)\/(?!videoseries)|v=)([\w\-]{11})/i);
    id = match ? match[1] : undefined;
    if (params.v === id) {
      delete params.v;
    }

    if (params.list === id) {
      delete params.list;
    } else {
      list = params.list;
    }

    if (params.hasOwnProperty('start')) {
      params.start = getTime(params.start);
    }
    if (params.hasOwnProperty('t')) {
      params.start = getTime(params.t);
      delete params.t;
    }

    if (id) {
      result.mediaType = 'video';
      result.id = id;
      if (list) {
        result.list = list;
      }
    } else if (list) {
      result.mediaType = 'playlist';
      result.list = list;
    } else {
      return undefined;
    }

    return result;
  },
  defaultFormat: 'long',
  formats: {
    short: function (vi, params) {
      "use strict";
      var url = 'https://youtu.be/' + vi.id;
      if (params.start) {
        url += '#t=' + params.start;
      }
      return url;
    },
    embed: function (vi, params) {
      "use strict";
      var url = '//youtube.com/embed';

      if (vi.mediaType === 'playlist') {
        params.listType = 'playlist';
      } else {
        url += '/' + vi.id;
        //loop hack
        if (params.loop == 1) {
          params.playlist = vi.id;
        }
      }

      url += combineParams({
        params: params
      });

      return url;
    },
    long: function (vi, params) {
      "use strict";
      var url = '',
        startTime = params.start;
      delete params.start;

      if (vi.mediaType === 'playlist') {
        params.feature = 'share';
        url += 'https://youtube.com/playlist';
      } else {
        params.v = vi.id;
        url += 'https://youtube.com/watch';
      }

      url += combineParams({
        params: params
      });

      if (vi.mediaType !== 'playlist' && startTime) {
        url += '#t=' + startTime;
      }
      return url;
    },
    'default': 'long'
  }
});
