const {
  combineParams,
  getTime,
} = require('../util');

function Facebook() {
  this.provider = 'facebook';
  this.alternatives = [];
  this.defaultFormat = 'long';
  //List of formats and their functions
  this.formats = {
    long: this.createLongUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Facebook;

Facebook.prototype.parse = function(url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    params: this.parseParameters(params),
    id: this.parseUrl(url),
  };
  
  if (!result.id) {
    return undefined;
  }
  return result;
};

Facebook.prototype.parseUrl = function(url) {
  const match = url.match(
   /^((?:https?:\/\/)?(?:www.|m.)?facebook.com\/(.*?videos(.*?)\/(\d+)(.*?)|(watch\/\\?(.*?)v=(\d+))))$/i
  )
  if (!match) {
    return undefined;
  }
  if(match[8]){
    return match[8]
  }
  
  return match[4]
};

Facebook.prototype.parseParameters = function(params) {
  if (params.t) {
    return {
      start: getTime(params.t),
    }
  }
  return {};
};

Facebook.prototype.createLongUrl = function(vi, params) {
  var url = '';
  
  //Create the url depending on the media type
  if (vi.mediaType === this.mediaTypes.VIDEO && vi.id) {
    url += 'https://facebook.com/watch/?v=' + vi.id;
  } else {
    return undefined;
  }
  
  url += combineParams(params);
  
  return url;
};

require('../base').bind(new Facebook());
