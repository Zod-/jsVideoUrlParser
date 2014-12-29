QUnit.test("Vimeo URLs", function(assert) {
  var expected1 = {
      'provider': 'vimeo',
      'videoId': '97276391',
      'mediaType': 'video'
    },
    expected2 = {
      'provider': 'vimeo',
      'videoId': '96186586',
      'mediaType': 'video'
    },
    expected3 = {
      'provider': 'vimeo',
      'videoId': '97688625',
      'mediaType': 'video'
    },
    expected4 = {
      'provider': 'vimeo',
      'videoId': '24069938',
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
