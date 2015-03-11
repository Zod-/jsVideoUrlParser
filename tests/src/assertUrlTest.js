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
function assertUrlTest(assert, tests) {
  /*jshint unused:true */
  "use strict";
  tests.forEach(function (test) {
    test.urls.forEach(function (url) {
      assert.deepEqual(urlParser.parse(url), test.videoInfo, url);
    });
    
    assert.equal(urlParser.create({
      videoInfo: test.videoInfo,
      format: 'long'
    }), test.createdUrl, JSON.stringify(test.videoInfo));

    if (test.hasOwnProperty('createdShortUrl')) {
      assert.equal(urlParser.create({
        videoInfo: test.videoInfo,
        format: 'short'
      }), test.createdShortUrl, JSON.stringify(test.videoInfo));
    }
  });
}
