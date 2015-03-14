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
