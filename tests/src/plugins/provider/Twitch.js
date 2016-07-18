QUnit.test('Twitch Stream Urls', function (assert) {
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
      'http://twitch.tv/rains8/chat',
      '//www.twitch.tv/rains8/embed'
    ]
  }];
  assertUrlTest(assert, tests);
});

QUnit.test('Twitch Video Urls', function (assert) {
  'use strict';
  var vi = {
    provider: 'twitch',
    id: 'v75292411',
    channel: 'rains8',
    mediaType: 'video'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://twitch.tv/rains8/v/75292411',
      embed: 'https://player.twitch.tv/?video=v75292411'
    },
    urls: ['http://www.twitch.tv/rains8/v/75292411']
  },{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://twitch.tv/rains8/v/75292411?t=90s',
      embed: 'https://player.twitch.tv/?t=90s&video=v75292411'
    },
    urls: ['https://www.twitch.tv/rains8/v/75292411?t=1m30s']
  }];
  tests[1].videoInfo.params = {start: 90};
  assertUrlTest(assert, tests);
});

QUnit.test('Twitch Embed Video Urls', function (assert) {
  'use strict';
  var vi = {
    provider: 'twitch',
    id: 'v75292411',
    mediaType: 'embed-video',
    channel: undefined
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      embed: 'https://player.twitch.tv/?video=v75292411'
    },
    urls: [
      'https://player.twitch.tv/?video=v75292411'
    ]
  },{
    videoInfo: cloneObject(vi),
    formats: {
      embed: 'https://player.twitch.tv/?t=90s&video=v75292411'
    },
    urls: [
      'https://player.twitch.tv/?video=v75292411&t=1m30s'
    ]
  }];
  tests[1].videoInfo.params = {start: 90};
  assertUrlTest(assert, tests);
});
