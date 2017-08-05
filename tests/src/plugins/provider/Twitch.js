var tw1 = 'https://clips.twitch.tv/';
QUnit.test('Twitch Stream Urls', function (assert) {
  var vi = {
    provider: 'twitch',
    channel: 'rains8',
    mediaType: 'stream'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://twitch.tv/rains8',
      embed: 'https://player.twitch.tv/?channel=rains8'
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
  var vi = {
    provider: 'twitch',
    id: 'v75292411',
    mediaType: 'video'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://twitch.tv/videos/75292411',
      embed: 'https://player.twitch.tv/?video=v75292411'
    },
    urls: ['http://www.twitch.tv/videos/75292411']
  }, {
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://twitch.tv/videos/75292411?t=90s',
      embed: 'https://player.twitch.tv/?t=90s&video=v75292411'
    },
    urls: ['https://www.twitch.tv/videos/75292411?t=1m30s']
  }];
  tests[1].videoInfo.params = {
    start: 90
  };
  assertUrlTest(assert, tests);
});

QUnit.test('Twitch Clip Urls', function (assert) {
  var vi = {
    provider: 'twitch',
    id: 'SuspiciousImpartialLarkItsBoshyTime',
    mediaType: 'clip'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: tw1 + 'SuspiciousImpartialLarkItsBoshyTime',
      embed: tw1 + 'embed?clip=SuspiciousImpartialLarkItsBoshyTime'
    },
    urls: [
      tw1 + 'SuspiciousImpartialLarkItsBoshyTime',
      tw1 + 'embed?clip=SuspiciousImpartialLarkItsBoshyTime'
    ]
  }];
  assertUrlTest(assert, tests);
});
