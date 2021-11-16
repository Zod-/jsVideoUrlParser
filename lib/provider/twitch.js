const {
  combineParams,
  getTime,
} = require('../util');

function Twitch() {
  this.provider = 'twitch';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
    STREAM: 'stream',
    CLIP: 'clip',
  };
}

module.exports = Twitch;

Twitch.prototype.seperateId = function(id) {
  return {
    pre: id[0],
    id: id.substr(1),
  };
};

Twitch.prototype.parseChannel = function(result, params) {
  var channel = params.channel || params.utm_content || result.channel;
  delete params.utm_content;
  delete params.channel;
  return channel;
};

Twitch.prototype.parseUrl = function(url, result, params) {
  var match;
  match = url.match(
    /(clips\.)?twitch\.tv\/(?:(?:videos\/(\d+))|(\w+(?:-[\w\d-]+)?)(?:\/clip\/(\w+))?)/i
  );

  if (match && match[2]) { //video
    result.id = 'v' + match[2];
  } else if (params.video) { //video embed
    result.id = params.video;
    delete params.video;
  } else if (params.clip) { //clips embed
    result.id = params.clip;
    result.isClip = true;
    delete params.clip;
  } else if (match && match[1] && match[3]) { //clips.twitch.tv/id
    result.id = match[3];
    result.isClip = true;
  } else if (match && match[3] && match[4]) { //twitch.tv/channel/clip/id
    result.channel = match[3];
    result.id = match[4];
    result.isClip = true;
  } else if (match && match[3]) {
    result.channel = match[3];
  }
  return result;
};

Twitch.prototype.parseMediaType = function(result) {
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

Twitch.prototype.parseParameters = function(params) {
  if (params.t) {
    params.start = getTime(params.t);
    delete params.t;
  }
  return params;
};

Twitch.prototype.parse = function(url, params) {
  var _this = this;
  var result = {};
  result = _this.parseUrl(url, result, params);
  result.channel = _this.parseChannel(result, params);
  result.mediaType = _this.parseMediaType(result);
  result.params = _this.parseParameters(params);
  return result.channel || result.id ? result : undefined;
};

Twitch.prototype.createLongUrl = function(vi, params) {
  var url = '';

  if (vi.mediaType === this.mediaTypes.STREAM && vi.channel) {
    url = 'https://twitch.tv/' + vi.channel;
  }
  else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    var sep = this.seperateId(vi.id);
    url = 'https://twitch.tv/videos/' + sep.id;
    if (params.start) {
      params.t = params.start + 's';
      delete params.start;
    }
  }
  else if (vi.mediaType === this.mediaTypes.CLIP && vi.id) {
    if (vi.channel) {
      url = 'https://www.twitch.tv/' + vi.channel + '/clip/' + vi.id;
    } else {
      url = 'https://clips.twitch.tv/' + vi.id;
    }
  } else {
    return undefined;
  }
  url += combineParams(params);

  return url;
};

Twitch.prototype.createEmbedUrl = function(vi, params) {
  var url = 'https://player.twitch.tv/';

  if (vi.mediaType === this.mediaTypes.STREAM && vi.channel) {
    params.channel = vi.channel;
  }
  else if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    params.video = vi.id;
    if (params.start) {
      params.t = params.start + 's';
      delete params.start;
    }
  }
  else if (vi.mediaType === this.mediaTypes.CLIP && vi.id) {
    url = 'https://clips.twitch.tv/embed';
    params.clip = vi.id;
  } else {
    return undefined;
  }

  url += combineParams(params);

  return url;
};

require('../base').bind(new Twitch());
