const {
  combineParams,
  getTime,
} = require('../util');

function Template() {
  //Main urls that the provider users
  this.provider = 'template';
  //Alternatives such as shortened versions e.g. youtube.com, youtu.be
  this.alternatives = ['temp'];
  this.defaultFormat = 'long';
  //List of formats and their functions
  this.formats = {
    long: this.createLongUrl,
    short: this.createShortUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
    PLAYLIST: 'playlist',
  };
}

module.exports = Template;

Template.prototype.parse = function(url, params) {
  //Set up the videoInfo object with relevant information
  var result = {
    params: params,
    mediaType: this.mediaTypes.VIDEO,
  };

  //Parse the url with regex or the query parameters might contain the id
  var match = url.match(
    /com\/(?:example\/id\/)?([\w-]+)/
  );
  result.id = match ? match[1] : params.id;

  //Parse time parameters to turn it from the string 1m30s into the number 90
  if (params.start) {
    result.params.start = getTime(params.start);
  }

  //Return nothing when parsing failed
  if (!result.id) {
    return undefined;
  }

  return result;
};

Template.prototype.createLongUrl = function(vi, params) {
  var url = '';

  //Create the url depending on the media type
  if (vi.mediaType === this.mediaTypes.VIDEO) {
    url += 'https://template.com/example/id/' + vi.id;
  }

  //Add query parameters back e.g.
  //https://template.com/example/id/abcde?foo=bar&baz=qux
  url += combineParams({
    params: params,
  });

  return url;
};

Template.prototype.createShortUrl = function(vi, params) {
  var url = '';

  //Create shortened urls
  if (vi.mediaType === this.mediaTypes.VIDEO) {
    url += 'https://temp.com/' + vi.id;
  }

  url += combineParams({
    params: params,
  });

  return url;
};

require('../base').bind(new Template());