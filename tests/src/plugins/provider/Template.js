QUnit.test('Template Urls', function (assert) {
  //Parse urls to test against the videoInfo object
  //Create urls with the videoInfo objects to test against the format urls
  var vi = {
    provider: 'template',
    id: 'abcde',
    mediaType: 'video'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://template.com/example/id/abcde',
      short: 'https://temp.com/abcde'
    },
    urls: [
      'https://template.com/example/id/abcde',
      'https://temp.com/abcde'
    ]
  }];

  assertUrlTest(assert, tests);
});
