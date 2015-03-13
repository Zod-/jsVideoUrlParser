QUnit.test("Regular YouTube URLs", function (assert) {
  "use strict";
  var vi = {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video',
      params: {
        start: 30
      }
    },
    tests = [{
      videoInfo: cloneObject(vi),
      createdUrl: 'https://youtube.com/watch?v=HRb7B9fPhfA#t=30',
      createdShortUrl: 'https://youtu.be/HRb7B9fPhfA#t=30',
      urls: ['http://www.youtube.com/watch?v=HRb7B9fPhfA#t=30s',
        'http://www.youtube.com/watch?v=HRb7B9fPhfA&t=30s',
        'https://m.youtube.com/details?v=HRb7B9fPhfA#t=30s',
        'http://youtu.be/HRb7B9fPhfA?t=30s',
        'http://youtu.be/HRb7B9fPhfA#t=30s'
      ]
    }, {
      videoInfo: cloneObject(vi),
      createdUrl: 'https://youtube.com/watch?v=HRb7B9fPhfA',
      createdShortUrl: 'https://youtu.be/HRb7B9fPhfA',
      urls: ['http://www.youtube.com/watch?v=HRb7B9fPhfA',
        'http://youtu.be/HRb7B9fPhfA',
        'https://m.youtube.com/details?v=HRb7B9fPhfA'
      ]
    }];
  delete tests[1].videoInfo.params;

  assertUrlTest(assert, tests);
});
QUnit.test("Playlist YouTube URLs", function (assert) {
  "use strict";
  var vi = {
      provider: 'youtube',
      id: 'yQaAGmHNn9s',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'video',
      params: {
        start: 100,
        list: 'PL46F0A159EC02DF82',
      }
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
        list: 'PL46F0A159EC02DF82',
        mediaType: 'playlist',
        params: {
          list: 'PL46F0A159EC02DF82'
        }
      },
      createdUrl: 'https://youtube.com/playlist?feature=share&list=PL46F0A159EC02DF82',
      urls: ['http://www.youtube.com/embed/videoseries?list=PL46F0A159EC02DF82',
        'http://www.youtube.com/playlist?list=PL46F0A159EC02DF82'
      ]
    }];

  delete tests[1].videoInfo.params.start;
  delete tests[2].videoInfo.params.start;
  tests[2].videoInfo.params.index = tests[3].videoInfo.params.index = '25';
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
    urls: ['https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA/related',
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA',
      'https://www.youtube.com/v/HRb7B9fPhfA'
    ]
  }];
  assertUrlTest(assert, tests);
});
