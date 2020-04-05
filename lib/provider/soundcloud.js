const {
  combineParams,
  getTime,
} = require('../util');

function SoundCloud() {
  this.provider = 'soundcloud';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
  };
  this.mediaTypes = {
    TRACK: 'track',
    PLAYLIST: 'playlist',
    APITRACK: 'apitrack',
    APIPLAYLIST: 'apiplaylist',
  };
}

module.exports = SoundCloud;

SoundCloud.prototype.parseUrl = function(url, result) {
  var match = url.match(
    /(?:m\.)?soundcloud\.com\/(?:([\w-]+)\/(sets\/)?)([\w-]+)/i
  );
  if (!match) {
    return result;
  }
  result.channel = match[1];
  if (match[1] === 'playlists' || match[2]) { //playlist
    result.list = match[3];
  } else { //track
    result.id = match[3];
  }
  return result;
};

SoundCloud.prototype.parseParameters = function(params) {
  if (params.t) {
    params.start = getTime(params.t);
    delete params.t;
  }
  return params;
};

SoundCloud.prototype.parseMediaType = function(result) {
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

SoundCloud.prototype.parse = function(url, params) {
  var result = {};
  result = this.parseUrl(url, result);
  result.params = this.parseParameters(params);
  result = this.parseMediaType(result);
  if (!result.id && !result.list) {
    return undefined;
  }
  return result;
};

SoundCloud.prototype.createLongUrl = function(vi, params) {
  var url = '';
  var startTime = params.start;
  delete params.start;

  if (vi.mediaType === this.mediaTypes.TRACK && vi.id && vi.channel) {
    url = 'https://soundcloud.com/' + vi.channel + '/' + vi.id;
  }
  else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.list && vi.channel) {
    url = 'https://soundcloud.com/' + vi.channel + '/sets/' + vi.list;
  }
  else if (vi.mediaType === this.mediaTypes.APITRACK && vi.id) {
    url = 'https://api.soundcloud.com/tracks/' + vi.id;
  }
  else if (vi.mediaType === this.mediaTypes.APIPLAYLIST && vi.list) {
    url = 'https://api.soundcloud.com/playlists/' + vi.list;
  } else {
    return undefined;
  }

  url += combineParams(params);

  if (startTime) {
    url += '#t=' + startTime;
  }
  return url;
};

SoundCloud.prototype.createEmbedUrl = function(vi, params) {
  var url = 'https://w.soundcloud.com/player/';
  delete params.start;

  if (vi.mediaType === this.mediaTypes.APITRACK && vi.id) {
    params.url = 'https%3A//api.soundcloud.com/tracks/' + vi.id;
  }
  else if (vi.mediaType === this.mediaTypes.APIPLAYLIST && vi.list) {
    params.url = 'https%3A//api.soundcloud.com/playlists/' + vi.list;
  } else {
    return undefined;
  }

  url += combineParams(params);
  return url;
};

require('../base').bind(new SoundCloud());
