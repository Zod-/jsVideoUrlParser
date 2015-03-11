function URLParser() {
  "use strict";
  this.plugins = {};
}
URLParser.prototype.parse = function(url) {
  "use strict";
  var th = this,
    match = url.match(/(?:https?:\/\/)?(?:[^\.]+\.)?(\w+)\./i),
    provider = match ? match[1] : undefined,
    result;
  if (match && provider && th.plugins[provider] && th.plugins[provider].parse) {
    result = th.plugins[provider].parse.call(this, url);
    if (result) {
      result.provider = th.plugins[provider].provider;
      return result;
    }
  }
  return undefined;
};
URLParser.prototype.bind = function(plugin) {
  "use strict";
  var th = this;
  th.plugins[plugin.provider] = plugin;
  if (plugin.alternatives) {
    for (var i = 0; i < plugin.alternatives.length; i += 1) {
      th.plugins[plugin.alternatives[i]] = plugin;
    }
  }
};
URLParser.prototype.create = function(op) {
  "use strict";
  var th = this,
    vi = op.videoInfo;
  op.format = op.format || 'short';
  if (th.plugins[vi.provider] && th.plugins[vi.provider].create) {
    return th.plugins[vi.provider].create.call(this, op);
  }
  return undefined;
};
/*jshint unused:true */
var urlParser = new URLParser();
/*jshint unused:false */

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
    totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs[i + 1] || 's'];
  }
  return totalSeconds;
}

urlParser.bind({
  'provider': 'dailymotion',
  'alternatives': ['dai'],
  'parse': function (url) {
    "use strict";
    var match,
      id,
      startTime,
      result = {};

    match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
    id = match ? match[1] : undefined;

    match = url.match(/[#\?&]start=([A-Za-z0-9]+)/i);
    startTime = match ? getTime(match[1]) : undefined;

    if (!id) {
      return undefined;
    }
    result.mediaType = 'video';
    result.id = id;
    if (startTime) {
      result.startTime = startTime;
    }
    return result;
  },
  'create': function (op) {
    "use strict";
    var vi = op.videoInfo;
    if (vi.startTime) {
      return 'https://dailymotion.com/video/' + vi.id + '?start=' + vi.startTime;
    }

    if (op.format === 'short') {
      return 'https://dai.ly/' + vi.id;
    }

    return 'https://dailymotion.com/video/' + vi.id;
  }
});

urlParser.bind({
  'provider': 'twitch',
  'parse': function (url) {
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

    match = url.match(/(?:\?channel|\&utm_content)=(\w+)/i);
    channel = match ? match[1] : channel;

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
  'create': function (op) {
    "use strict";
    var vi = op.videoInfo;
    if (vi.mediaType === 'stream') {
      return 'https://twitch.tv/' + vi.channel;
    }

    return 'https://twitch.tv/' + vi.channel + '/' + vi.idPrefix + '/' + vi.id;
  }
});

urlParser.bind({
  'provider': 'vimeo',
  'alternatives': ['vimeopro'],
  'parse': function (url) {
    "use strict";
    var match,
      id;
    match = url.match(/(?:\/(?:channels\/[\w]+|(?:album\/\d+\/)?videos?))?\/(\d+)/i);
    id = match ? match[1] : undefined;
    if (!id) {
      return undefined;
    }
    return {
      'mediaType': 'video',
      'id': id
    };
  },
  'create': function (op) {
    "use strict";
    return 'https://vimeo.com/' + op.videoInfo.id;
  }
});

urlParser.bind({
  'provider': 'youtube',
  'alternatives': ['youtu'],
  'parse': function (url) {
    "use strict";
    var match,
      id,
      playlistId,
      playlistIndex,
      startTime,
      result = {};

    match = url.match(/(?:(?:v|be|videos)\/|v=)([\w\-]{11})/i);
    id = match ? match[1] : undefined;

    match = url.match(/list=([\w\-]+)/i);
    playlistId = match ? match[1] : undefined;

    match = url.match(/index=(\d+)/i);
    playlistIndex = match ? Number(match[1]) : undefined;

    match = url.match(/[#\?&](?:star)?t=([A-Za-z0-9]+)/i);
    startTime = match ? getTime(match[1]) : undefined;

    if (id) {
      result.mediaType = 'video';
      result.id = id;
      if (playlistId) {
        result.playlistId = playlistId;
        if (playlistIndex) {
          result.playlistIndex = playlistIndex;
        }
      }
      if (startTime) {
        result.startTime = startTime;
      }
    } else if (playlistId) {
      result.mediaType = 'playlist';
      result.playlistId = playlistId;
    } else {
      return undefined;
    }

    return result;
  },
  'create': function (op) {
    "use strict";
    var url,
      vi = op.videoInfo;
    if (vi.mediaType === 'playlist') {
      return 'https://youtube.com/playlist?feature=share&list=' + vi.playlistId;
    }

    if (vi.playlistId) {
      url = 'https://youtube.com/watch?v=' + vi.id + '&list=' + vi.playlistId;
      if (vi.playlistIndex) {
        url += '&index=' + vi.playlistIndex;
      }
    } else {
      if (op.format === 'short') {
        url = 'https://youtu.be/' + vi.id;
      } else {
        url = 'https://youtube.com/watch?v=' + vi.id;
      }
    }

    if (vi.startTime) {
      url += '#t=' + vi.startTime;
    }
    return url;
  }
});
