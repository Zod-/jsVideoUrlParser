const {
  combineParams,
  getTime,
} = require('../util');

function Googledrive() {
  this.provider = 'googledrive';
  this.defaultFormat = 'long';
  this.formats = {
    long: this.createLongUrl,
  };
  this.mediaTypes = {
    VIDEO: 'video',
  };
}

module.exports = Googledrive;


Googledrive.prototype.parseUrl = function(url) {
  var match = url.match(/(?:\/file\/d\/)([A-Za-z0-9]+)(?:\/view)/i);
  // https://drive.google.com/file/d/9OPhkjOO8I140ABwWtyY0cG0riyVB89B/view
  return match ? match[1] : undefined;
};

Googledrive.prototype.parseParameters = function(params, result) {
  if (params.start || params.t) {
    params.start = getTime(params.start || params.t);
    delete params.t;
  }
  // if (params.v === result.id) {
  //   delete params.v;
  // }
  // if (params.list === result.id) {
  //   delete params.list;
  // }

  return params;
};

Googledrive.prototype.parse = function(url, params) {
  var result = {
    mediaType: this.mediaTypes.VIDEO,
    id: this.parseUrl(url),
  };
  result.params = this.parseParameters(params, result);
  return result.id ? result : undefined;
};

Googledrive.prototype.createLongUrl = function(vi, params) {
// Googledrive.prototype.createLongUrl = function(vi) {

  //Create the url depending on the media type
  if (vi.mediaType !== this.mediaTypes.VIDEO || !vi.id) {
    // return 'https://drive.google.com/file/d/9OPhkjOO8I140ABwWtyY0cG0riyVB89B/view';
    return undefined;
  }

  var url = 'https://drive.google.com/file/d/' + vi.id + '/view';
  // Add query parameters back e.g.
  // https://template.com/example/id/abcde?foo=bar&baz=qux

  if (params.start) {
    params.t = params.start;
    delete (params.start);
  }
  url += combineParams(params);

  return url;

};
require('../base').bind(new Googledrive());
