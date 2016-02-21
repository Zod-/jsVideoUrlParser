/*jshint unused:false */
function assertUrlTest(assert, tests) {
  /*jshint unused:true */
  "use strict";
  tests.forEach(function (test) {
    test.urls.forEach(function (url) {
      assert.deepEqual(urlParser.parse(url), test.videoInfo, url);
    });
    for(var format in test.formats){
      if(test.formats.hasOwnProperty(format)){
        assert.equal(urlParser.create({
          videoInfo: test.videoInfo,
          format: format,
          params: test.videoInfo.params
        }), test.formats[format], JSON.stringify(test.videoInfo));
      }
    }
  });
}

QUnit.test("urlParser Tests", function (assert) {
  "use strict";
  var parser = new URLParser();

  parser.bind({
    provider: 'foo',
    alternatives: ['bar'],
    parse: function (url) {
      return {
        url: url
      };
    },
    defaultFormat: 'long',
    formats: {
      long: function (vi, params) {
        return {
          videoInfo: vi,
          params: params
        };
      }
    }
  });

  assert.notStrictEqual(parser.plugins.foo, undefined, 'Binding provider');
  assert.notStrictEqual(parser.plugins.bar, undefined, 'Binding alternative');

  assert.strictEqual(parser.parse('abc.def'), undefined, 'Undefined parse');
  assert.strictEqual(parser.parse('http://bar.def').provider, 'foo', 'Alternative parse');
  assert.strictEqual(parser.parse('https://abc.foo.def/ghi').provider, 'foo', 'Parse');
  assert.strictEqual(parser.parse('//abc.foo.def/ghi').provider, 'foo', 'Parse');

  var createObj1 = {
      videoInfo: {
        provider: 'foo'
      },
      format: 'long'
    },
    createObj2 = {
      videoInfo: {
        provider: 'foo'
      },
      format: 'abc'
    },
    createObj3 = {
      videoInfo: {
        provider: 'abc'
      }
    },
    createObj4 = {
      videoInfo: {
        provider: 'foo',
        params: {
          foo: 'bar'
        }
      },
      params: 'internal'
    };
  assert.deepEqual(parser.create(createObj1).videoInfo, createObj1.videoInfo, 'Create');
  assert.strictEqual(parser.create(createObj2), undefined, 'Create not existing format');
  assert.strictEqual(parser.create(createObj3), undefined, 'Create not existing provider');
  assert.deepEqual(parser.create(createObj4).params, createObj4.videoInfo.params, 'Create with internal params');

  parser.bind({
    provider: 'abc',
    formats: {}
  });

  assert.strictEqual(parser.parse('http://abc.com'), undefined, 'No .parse');
  assert.strictEqual(parser.create(createObj3), undefined, 'No .create');

  for (var plugin in urlParser.plugins) {
    if (urlParser.plugins.hasOwnProperty(plugin)) {
      assert.notStrictEqual(urlParser.plugins[plugin].defaultFormat, undefined, 'Defaultformat not undefined ' + plugin);
    }
  }
});

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

QUnit.test("GetQueryParams Tests", function (assert) {
  "use strict";
  assert.deepEqual(getQueryParams(undefined), {}, 'Undefined argument');
  assert.deepEqual(getQueryParams([]), {}, 'Not a string argument');
  assert.deepEqual(getQueryParams('http://foo.bar/test'), {}, 'No params');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar'), {
    foo: 'bar'
  }, '?foo=bar');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar&'), {
    foo: 'bar'
  }, '?foo=bar&');
  assert.deepEqual(getQueryParams('http://foo.bar/test#foo=bar'), {
    foo: 'bar'
  }, '#foo=bar');
  assert.deepEqual(getQueryParams('http://foo.bar/test#foo'), {
    foo: ''
  }, '#foo');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar&faz=baz'), {
    foo: 'bar',
    faz: 'baz'
  }, '?foo=bar&faz=baz');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar&faz=baz#fiz=biz'), {
    foo: 'bar',
    faz: 'baz',
    fiz: 'biz'
  }, '?foo=bar&faz=baz#fiz=biz');
  assert.deepEqual(getQueryParams('http://foo.bar/test?foo=bar&faz=baz#fiz'), {
    foo: 'bar',
    faz: 'baz',
    fiz: ''
  }, '?foo=bar&faz=baz#fiz');
});

QUnit.test("CombineParams Tests", function (assert) {
  "use strict";
  assert.equal(combineParams(undefined), '', 'Undefined argument');
  assert.equal(combineParams({}), '', 'No params object');

  assert.equal(combineParams({
    params: {
      foo: 'bar'
    }
  }), '?foo=bar', "{foo:'bar'}");
  assert.equal(combineParams({
    params: {
      foo: 'bar',
      faz: 'baz'
    }
  }), '?faz=baz&foo=bar', "{foo:'bar',faz:'baz'}");
  assert.equal(combineParams({
    params: {
      foo: 'bar',
      faz: 'baz',
      fiz: 'biz'
    }
  }), '?faz=baz&fiz=biz&foo=bar', "{foo: 'bar',faz: 'baz',fiz: 'biz'}");

  assert.equal(combineParams({
    hasParams: true,
    params: {
      foo: 'bar'
    }
  }), '&foo=bar', "{foo:'bar'}");
  assert.equal(combineParams({
    hasParams: true,
    params: {
      foo: 'bar',
      faz: 'baz'
    }
  }), '&faz=baz&foo=bar', "{foo:'bar',faz:'baz'}");
  assert.equal(combineParams({
    hasParams: true,
    params: {
      foo: 'bar',
      faz: 'baz',
      fiz: 'biz'
    }
  }), '&faz=baz&fiz=biz&foo=bar', "{foo: 'bar',faz: 'baz',fiz: 'biz'}");
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

QUnit.test("Twitch Stream URLs", function (assert) {
  "use strict";
  var vi = {
      'provider': 'twitch',
      'channel': 'tsm_wildturtle',
      'mediaType': 'stream'
    },
    tests = [{
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://twitch.tv/tsm_wildturtle',
        embed: '//www.twitch.tv/tsm_wildturtle/embed'
      },
      urls: ['http://www.twitch.tv/tsm_wildturtle',
        'http://www.twitch.tv/widgets/live_embed_player.swf?channel=tsm_wildturtle',
        'http://twitch.tv/tsm_wildturtle/chat?popout=',
        '//www.twitch.tv/tsm_wildturtle/embed'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://twitch.tv/tsm_wildturtle/c/2724914',
      },
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
      formats: {
        long: 'https://vimeo.com/97276391',
        embed: '//player.vimeo.com/video/97276391'
      },
      urls: ['https://vimeo.com/97276391',
        'https://vimeo.com/channels/staffpicks/97276391',
        '//player.vimeo.com/video/97276391'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://vimeo.com/96186586',
        embed: '//player.vimeo.com/video/96186586'
      },
      urls: ['https://vimeo.com/album/2903155/video/96186586',
        '//player.vimeo.com/video/96186586'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://vimeo.com/97688625',
        embed: '//player.vimeo.com/video/97688625'
      },
      urls: ['https://vimeo.com/groups/shortfilms/videos/97688625',
        '//player.vimeo.com/video/97688625',
        'https://vimeo.com/groups/1minute/videos/97688625'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://vimeo.com/24069938',
        embed: '//player.vimeo.com/video/24069938'
      },
      urls: ['http://vimeopro.com/staff/frame/video/24069938',
        '//player.vimeo.com/video/24069938'
      ]
    }, {
      videoInfo: cloneObject(vi),
      formats: {
        long: 'https://vimeo.com/36881035#t=208',
        embed: '//player.vimeo.com/video/36881035#t=208'
      },
      urls: ['https://vimeo.com/36881035#t=3m28s',
        '//player.vimeo.com/video/36881035#t=3m28s'
      ]
    }];

  tests[1].videoInfo.id = '96186586';
  tests[2].videoInfo.id = '97688625';
  tests[3].videoInfo.id = '24069938';
  tests[4].videoInfo.id = '36881035';
  tests[4].videoInfo.params = {
    start: 208
  };
  assertUrlTest(assert, tests);
});

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
