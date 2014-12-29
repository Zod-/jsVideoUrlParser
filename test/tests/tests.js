function assertURLTestPairs(assert, testPairs) {
  for (var url in testPairs) {
    if (testPairs.hasOwnProperty(url)) {
      assert.deepEqual(urlParser.parse(url), testPairs[url], url);
    }
  }
}
