function assertURLTestPairs(assert, testPairs) {
  for (var url in testPairs) {
    if (testPairs.hasOwnProperty(url)) {
      assert.deepEqual(urlParser.parse(url), testPairs[url], url);
    }
  }
}

QUnit.test("TimeString Parser", function(assert) {
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
        '{0} === {1}'.format(timeString, testPairs[timeString]));
    }
  }
});

QUnit.test("Dailymotion URLs", function(assert) {
  var expected1 = {
      'provider': 'dailymotion',
      'id': 'x1e2b95',
      'mediaType': 'video'
    },
    expected2 = {
      'provider': 'dailymotion',
      'id': 'x1e2b95',
      'mediaType': 'video',
      startTime: 10
    },
    testPairs = {
      'http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals': expected1,
      'http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals?start=10': expected2,
      'http://www.dailymotion.com/video/x1e2b95': expected1,
      'http://www.dailymotion.com/video/x1e2b95?start=10': expected2,
      'http://dai.ly/x1e2b95': expected1,
      'http://www.dailymotion.com/embed/video/x1e2b95': expected1,
      'http://www.dailymotion.com/embed/video/x1e2b95?start=10': expected2
    };

  assertURLTestPairs(assert, testPairs);
});

QUnit.test("Twitch Stream URLs", function(assert) {
  var expected1 = {
      'provider': 'twitch',
      'channel': 'tsm_wildturtle',
      'mediaType': 'stream'
    },
    expected2 = {
      'provider': 'twitch',
      'channel': 'tsm_wildturtle',
      'mediaType': 'video',
      'id': '2724914',
      "idPrefix": "c"
    },
    testPairs = {
      'http://www.twitch.tv/tsm_wildturtle': expected1,
      'http://www.twitch.tv/widgets/live_embed_player.swf?channel=tsm_wildturtle': expected1,
      'http://twitch.tv/tsm_wildturtle/chat?popout=': expected1,
      'http://www.twitch.tv/tsm_wildturtle/c/2724914': expected2
    };

  assertURLTestPairs(assert, testPairs);
});

QUnit.test("Vimeo URLs", function(assert) {
  var expected1 = {
      'provider': 'vimeo',
      'id': '97276391',
      'mediaType': 'video'
    },
    expected2 = {
      'provider': 'vimeo',
      'id': '96186586',
      'mediaType': 'video'
    },
    expected3 = {
      'provider': 'vimeo',
      'id': '97688625',
      'mediaType': 'video'
    },
    expected4 = {
      'provider': 'vimeo',
      'id': '24069938',
      'mediaType': 'video'
    },
    testPairs = {
      'https://vimeo.com/97276391': expected1,
      'https://vimeo.com/channels/staffpicks/97276391': expected1,
      'https://vimeo.com/album/2903155/video/96186586': expected2,
      'https://vimeo.com/groups/shortfilms/videos/97688625': expected3,
      'http://vimeopro.com/staff/frame/video/24069938': expected4
    };

  assertURLTestPairs(assert, testPairs);
});

QUnit.test("Regular YouTube URLs", function(assert) {
  var expected1 = {
      'provider': 'youtube',
      'id': 'HRb7B9fPhfA',
      'mediaType': 'video',
      startTime: 30
    },
    expected2 = {
      'provider': 'youtube',
      'id': 'HRb7B9fPhfA',
      'mediaType': 'video'
    },
    testPairs = {
      'http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA#t=30s': expected1,
      'http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA&t=30s': expected1,
      'http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA': expected2,
      'http://youtu.be/HRb7B9fPhfA?t=30s': expected1,
      'http://youtu.be/HRb7B9fPhfA#t=30s': expected1,
      'http://youtu.be/HRb7B9fPhfA': expected2,
      'https://m.youtube.com/details?v=HRb7B9fPhfA#t=30s': expected1,
      'https://m.youtube.com/details?v=HRb7B9fPhfA': expected2
    };

  assertURLTestPairs(assert, testPairs);
});
QUnit.test("Playlist YouTube URLs", function(assert) {
  //https://www.youtube.com/watch?v=AdQcd3sKGC8&list=PL46F0A159EC02DF82&index=9
  var expected1A = {
      'provider': 'youtube',
      'id': 'yQaAGmHNn9s',
      'playlistId': 'PL46F0A159EC02DF82',
      'mediaType': 'video',
      startTime: 100
    },
    expected1B = {
      'provider': 'youtube',
      'id': 'yQaAGmHNn9s',
      'playlistId': 'PL46F0A159EC02DF82',
      'mediaType': 'video'
    },
    expected1C = {
      'provider': 'youtube',
      'id': '6xLcSTDeB7A',
      'playlistId': 'PL46F0A159EC02DF82',
      'playlistIndex': 25,
      'mediaType': 'video'
    },
    expected1D = {
      'provider': 'youtube',
      'id': '6xLcSTDeB7A',
      'playlistId': 'PL46F0A159EC02DF82',
      'playlistIndex': 25,
      'mediaType': 'video',
      startTime: 100
    },

    expected2 = {
      'provider': 'youtube',
      'playlistId': 'PL46F0A159EC02DF82',
      'mediaType': 'playlist'
    },
    testPairs = {
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40': expected1A,
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82&t=1m40': expected1A,
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82': expected1B,
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25': expected1C,
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82': expected1C,
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25#t=1m40': expected1D,
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25&t=1m40': expected1D,
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82&t=1m40': expected1D,
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82#t=1m40': expected1D,
      'http://www.youtube.com/embed/videoseries?list=PL46F0A159EC02DF82': expected2,
      'http://www.youtube.com/playlist?list=PL46F0A159EC02DF82': expected2,
    };

  assertURLTestPairs(assert, testPairs);
});

QUnit.test("Feed YouTube URLs", function(assert) {
  var expected = {
      'provider': 'youtube',
      'id': 'HRb7B9fPhfA',
      'mediaType': 'video'
    },
    testPairs = {
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA/related?v=2': expected,
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA?v=2': expected,
      'https://www.youtube.com/v/HRb7B9fPhfA?version=3&f=videos&app=youtube_gdata': expected
    };

  assertURLTestPairs(assert, testPairs);
});
