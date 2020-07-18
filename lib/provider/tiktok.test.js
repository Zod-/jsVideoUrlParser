const TikTok = require('./tiktok');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new TikTok());
  return parser;
}

test('TikTok: undefined', () => {
  expect(newParser().parse('https://www.tiktok.com')).toBe(undefined);
  expect(newParser().create({
    videoInfo: {
      provider: 'tiktok',
    },
  })).toBe(undefined);
  expect(newParser().create({
    videoInfo: {
      provider: 'tiktok',
      mediaType: 'video',
    },
  })).toBe(undefined);
});


// eslint-disable-next-line jest/expect-expect
test('TikTok: video urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'tiktok',
      id: '6850560663916449029',
      channel: 'psg',
      mediaType: 'video',
    },
    formats: {
      long: 'https://www.tiktok.com/@psg/video/6850560663916449029',
    },
    urls: [
      'https://www.tiktok.com/@psg/video/6850560663916449029',
    ],
  });
});
