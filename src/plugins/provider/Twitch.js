function Twitch() {
  'use strict';
  this.provider = 'twitch';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
    embed: this.createEmbedUrl
  };
  this.mediaTypes = {
    VIDEO: 'video',
    STREAM: 'stream',
    EMBEDVIDEO: 'embed-video'
  };
}

Twitch.prototype.seperateId = function (id) {
  'use strict';
  return {
    pre: id[0],
    id: id.substr(1)
  };
};

Twitch.prototype.parseChannel = function (result, params) {
  'use strict';
  /*jshint camelcase:false */
  var channel = params.channel || params.utm_content || result.channel;
  delete params.utm_content;
  /*jshint camelcase:true */
  delete params.channel;
  return channel;
};


Twitch.prototype.parseUrl = function (url, result, params) {
  'use strict';
  var match;
  match = url.match(
    /twitch\.tv\/(\w+)(?:\/(.)\/(\d+))?/i
  );
  result.channel = match ? match[1] : undefined;
  if (match && match[2] && match[3]) {
    result.id = match[2] + match[3];
  }else if (params.video){
    result.id = params.video;
    delete params.video;
  }
  return result;
};

Twitch.prototype.parseMediaType = function (result) {
  'use strict';
  var mediaType;
  if (result.channel){
    mediaType = result.id ? this.mediaTypes.VIDEO : this.mediaTypes.STREAM;
  }else if (result.id){
    mediaType = this.mediaTypes.EMBEDVIDEO;
  }
  return mediaType;
};

Twitch.prototype.parseParameters = function (params) {
  'use strict';
  if (params.t) {
    params.start = getTime(params.t);
    delete params.t;
  }
  return params;
};

Twitch.prototype.parse = function (url, params) {
  'use strict';
  var _this = this;
  var result = {};
  result = _this.parseUrl(url, result, params);
  result.channel = _this.parseChannel(result, params);
  result.mediaType = _this.parseMediaType(result);
  result.params = _this.parseParameters(params);
  return result.channel || result.id ? result : undefined;
};

Twitch.prototype.createLongUrl = function (vi, params) {
  'use strict';
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
  }
  url += combineParams({
    params: params
  });

  return url;
};

Twitch.prototype.createEmbedUrl = function (vi, params) {
  'use strict';
  var url = '';

  if (vi.mediaType === this.mediaTypes.STREAM){
    url = '//www.twitch.tv/' + vi.channel + '/embed';
  }else if (vi.mediaType === this.mediaTypes.VIDEO ||
            vi.mediaType === this.mediaTypes.EMBEDVIDEO){
    url = 'https://player.twitch.tv/';
    params.video = vi.id;
    if (params.start) {
      params.t = params.start + 's';
      delete params.start;
    }
  }

  url += combineParams({
    params: params
  });

  return url;
};

urlParser.bind(new Twitch());
