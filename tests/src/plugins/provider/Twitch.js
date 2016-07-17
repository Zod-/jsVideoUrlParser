QUnit.test('Twitch Stream URLs', function (assert) {
  'use strict';
  var vi = {
    provider: 'twitch',
    channel: 'rains8',
    mediaType: 'stream'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://twitch.tv/rains8',
      embed: '//www.twitch.tv/rains8/embed'
    },
    urls: ['http://www.twitch.tv/rains8',
      'http://www.twitch.tv/widgets/live_embed_player.swf\
      ?channel=rains8',
      'http://twitch.tv/rains8/chat?popout=',
      '//www.twitch.tv/rains8/embed'
    ]
  }];
  assertUrlTest(assert, tests);
});

QUnit.test('Twitch Video URLs', function (assert) {
  'use strict';
  var vi = {
    provider: 'twitch',
    id: '75292411',
    idPrefix: 'v',
    channel: 'rains8',
    mediaType: 'video'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://twitch.tv/rains8/v/75292411'
    },
    urls: ['http://www.twitch.tv/rains8/v/75292411']
  }];
  assertUrlTest(assert, tests);
});
