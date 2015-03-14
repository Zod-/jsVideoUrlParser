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
      formats: {
        long: 'https://youtube.com/watch?v=HRb7B9fPhfA#t=30',
        embed: '//youtube.com/embed/HRb7B9fPhfA?start=30',
        short: 'https://youtu.be/HRb7B9fPhfA#t=30'
      },
      urls: ['http://www.youtube.com/watch?v=HRb7B9fPhfA#t=30s',
        'http://www.youtube.com/watch?v=HRb7B9fPhfA&t=30s',
        'https://m.youtube.com/details?v=HRb7B9fPhfA#t=30s',
        'http://youtu.be/HRb7B9fPhfA?t=30s',
        'http://youtu.be/HRb7B9fPhfA#t=30s',
        '//youtube.com/embed/HRb7B9fPhfA?start=30',
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://youtube.com/watch?v=HRb7B9fPhfA',
        embed: '//youtube.com/embed/HRb7B9fPhfA',
        short: 'https://youtu.be/HRb7B9fPhfA'
      },
      urls: ['http://www.youtube.com/watch?v=HRb7B9fPhfA',
        'http://youtu.be/HRb7B9fPhfA',
        'https://m.youtube.com/details?v=HRb7B9fPhfA'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        embed: '//youtube.com/embed/HRb7B9fPhfA?loop=1&playlist=HRb7B9fPhfA&start=30'
      },
      urls: ['//youtube.com/embed/HRb7B9fPhfA?loop=1&list=HRb7B9fPhfA&start=30']
    }];
  delete tests[1].videoInfo.params;
  tests[2].videoInfo.params.loop = '1';

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
      formats: {
        long: 'https://youtube.com/watch?list=PL46F0A159EC02DF82&v=yQaAGmHNn9s#t=100',
        embed: '//youtube.com/embed/yQaAGmHNn9s?list=PL46F0A159EC02DF82&start=100',
      },
      urls: ['http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40',
        'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82&t=1m40',
        '//youtube.com/embed/yQaAGmHNn9s?list=PL46F0A159EC02DF82&start=100'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://youtube.com/watch?list=PL46F0A159EC02DF82&v=yQaAGmHNn9s',
        embed: '//youtube.com/embed/yQaAGmHNn9s?list=PL46F0A159EC02DF82',
      },
      urls: ['http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82',
        '//youtube.com/embed/yQaAGmHNn9s?list=PL46F0A159EC02DF82'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://youtube.com/watch?index=25&list=PL46F0A159EC02DF82&v=6xLcSTDeB7A',
        embed: '//youtube.com/embed/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82',
      },
      urls: ['https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25',
        'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82',
        '//youtube.com/embed/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://youtube.com/watch?index=25&list=PL46F0A159EC02DF82&v=6xLcSTDeB7A#t=100',
        embed: '//youtube.com/embed/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82&start=100',
      },
      urls: ['https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25#t=1m40',
        'https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25&t=1m40',
        'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82&t=1m40',
        'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82#t=1m40',
        '//youtube.com/embed/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82&start=100'
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
      formats: {
        long: 'https://youtube.com/playlist?feature=share&list=PL46F0A159EC02DF82',
        embed: '//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist',
      },
      urls: ['http://www.youtube.com/embed/videoseries?list=PL46F0A159EC02DF82',
        'http://www.youtube.com/playlist?list=PL46F0A159EC02DF82'
      ]
    }, {
      videoInfo: {
        provider: 'youtube',
        list: 'PL46F0A159EC02DF82',
        mediaType: 'playlist',
        params: {
          list: 'PL46F0A159EC02DF82',
          listType: 'playlist'
        }
      },
      formats: {
        embed: '//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist',
      },
      urls: ['//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist']
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
    formats: {
      long: 'https://youtube.com/watch?v=HRb7B9fPhfA',
      short: 'https://youtu.be/HRb7B9fPhfA',
      embed: '//youtube.com/embed/HRb7B9fPhfA',
    },
    urls: ['https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA/related',
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA',
      'https://www.youtube.com/v/HRb7B9fPhfA'
    ]
  }];
  assertUrlTest(assert, tests);
});
