/*jshint unused:false */
function assertURLTestPairs(assert, testPairs) {
/*jshint unused:true */
  "use strict";
  for (var url in testPairs) {
    if (testPairs.hasOwnProperty(url)) {
      assert.deepEqual(urlParser.parse(url), testPairs[url], url);
    }
  }
}
