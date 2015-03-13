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
      format: 'long',
      params: test.videoInfo.params
    }), test.createdUrl, JSON.stringify(test.videoInfo));

    if (test.hasOwnProperty('createdShortUrl')) {
      assert.equal(urlParser.create({
        videoInfo: test.videoInfo,
        format: 'short',
        params: test.videoInfo.params
      }), test.createdShortUrl, JSON.stringify(test.videoInfo));
    }
  });
}
