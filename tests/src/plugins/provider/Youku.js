QUnit.test('Youku URLs', function (assert) {
  'use strict';
  var vi = {
      'provider': 'youku',
      'id': 'XMTQ3OTM4MzMxMg',
      'mediaType': 'video'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      formats: {
        embed: 'http://player.youku.com/embed/XMTQ3OTM4MzMxMg'
      },
      urls: ['http://player.youku.com/embed/XMTQ3OTM4MzMxMg']
    }];

  assertUrlTest(assert, tests);
});
