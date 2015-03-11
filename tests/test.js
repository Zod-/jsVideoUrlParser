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

QUnit.test("TimeString Parser", function (assert) {
  "use strict";
  var s = 1,
    m = 60 * s,
    h = 60 * m,
    d = 24 * h,
    w = 7 * d,
    testPairs = {
      '1w': w,
      '1d': d,
      '1h': h,
      '1m': m,
      '1s': s,
      '1': s,
      '1w1d1h1m1s': w + d + h + m + s,
      '30w1m': 30 * w + m,
      '100': 100 * s,
      '4m30s': 4 * m + 30 * s,
      '04m30': 4 * m + 30 * s,
      '04m30s': 4 * m + 30 * s,
      '1h30m25s': h + 30 * m + 25 * s,
      '1h30m25': h + 30 * m + 25 * s,
      '1h30m25s25s': h + 30 * m + 25 * s + 25 * s,
      '1h30m25s25': h + 30 * m + 25 * s + 25 * s,
      '1h30m25s25s1h1w': h + 30 * m + 25 * s + 25 * s + h + w
    };

  for (var timeString in testPairs) {
    if (testPairs.hasOwnProperty(timeString)) {
      assert.equal(getTime(timeString), testPairs[timeString],
        timeString + ' === ' + testPairs[timeString]);
    }
  }
});

QUnit.test("Dailymotion URLs", function (assert) {
  "use strict";
  var vi = {
      'provider': 'dailymotion',
      'id': 'x1e2b95',
      'mediaType': 'video'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      createdUrl: 'https://dailymotion.com/video/x1e2b95',
      createdShortUrl: 'https://dai.ly/x1e2b95',
      urls: ['http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals',
        'http://www.dailymotion.com/video/x1e2b95',
        'http://dai.ly/x1e2b95',
        'http://www.dailymotion.com/embed/video/x1e2b95'
      ]
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://dailymotion.com/video/x1e2b95?start=10',
      urls: ['http://www.dailymotion.com/video/x1e2b95?start=10',
        'http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals?start=10',
        'http://www.dailymotion.com/embed/video/x1e2b95?start=10'
      ]
    }];
  tests[1].videoInfo.startTime = 10;

  assertUrlTest(assert, tests);
});

QUnit.test("Twitch Stream URLs", function (assert) {
  "use strict";
  var vi = {
      'provider': 'twitch',
      'channel': 'tsm_wildturtle',
      'mediaType': 'stream'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      createdUrl: 'https://twitch.tv/tsm_wildturtle',
      urls: ['http://www.twitch.tv/tsm_wildturtle',
        'http://www.twitch.tv/widgets/live_embed_player.swf?channel=tsm_wildturtle',
        'http://twitch.tv/tsm_wildturtle/chat?popout='
      ]
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://twitch.tv/tsm_wildturtle/c/2724914',
      urls: ['http://www.twitch.tv/tsm_wildturtle/c/2724914']
    }];
  tests[1].videoInfo.id = '2724914';
  tests[1].videoInfo.idPrefix = 'c';
  tests[1].videoInfo.mediaType = 'video';
  assertUrlTest(assert, tests);
});

QUnit.test("Vimeo URLs", function (assert) {
  "use strict";
  var vi = {
      'provider': 'vimeo',
      'id': '97276391',
      'mediaType': 'video'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      createdUrl: 'https://vimeo.com/97276391',
      urls: ['https://vimeo.com/97276391',
        'https://vimeo.com/channels/staffpicks/97276391'
      ]
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://vimeo.com/96186586',
      urls: ['https://vimeo.com/album/2903155/video/96186586']
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://vimeo.com/97688625',
      urls: ['https://vimeo.com/groups/shortfilms/videos/97688625']
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://vimeo.com/24069938',
      urls: ['http://vimeopro.com/staff/frame/video/24069938']
    }];

  tests[1].videoInfo.id = '96186586';
  tests[2].videoInfo.id = '97688625';
  tests[3].videoInfo.id = '24069938';
  assertUrlTest(assert, tests);
});

QUnit.test("Regular YouTube URLs", function (assert) {
  "use strict";
  var vi = {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video',
      startTime: 30
    },
    tests = [{
      videoInfo: cloneObject(vi),
      createdUrl: 'https://youtube.com/watch?v=HRb7B9fPhfA#t=30',
      createdShortUrl: 'https://youtu.be/HRb7B9fPhfA#t=30',
      urls: ['http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA#t=30s',
        'http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA&t=30s',
        'https://m.youtube.com/details?v=HRb7B9fPhfA#t=30s',
        'http://youtu.be/HRb7B9fPhfA?t=30s',
        'http://youtu.be/HRb7B9fPhfA#t=30s'
      ]
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://youtube.com/watch?v=HRb7B9fPhfA',
      createdShortUrl: 'https://youtu.be/HRb7B9fPhfA',
      urls: ['http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA',
        'http://youtu.be/HRb7B9fPhfA',
        'https://m.youtube.com/details?v=HRb7B9fPhfA'
      ]
    }];
  delete tests[1].videoInfo.startTime;

  assertUrlTest(assert, tests);
});
QUnit.test("Playlist YouTube URLs", function (assert) {
  "use strict";
  var vi = {
      provider: 'youtube',
      id: 'yQaAGmHNn9s',
      playlistId: 'PL46F0A159EC02DF82',
      mediaType: 'video',
      startTime: 100
    },
    tests = [{
      videoInfo: cloneObject(vi),
      createdUrl: 'https://youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=100',
      urls: ['http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40',
        'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82&t=1m40',
      ]
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82',
      urls: ['http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82']
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25',
      urls: ['https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25',
        'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82'
      ]
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25#t=100',
      urls: ['https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25#t=1m40',
        'https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25&t=1m40',
        'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82&t=1m40',
        'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82#t=1m40'
      ]
    }, {
      videoInfo: {
        provider: 'youtube',
        playlistId: 'PL46F0A159EC02DF82',
        mediaType: 'playlist'
      },
      createdUrl: 'https://youtube.com/playlist?feature=share&list=PL46F0A159EC02DF82',
      urls: ['http://www.youtube.com/embed/videoseries?list=PL46F0A159EC02DF82',
        'http://www.youtube.com/playlist?list=PL46F0A159EC02DF82'
      ]
    }];

  delete tests[1].videoInfo.startTime;
  delete tests[2].videoInfo.startTime;
  tests[2].videoInfo.playlistIndex = tests[3].videoInfo.playlistIndex = 25;
  tests[2].videoInfo.id = tests[3].videoInfo.id = '6xLcSTDeB7A';
  assertUrlTest(assert, tests);
});

QUnit.test("Feed YouTube URLs", function (assert) {
  "use strict";
  var tests = [{
    videoInfo: {
      'provider': 'youtube',
      'id': 'HRb7B9fPhfA',
      'mediaType': 'video'
    },
    createdUrl: 'https://youtube.com/watch?v=HRb7B9fPhfA',
    createdShortUrl: 'https://youtu.be/HRb7B9fPhfA',
    urls: ['https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA/related?v=2',
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA?v=2',
      'https://www.youtube.com/v/HRb7B9fPhfA?version=3&f=videos&app=youtube_gdata'
    ]
  }];
  assertUrlTest(assert, tests);
});
