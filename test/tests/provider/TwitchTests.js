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
      'videoId': '2724914',
      "videoIdPrefix": "c"
    },
    testPairs = {
      'http://www.twitch.tv/tsm_wildturtle': expected1,
      'http://www.twitch.tv/widgets/live_embed_player.swf?channel=tsm_wildturtle': expected1,
      'http://twitch.tv/tsm_wildturtle/chat?popout=': expected1,
      'http://www.twitch.tv/tsm_wildturtle/c/2724914': expected2
    };

  assertURLTestPairs(assert, testPairs);
});
