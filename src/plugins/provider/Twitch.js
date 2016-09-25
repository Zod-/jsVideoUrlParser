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
    EMBEDVIDEO: 'embed-video',
    CLIP: 'clip',
  };
}

Twitch.prototype.seperateId = function (id) {
  return {
    pre: id[0],
    id: id.substr(1)
  };
};

Twitch.prototype.parseChannel = function (result, params) {
  /*jshint camelcase:false */
  var channel = params.channel || params.utm_content || result.channel;
  delete params.utm_content;
  /*jshint camelcase:true */
  delete params.channel;
  return channel;
};

Twitch.prototype.parseUrl = function (url, result, params) {
  var match;
  match = url.match(
    /(clips\.)?twitch\.tv\/(\w+)(?:\/(?:(.)\/(\d+)|(\w+)))?/i
  );
  result.channel = match ? match[2] : undefined;
  if (match && match[3] && match[4]) { //video
    result.id = match[3] + match[4];
  } else if (params.video) { //video embed
    result.id = params.video;
    delete params.video;
  } else if (match && match[1] && match[5]) { //clips
    result.id = match[5];
    result.isClip = true;
  } else if (params.clip) { //clips embed
    var split = params.clip.split('/');
    result.channel = split[0];
    result.id = split[1];
    result.isClip = true;
    delete params.clip;
  }
  return result;
};

Twitch.prototype.parseMediaType = function (result) {
  var mediaType;
  if (result.channel) {
    if (result.id && result.isClip) {
      mediaType = this.mediaTypes.CLIP;
      delete result.isClip;
    } else if (result.id && !result.isClip) {
      mediaType = this.mediaTypes.VIDEO;
    } else {
      mediaType = this.mediaTypes.STREAM;
    }
  } else if (result.id) {
    mediaType = this.mediaTypes.EMBEDVIDEO;
    delete result.channel;
  }
  return mediaType;
};

Twitch.prototype.parseParameters = function (params) {
  if (params.t) {
    params.start = getTime(params.t);
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
    url = 'https://twitch.tv/' + vi.channel + '/' + sep.pre + '/' + sep.id;
    if (params.start) {
      params.t = params.start + 's';
      delete params.start;
    }
  } else if (vi.mediaType === this.mediaTypes.CLIP) {
    url = 'https://clips.twitch.tv/' + vi.channel + '/' + vi.id;
  }
  url += combineParams({
    params: params
  });

  return url;
};

Twitch.prototype.createEmbedUrl = function (vi, params) {
  var url = 'https://player.twitch.tv/';

  if (vi.mediaType === this.mediaTypes.STREAM) {
    params.channel = vi.channel;
  } else if (vi.mediaType === this.mediaTypes.VIDEO ||
    vi.mediaType === this.mediaTypes.EMBEDVIDEO) {
    params.video = vi.id;
    if (params.start) {
      params.t = params.start + 's';
      delete params.start;
    }
  } else if (vi.mediaType === this.mediaTypes.CLIP) {
    url = 'https://clips.twitch.tv/embed';
    params.clip = vi.channel + '/' + vi.id;
  }

  url += combineParams({
    params: params
  });

  return url;
};

urlParser.bind(new Twitch());
