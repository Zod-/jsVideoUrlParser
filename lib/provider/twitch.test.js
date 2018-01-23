const Twitch = require('./twitch');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Twitch());
  return parser;
}

test('Twitch: undefined', () => {
  expect(newParser().parse('https://twitch.com')).toBe(undefined);
});

test('Twitch: stream urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'twitch',
      channel: 'rains8',
      mediaType: 'stream',
    },
    formats: {
      long: 'https://twitch.tv/rains8',
      embed: 'https://player.twitch.tv/?channel=rains8',
    },
    urls: ['http://www.twitch.tv/rains8',
      'http://www.twitch.tv/widgets/live_embed_player.swf?channel=rains8',
      'http://twitch.tv/rains8/chat',
      '//www.twitch.tv/rains8/embed',
    ],
  });
});

test('Twitch: video urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'twitch',
      id: 'v75292411',
      mediaType: 'video',
    },
    formats: {
      long: 'https://twitch.tv/videos/75292411',
      embed: 'https://player.twitch.tv/?video=v75292411',
    },
    urls: ['http://www.twitch.tv/videos/75292411'],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'twitch',
      id: 'v75292411',
      mediaType: 'video',
      params: {
        start: 90,
      },
    },
    formats: {
      long: 'https://twitch.tv/videos/75292411?t=90s',
      embed: 'https://player.twitch.tv/?t=90s&video=v75292411',
    },
    urls: [
      'https://www.twitch.tv/videos/75292411?t=1m30s',
      'https://player.twitch.tv/?t=90s&video=v75292411',
    ],
  });
});

test('Twitch: clip urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'twitch',
      id: 'SuspiciousImpartialLarkItsBoshyTime',
      mediaType: 'clip',
    },
    formats: {
      long: 'https://clips.twitch.tv/SuspiciousImpartialLarkItsBoshyTime',
      embed: 'https://clips.twitch.tv/embed?clip=SuspiciousImpartialLarkItsBoshyTime',
    },
    urls: [
      'https://clips.twitch.tv/SuspiciousImpartialLarkItsBoshyTime',
      'https://clips.twitch.tv/embed?clip=SuspiciousImpartialLarkItsBoshyTime',
    ],
  });
});