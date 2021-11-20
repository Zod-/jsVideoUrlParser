const { combineParams } = require('../util');

function Ted() {
  this.provider = 'ted';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
    PLAYLIST: 'playlist',
  };
}

module.exports = Ted;

Ted.prototype.parseUrl = function(url, result) {
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

Ted.prototype.parseMediaType = function(result) {
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

Ted.prototype.parse = function(url, params) {
  var result = {
    params: params,
  };

  result = this.parseUrl(url, result);
  result = this.parseMediaType(result);

  if (!result.id) {
    return undefined;
  }

  return result;
};

Ted.prototype.createLongUrl = function(vi, params) {
  var url = '';

  if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    url += 'https://ted.com/talks/' + vi.id;
  }
  else if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.id) {
    url += 'https://ted.com/playlists/' + vi.list + '/' + vi.id;
  } else {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

Ted.prototype.createEmbedUrl = function(vi, params) {
  var url = 'https://embed.ted.com/';

  if (vi.mediaType === this.mediaTypes.PLAYLIST && vi.id) {
    url += 'playlists/' + vi.list + '/' + vi.id;
  }
  else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    url += 'talks/' + vi.id;
  } else {
    return undefined;
  }

  url += combineParams(params);
  return url;
};

require('../base').bind(new Ted());
