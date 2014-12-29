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

    expected2 = {
      'provider': 'youtube',
      'playlistId': 'PL46F0A159EC02DF82',
      'mediaType': 'playlist'
    },
    testPairs = {
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40': expected1A,
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82&t=1m40': expected1A,
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82': expected1B,
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
