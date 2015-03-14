QUnit.test("Dailymotion URLs", function (assert) {
  "use strict";
  var vi = {
      'provider': 'dailymotion',
      'id': 'x1e2b95',
      'mediaType': 'video'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://dailymotion.com/video/x1e2b95',
        short: 'https://dai.ly/x1e2b95',
        embed: '//www.dailymotion.com/embed/video/x1e2b95'
      },
      urls: ['http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals',
        'http://www.dailymotion.com/video/x1e2b95',
        'http://dai.ly/x1e2b95',
        'http://www.dailymotion.com/embed/video/x1e2b95'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://dailymotion.com/video/x1e2b95?start=10',
        embed: '//www.dailymotion.com/embed/video/x1e2b95?start=10'
      },
      urls: ['http://www.dailymotion.com/video/x1e2b95?start=10',
        'http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals?start=10',
        'http://www.dailymotion.com/embed/video/x1e2b95?start=10'
      ]
    }];
  tests[1].videoInfo.params = {
    start: 10
  };

  assertUrlTest(assert, tests);
});
